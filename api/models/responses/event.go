package responses

import "server-sidamongus/api/models/events"

type Event struct {
	Type events.ClientToServerEvent `json:"type"`
	Data string                     `json:"data"`
}
