package responses

import "server-sidamongus/api/models/events"

type Event struct {
	Type events.ClientToServerEvent `json:"type"`
	Data string                     `json:"data"`
}

type Move struct {
	ID int `json:"id"`
	X  int `json:"x"`
	Y  int `json:"y"`
}

type PlayerInfo struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type EnterGameData struct {
	Player string `json:"player"`
	Map    string `json:"map"`
}
