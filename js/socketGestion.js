let listOtherPlayers = []

socket.on('players-list', (playersList) => {
    console.log(playersList);
    playersList.forEach(player => {
        listOtherPlayers.push(new OtherCharacter(player.name, player.id))
    })
})

socket.on('new-player', ({name, id}) => {
    console.log("un nouveau joueur");
    listOtherPlayers.push(new OtherCharacter(name, id))
})

socket.on('move', ({id, x, y}) => {
    listOtherPlayers.forEach(player => {
        if (player.id == id) {
            player.update(x, y)
        }
        })
})

socket.on('player-disconnected', ({socket}) => {
    listOtherPlayers.forEach(player => {
        if (player.id == socket) {
            player.element.remove()
        }
    })
})