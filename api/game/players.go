package game

type Player struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	X    int    `json:"x"`
	Y    int    `json:"y"`
}

func NewPlayer(name string) *Player {
	return &Player{
		ID:   GetGame().GetNbPlayers(),
		Name: name,
		X:    DEFAULT_X,
		Y:    DEFAULT_Y,
	}
}
