package main

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/gorilla/websocket"
)

type Event struct {
	Type string `json:"type"`
	Data string `json:"data"`
}

type Move struct {
	ID int `json:"id"`
	X  int `json:"x"`
	Y  int `json:"y"`
}

func BroadcastEvent(event *Event, conn *websocket.Conn) {
	for c := range h.connections {
		if c.ws != conn {
			c.ws.WriteJSON(event)
		}
	}
}

func HandleTest(data string) {
	log.Println("Handling test :", data)
}

func HandleAskForID(conn *websocket.Conn) {
	log.Println("Handling ask for id")
	id := NbPlayers
	NbPlayers += 1
	// send the id to the client
	conn.WriteJSON(Event{
		Type: "id",
		Data: fmt.Sprint(id),
	})

	jsonMap, _ := json.Marshal(Gamemap)

	conn.WriteJSON(Event{
		Type: "map",
		Data: string(jsonMap),
	})
}

func HandleMove(data string, conn *websocket.Conn) {
	// log.Println("Handling move :", data)
	move := &Move{}
	json.Unmarshal([]byte(data), move)
	BroadcastEvent(&Event{
		Type: "move",
		Data: data,
	}, conn)
	// update the player position
	for i, player := range PlayersList {
		if player.Conn == conn {
			PlayersList[i].X = move.X
			PlayersList[i].Y = move.Y
		}
		log.Println(data)
		log.Println("Player", i, ":", PlayersList[i])
	}
}

func HandleEnterGame(data string, conn *websocket.Conn) {
	playerData := &Player{}
	json.Unmarshal([]byte(data), playerData)
	playerData.Conn = conn
	fmt.Println(playerData)

	jsonPlayersList, _ := json.Marshal(PlayersList)

	conn.WriteJSON(Event{
		Type: "players-list",
		Data: string(jsonPlayersList),
	})

	PlayersList = append(PlayersList, *playerData)
	log.Println("Handling enter game :", data)
	log.Println("Players list :", PlayersList)

	BroadcastEvent(&Event{
		Type: "new-player",
		Data: data,
	}, conn)
}

func HandlePlayerDisconnected(data string, conn *websocket.Conn) {
	log.Println("Handling player disconnected :", data)
	BroadcastEvent(&Event{
		Type: "player-disconnected",
		Data: data,
	}, conn)
	// remove the player from the player list
	id := -1
	for i, player := range PlayersList {
		if player.Conn == conn {
			id = i
		}
	}
	PlayersList = append(PlayersList[:id], PlayersList[id+1:]...)
	NbPlayers -= 1
}

func HandlePlayerChat(data string, conn *websocket.Conn) {
	log.Println("Handling player chat :", data)

	messageData := &IncommingMessage{}
	json.Unmarshal([]byte(data), messageData)
	player := PlayersList[messageData.ID]

	broadcastMessageData := &BroadcastMessage{
		ID:      messageData.ID,
		X:       player.X,
		Y:       player.Y,
		Message: messageData.Message,
	}

	msgString, _ := json.Marshal(broadcastMessageData)

	log.Println(string(msgString))

	conn.WriteJSON(Event{
		Type: "player-chat",
		Data: string(msgString),
	})

	BroadcastEvent(&Event{
		Type: "player-chat",
		Data: string(msgString),
	}, conn)

	log.Println("Broadcasting player chat :", string(msgString))
}

func HandleEvent(event *Event, conn *websocket.Conn) {
	switch event.Type {
	case "ask-for-id":
		HandleAskForID(conn)
	case "test":
		HandleTest(event.Data)
	case "move":
		HandleMove(event.Data, conn)
	case "enter-game":
		HandleEnterGame(event.Data, conn)
	case "player-disconnected":
		HandlePlayerDisconnected(event.Data, conn)
	case "chat-message":
		HandlePlayerChat(event.Data, conn)
	}
}
