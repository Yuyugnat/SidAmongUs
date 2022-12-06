package main

import (
	"sync"

	"github.com/gorilla/websocket"
)

var (
	once     sync.Once
	instance *EventHandler
)

type EventHandler struct {
	conn      *websocket.Conn
	functions map[string]func(data string, c *websocket.Conn)
}

func newEventHandler(c *websocket.Conn) *EventHandler {
	return &EventHandler{
		conn:      c,
		functions: map[string]func(data string, c *websocket.Conn){},
	}
}

func GetInstance(c *websocket.Conn) *EventHandler {
	once.Do(func() {
		instance = newEventHandler(c)
	})
	return instance
}

func (e *EventHandler) on(event string, f func(string, *websocket.Conn)) {
	e.functions[event] = f
}

func (e *EventHandler) onClientEvent(ev Event) {
	e.functions[ev.Type](ev.Data, e.conn)
}
