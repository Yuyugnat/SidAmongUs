package game

import (
	"sync"
)

var (
	once  sync.Once
	mutex sync.Mutex

	instance *Game
)

type Game struct {
	Players []*Player
	GameMap *Map
}

func GetGame() *Game {
	once.Do(func() {
		instance = &Game{
			Players: []*Player{},
			GameMap: CreateMap("api/map.json"),
		}
	})
	return instance
}

func (g *Game) AddPlayer(p *Player) {
	mutex.Lock()
	defer mutex.Unlock()

	g.Players = append(g.Players, p)
}

func (g *Game) RemovePlayer(p *Player) {

	for i, player := range g.Players {
		if player == p {
			mutex.Lock()
			g.Players = append(g.Players[:i], g.Players[i+1:]...)
			mutex.Unlock()
			break
		}
	}
}

func (g *Game) GetNbPlayers() int {
	return len(g.Players)
}
