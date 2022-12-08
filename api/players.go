package main

type Player struct {
	ID     int    `json:"id"`
	Name   string `json:"name"`
	client *Client
	X      int `json:"x"`
	Y      int `json:"y"`
}
