package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"server-sidamongus/api/game"
	"server-sidamongus/api/handlers"
	"server-sidamongus/api/models/events"
	"server-sidamongus/api/socket"

	"github.com/gorilla/websocket"
)

var h *socket.Hub

// var Gamemap = CreateMap("api/map.json")

// Message is a struct

func main() {

	// create a new hub
	h = &socket.Hub{
		Clients: make(map[*socket.Client]bool),
	}

	game := game.GetGame()
	fmt.Println(game.GameMap)

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

		client := socket.NewClient(conn, h)

		isClose := false

		conn.SetCloseHandler(func(code int, text string) error {
			log.Println("Client disconnected")
			delete(h.Clients, client)

			client.BroadcastToAll(&socket.EventEmit{
				Type: events.PLAYER_DISCONNECTED,
				Data: fmt.Sprint(client.Player.ID),
			})

			game.RemovePlayer(client.Player)
			isClose = true
			log.Println("new player list: ", game.Players)
			return nil
		})

		log.Printf("Client connected : %s", conn.RemoteAddr().String())

		jsonPlayersList, _ := json.Marshal(game.Players)

		client.BroadcastEventToClient(&socket.EventEmit{
			Type: events.PLAYER_LIST,
			Data: string(jsonPlayersList),
		})

		handlers.SetUpHandlers(client)

		for !isClose {
			// Read message from browser
			event := &socket.EventReceived{}
			err := conn.ReadJSON(&event)

			if err != nil {
				log.Println("error:", err)
			}

			if event.Type != "move" {
				log.Printf("Event %s received from %s ", event, client.Conn.RemoteAddr().String())
			}
			go client.OnClientEvent(*event)
		}
		fmt.Println("Client disconnected")
		conn.Close()
	})

	http.Handle("/", http.FileServer(http.Dir("./public/")))

	log.Println("Starting server on :8080")
	log.Println("Open http://localhost:8080/ in your browser")
	http.ListenAndServe(":8080", nil)
}
