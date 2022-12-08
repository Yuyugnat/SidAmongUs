package main

import (
	"encoding/json"
	"fmt"
	"log"
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

func HandleTest(data string, _ *Client) {
	log.Println("Handling test :", data)
}

type AskIdData struct {
	Id  int    `json:"id"`
	Map string `json:"map"`
}

func HandleAskForID(_ string, client *Client) {
	log.Println("Handling ask for id")
	id := NbPlayers
	NbPlayers += 1
	// send the id to the client
	client.broadcastEventToClient(&Event{
		Type: "id",
		Data: fmt.Sprint(id),
	})

	jsonMap, _ := json.Marshal(Gamemap)

	dataMap, _ := json.Marshal(AskIdData{
		Id:  id,
		Map: string(jsonMap),
	})

	client.broadcastEventToClient(&Event{
		Type: "player-info",
		Data: string(dataMap),
	})
}

func HandleMove(data string, client *Client) {
	move := &Move{}
	json.Unmarshal([]byte(data), move)
	client.broadcastToAll(&Event{
		Type: "move",
		Data: data,
	})
	client.player.X = move.X
	client.player.Y = move.Y
}

func HandleEnterGame(data string, client *Client) {
	client.player = &Player{}
	json.Unmarshal([]byte(data), client.player)

	fmt.Println(client.player)

	PlayersList = append(PlayersList, *client.player)
	log.Println("Handling enter game :", data)
	log.Println("Players list :", PlayersList)

	client.broadcastToAll(&Event{
		Type: "new-player",
		Data: data,
	})
}

func HandlePlayerDisconnected(data string, client *Client) {
	log.Println("Handling player disconnected :", data)
	client.broadcastToAll(&Event{
		Type: "player-disconnected",
		Data: data,
	})
	// remove the player from the player list
	for i, player := range PlayersList {
		if player == *client.player {
			PlayersList = append(PlayersList[:i], PlayersList[i+1:]...)
		}
	}
	fmt.Println("playerlist:", PlayersList)
}
func HandlePlayerChat(data string, client *Client) {
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

	client.broadcastEventToClient(&Event{
		Type: "player-chat",
		Data: string(msgString),
	})

	client.broadcastEventToClient(&Event{
		Type: "player-chat",
		Data: string(msgString),
	})

	log.Println("Broadcasting player chat :", string(msgString))
}

func setUpListeners(client *Client) {

	client.on("ask-for-id", HandleAskForID)
	client.on("test", HandleTest)
	client.on("move", HandleMove)
	client.on("enter-game", HandleEnterGame)
	client.on("player-disconnected", HandlePlayerDisconnected)
	client.on("chat-message", HandlePlayerChat)
}
