package main

type BroadcastMessage struct {
	ID      int    `json:"id"`
	Message string `json:"message"`
	X       int    `json:"x"`
	Y       int    `json:"y"`
}

type IncommingMessage struct {
	ID      int    `json:"id"`
	Message string `json:"message"`
}
