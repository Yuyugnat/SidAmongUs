let listOtherPlayers = []

eventHandler.onPlayersList = (playersList) => {
    console.log("coucou", playersList);
    playersList.forEach(player => {
        console.log(player);
        listOtherPlayers.push(new OtherCharacter(player.name, player.id))
    })
}

eventHandler.onNewPlayer = ({name, id}) => {
    console.log("un nouveau joueur");
    listOtherPlayers.push(new OtherCharacter(name, id))
}

eventHandler.onMove = ({id, x, y}) => {
    listOtherPlayers.forEach(player => {
        if (player.id == id) {
            player.update(x, y)
        }
    })
}

eventHandler.onPlayerDisconnected = (id) => {
    console.log(listOtherPlayers);
    listOtherPlayers.forEach(player => {
        if (player.id == id) {
            console.log(player);
            player.element.remove()
        }
    })
}