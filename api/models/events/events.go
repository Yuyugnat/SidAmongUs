package events

type ServerToClientEvent string
type ClientToServerEvent string

const (
	ENTER_GAME   ClientToServerEvent = ClientToServerEvent("ENTER_GAME")
	MOVE_CLIENT  ClientToServerEvent = ClientToServerEvent("MOVE")
	CHAT_MESSAGE ClientToServerEvent = ClientToServerEvent("CHAT_MESSAGE")

	NEW_PLAYER          ServerToClientEvent = ServerToClientEvent("NEW_PLAYER")
	PLAYER_DISCONNECTED ServerToClientEvent = ServerToClientEvent("PLAYER_DISCONNECTED")
	MOVE_SERVER         ServerToClientEvent = ServerToClientEvent("MOVE")
	PLAYER_LIST         ServerToClientEvent = ServerToClientEvent("PLAYER_LIST")
	PLAYER_CHAT         ServerToClientEvent = ServerToClientEvent("PLAYER_CHAT")
	PLAYER_INFO         ServerToClientEvent = ServerToClientEvent("PLAYER_INFO")
)
