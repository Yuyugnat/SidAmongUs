package main

import (
	"encoding/json"
	"log"
)

type Move struct {
	ID int `json:"id"`
	X  int `json:"x"`
	Y  int `json:"y"`
}

func HandleTest(data string, _ *Client) {
	log.Println("Handling test :", data)
}

type PlayerInfo struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type EnterGameData struct {
	Player string `json:"player"`
	Map    string `json:"map"`
}

func HandleEnterGame(data string, client *Client) {
	log.Println("Handling entering game")

	received := &PlayerInfo{}
	json.Unmarshal([]byte(data), received)

	jsonMap, _ := json.Marshal(Gamemap)

	player := GetGame().newPlayer(client, received.Name, 0, 0)
	playerData, _ := json.Marshal(&PlayerInfo{
		ID:   player.ID,
		Name: player.Name,
	})

	res, _ := json.Marshal(EnterGameData{
		Player: string(playerData),
		Map:    string(jsonMap),
	})

	client.broadcastEventToClient(&Event{
		Type: "player-info",
		Data: string(res),
	})

	client.broadcastToAll(&Event{
		Type: "new-player",
		Data: string(playerData),
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

//	func HandlePlayerDisconnected(data string, client *Client) {
//		log.Println("Handling player disconnected :", data)
//		client.broadcastToAll(&Event{
//			Type: "player-disconnected",
//			Data: data,
//		})
//		// remove the player from the player list
//		for i, player := range PlayersList {
//			if player == *client.player {
//				PlayersList = append(PlayersList[:i], PlayersList[i+1:]...)
//			}
//		}
//		fmt.Println("playerlist:", PlayersList)
//	}

func HandlePlayerChat(data string, client *Client) {
	log.Println("Handling player chat :", data)

	messageData := &IncommingMessage{}
	json.Unmarshal([]byte(data), messageData)

	broadcastMessageData := &BroadcastMessage{
		ID:      messageData.ID,
		X:       client.player.X,
		Y:       client.player.Y,
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

	client.on("test", HandleTest)
	client.on("move", HandleMove)
	client.on("enter-game", HandleEnterGame)
	// client.on("player-disconnected", HandlePlayerDisconnected)
	client.on("chat-message", HandlePlayerChat)
}
