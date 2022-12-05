package main

import "github.com/gorilla/websocket"

type Player struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	Conn *websocket.Conn
}
