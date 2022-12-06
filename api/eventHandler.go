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
	functions map[string]func(data string, c *websocket.Conn)
}

func newEventHandler() *EventHandler {
	return &EventHandler{
		functions: map[string]func(data string, c *websocket.Conn){},
	}
}

func GetInstance() *EventHandler {
	once.Do(func() {
		instance = newEventHandler()
	})
	return instance
}

func (e *EventHandler) on(event string, f func(string, *websocket.Conn)) {
	e.functions[event] = f
}

func (e *EventHandler) onClientEvent(ev Event, c *websocket.Conn) {
	e.functions[ev.Type](ev.Data, c)
}
