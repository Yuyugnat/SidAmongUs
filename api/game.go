package main

import "sync"

var (
	once  sync.Once
	mutex sync.Mutex

	instance *Game
)

type Game struct {
	players []*Player
}

func GetGame() *Game {
	once.Do(func() {
		instance = &Game{
			players: []*Player{},
		}
	})
	return instance
}

func (g *Game) addPlayer(p *Player) {
	mutex.Lock()
	defer mutex.Unlock()

	g.players = append(g.players, p)
}

func (g *Game) removePlayer(p *Player) {

	for i, player := range g.players {
		if player == p {
			mutex.Lock()
			g.players = append(g.players[:i], g.players[i+1:]...)
			mutex.Unlock()
			break
		}
	}
}

func (g *Game) getNbplayers() int {
	return len(g.players)
}

func (g *Game) newPlayer(client *Client, name string, x, y int) *Player {
	p := &Player{
		ID:     g.getNbplayers(),
		Name:   name,
		X:      x,
		Y:      y,
		client: client,
	}
	client.player = p
	g.addPlayer(p)
	return p
}
