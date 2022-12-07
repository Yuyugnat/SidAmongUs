package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type connection struct {
	// The websocket connection.
	ws *websocket.Conn

	// The hub.
	h *hub
}
type hub struct {
	// Registered connections. That's a connection pool
	connections map[*connection]bool
}

var NbPlayers = 0

var h = hub{}

// declare PlayerList as a slice
var PlayersList []Player = make([]Player, 0)

var Gamemap = CreateMap("api/map.json")

// Message is a struct

func main() {

	// create a new hub
	h = hub{
		connections: make(map[*connection]bool),
	}

	fmt.Println(Gamemap)

	upgrader := websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,

		// Allow all connections by default
		CheckOrigin: func(r *http.Request) bool { return true },
	}

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}
		h.connections[&connection{ws: conn, h: &h}] = true

		isClose := false

		conn.SetCloseHandler(func(code int, text string) error {
			delete(h.connections, &connection{ws: conn, h: &h})
			id := -1
			for i, player := range PlayersList {
				if player.Conn == conn {
					id = i
				}
			}
			BroadcastEvent(&Event{
				Type: "player-disconnected",
				Data: fmt.Sprint(id),
			}, conn)
			PlayersList = append(PlayersList[:id], PlayersList[id+1:]...)
			NbPlayers -= 1
			isClose = true
			return nil
		})

		log.Println("Client connected")

		jsonPlayersList, _ := json.Marshal(PlayersList)

		conn.WriteJSON(Event{
			Type: "players-list",
			Data: string(jsonPlayersList),
		})

		setUpListeners()

		for !isClose {
			// Read message from browser
			event := &Event{}
			err := conn.ReadJSON(&event)

			if err != nil {
				log.Println("error:", err)
			}

			if event.Type != "move" {
				log.Println("Event received :", event)
			}
			GetInstance().onClientEvent(*event, conn)
		}
		fmt.Println("Client disconnected")
		conn.Close()
	})

	http.Handle("/", http.FileServer(http.Dir("./public/")))

	log.Println("Starting server on :8080")
	log.Println("Open http://localhost:8080/ in your browser")
	http.ListenAndServe(":8080", nil)
}
