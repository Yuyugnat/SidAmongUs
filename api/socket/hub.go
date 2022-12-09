package socket

type Hub struct {
	// Registered connections. That's a connection pool
	Clients map[*Client]bool
}
