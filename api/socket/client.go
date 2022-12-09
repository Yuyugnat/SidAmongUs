package socket

import (
	"log"
	"server-sidamongus/api/game"
	"server-sidamongus/api/models/events"

	"github.com/gorilla/websocket"
)

type EventReceived struct {
	Type events.ClientToServerEvent `json:"type"`
	Data string                     `json:"data"`
}

type EventEmit struct {
	Type events.ServerToClientEvent `json:"type"`
	Data string                     `json:"data"`
}

type Client struct {
	Conn      *websocket.Conn
	Player    *game.Player
	Functions map[events.ClientToServerEvent]func(data string, c *Client)
	Hub       *Hub
}

func NewClient(conn *websocket.Conn, h *Hub) *Client {
	c := &Client{
		Conn:      conn,
		Player:    nil,
		Functions: map[events.ClientToServerEvent]func(data string, c *Client){},
		Hub:       h,
	}
	h.Clients[c] = true
	return c
}

func (c *Client) BroadcastEventToClient(event *EventEmit) {
	c.Conn.WriteJSON(event)
}

func (c *Client) On(event events.ClientToServerEvent, f func(d string, c *Client)) {
	c.Functions[event] = f
}

func (c *Client) OnClientEvent(ev EventReceived) {
	f := c.Functions[ev.Type]
	if f != nil {
		f(ev.Data, c)
	}

}

func (c *Client) BroadcastToAll(event *EventEmit) {
	log.Println(c.Hub)
	for client := range c.Hub.Clients {
		if client != c {
			client.BroadcastEventToClient(event)
		}
	}
}

func BroadcastEventToAll(event *EventEmit, h *Hub) {
	for client := range h.Clients {
		client.BroadcastEventToClient(event)
	}
}

func (c *Client) CreatePlayer(name string) *game.Player {
	p := game.NewPlayer(name)
	game.GetGame().AddPlayer(p)
	c.Player = p
	return p
}
