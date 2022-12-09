package requests

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

type Move struct {
	ID int `json:"id"`
	X  int `json:"x"`
	Y  int `json:"y"`
}

type PlayerInfo struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}
