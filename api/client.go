package main

import (
	"log"

	"github.com/gorilla/websocket"
)

type Event struct {
	Type string `json:"type"`
	Data string `json:"data"`
}

type Client struct {
	conn      *websocket.Conn
	player    *Player
	functions map[string]func(data string, c *Client)
	hub       *Hub
}

func NewClient(conn *websocket.Conn) *Client {
	return &Client{
		conn:      conn,
		player:    nil,
		functions: map[string]func(data string, c *Client){},
		hub:       h,
	}
}

func (c *Client) broadcastEventToClient(event *Event) {
	c.conn.WriteJSON(event)
}

func (c *Client) on(event string, f func(d string, c *Client)) {
	c.functions[event] = f
}

func (c *Client) onClientEvent(ev Event) {
	f := c.functions[ev.Type]
	if f != nil {
		f(ev.Data, c)
	}

}

func (c *Client) broadcastToAll(event *Event) {
	log.Println("zizi")
	log.Println(h)
	for client := range h.clients {
		if client != c {
			client.broadcastEventToClient(event)
		}
	}
}

func BroadcastEventToAll(event *Event) {
	for client := range h.clients {
		client.broadcastEventToClient(event)
	}
}
