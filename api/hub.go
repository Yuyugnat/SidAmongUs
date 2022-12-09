package main

type Hub struct {
	// Registered connections. That's a connection pool
	clients map[*Client]bool
}
