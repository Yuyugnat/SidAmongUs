package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var h *Hub

var Gamemap = CreateMap("api/map.json")

// Message is a struct

func main() {

	// create a new hub
	h = &Hub{
		clients: make(map[*Client]bool),
	}

	fmt.Println(Gamemap)

	upgrader := websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,

		// Allow all connections by default
		CheckOrigin: func(r *http.Request) bool { return true },
	}

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {

		log.Println("New connection")
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}

		client := NewClient(conn)
		h.clients[client] = true
		game := GetGame()

		isClose := false

		conn.SetCloseHandler(func(code int, text string) error {
			log.Println("Client disconnected")
			delete(h.clients, client)

			client.broadcastToAll(&Event{
				Type: "player-disconnected",
				Data: fmt.Sprint(client.player.ID),
			})

			game.removePlayer(client.player)
			isClose = true
			log.Println("new player list: ", game.players)
			return nil
		})

		log.Println("Client connected")

		jsonPlayersList, _ := json.Marshal(game.players)

		client.broadcastEventToClient(&Event{
			Type: "players-list",
			Data: string(jsonPlayersList),
		})

		setUpListeners(client)

		for !isClose {
			// Read message from browser
			event := &Event{}
			err := conn.ReadJSON(&event)

			if err != nil {
				log.Println("error:", err)
			}

			if event.Type != "move" {
				log.Printf("Event %s received from %s ", event, client.conn.RemoteAddr().String())
			}
			client.onClientEvent(*event)
		}
		fmt.Println("Client disconnected")
		conn.Close()
	})

	http.Handle("/", http.FileServer(http.Dir("./public/")))

	log.Println("Starting server on :8080")
	log.Println("Open http://localhost:8080/ in your browser")
	http.ListenAndServe(":8080", nil)
}
