package main

import (
	"github.com/gorilla/websocket"
)

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
	for client, _ := range h.clients {
		if client != c {
			client.broadcastEventToClient(event)
		}
	}
}

func BroadcastEventToAll(event *Event) {
	for client, _ := range h.clients {
		client.broadcastEventToClient(event)
	}
}
