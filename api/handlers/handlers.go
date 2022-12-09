package handlers

import (
	"encoding/json"
	"log"
	"server-sidamongus/api/game"
	"server-sidamongus/api/models/events"
	"server-sidamongus/api/models/requests"
	"server-sidamongus/api/socket"
)

type Move struct {
	ID int `json:"id"`
	X  int `json:"x"`
	Y  int `json:"y"`
}

func HandleTest(data string, _ *socket.Client) {
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

func HandleEnterGame(data string, client *socket.Client) {
	log.Println("Handling entering game")

	received := &PlayerInfo{}
	json.Unmarshal([]byte(data), received)

	jsonMap, _ := json.Marshal(game.GetGame().GameMap)

	player := client.CreatePlayer(received.Name)
	playerData, _ := json.Marshal(&PlayerInfo{
		ID:   player.ID,
		Name: player.Name,
	})

	res, _ := json.Marshal(EnterGameData{
		Player: string(playerData),
		Map:    string(jsonMap),
	})

	client.BroadcastEventToClient(&socket.EventEmit{
		Type: events.PLAYER_INFO,
		Data: string(res),
	})

	log.Println(client)

	client.BroadcastToAll(&socket.EventEmit{
		Type: events.NEW_PLAYER,
		Data: string(playerData),
	})

}

func HandleMove(data string, client *socket.Client) {
	move := &Move{}
	json.Unmarshal([]byte(data), move)
	client.BroadcastToAll(&socket.EventEmit{
		Type: events.MOVE_SERVER,
		Data: data,
	})
	client.Player.X = move.X
	client.Player.Y = move.Y
}

//	func HandlePlayerDisconnected(data string, client *Client) {
//		log.Println("Handling player disconnected :", data)
//		client.BroadcastToAll(&Event{
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

func HandlePlayerChat(data string, client *socket.Client) {
	log.Println("Handling player chat :", data)

	messageData := &requests.IncommingMessage{}
	json.Unmarshal([]byte(data), messageData)

	broadcastMessageData := &requests.BroadcastMessage{
		ID:      messageData.ID,
		X:       client.Player.X,
		Y:       client.Player.Y,
		Message: messageData.Message,
	}

	msgString, _ := json.Marshal(broadcastMessageData)

	log.Println(string(msgString))

	socket.BroadcastEventToAll(&socket.EventEmit{
		Type: events.PLAYER_CHAT,
		Data: string(msgString),
	}, client.Hub)

	log.Println("Broadcasting player chat :", string(msgString))
}

func SetUpHandlers(client *socket.Client) {

	// client.On("test", HandleTest)
	client.On(events.MOVE_CLIENT, HandleMove)
	client.On(events.ENTER_GAME, HandleEnterGame)
	// client.On("player-disconnected", HandlePlayerDisconnected)
	client.On(events.CHAT_MESSAGE, HandlePlayerChat)
}
