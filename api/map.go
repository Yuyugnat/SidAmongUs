package main

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
)

type MapFragment struct {
	Id     int `json:"id"`
	X      int `json:"x"`
	Y      int `json:"y"`
	Width  int `json:"width"`
	Height int `json:"height"`
}

type Building struct {
	Id     int    `json:"id"`
	X      int    `json:"x"`
	Y      int    `json:"y"`
	Width  int    `json:"width"`
	Height int    `json:"height"`
	Link   string `json:"link"`
}

type Map struct {
	Fragments []MapFragment `json:"fragments"`
	Buildings []Building    `json:"buildings"`
}

func CreateMap(path string) *Map {
	m := &Map{
		Fragments: make([]MapFragment, 0),
		Buildings: make([]Building, 0),
	}
	m.loadMap(path)
	return m
}

func (m *Map) loadMap(path string) {
	jsonFile, err := os.Open(path)

	if err != nil {
		fmt.Println(err)
	}

	defer jsonFile.Close()

	byteFile, err := io.ReadAll(jsonFile)

	if err != nil {
		fmt.Println(err)
	}

	err = json.Unmarshal(byteFile, &m)

	if err != nil {
		fmt.Println(err)
	}
}
