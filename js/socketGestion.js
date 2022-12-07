const socket = game.socket

socket.on("player-disconnected", (id) => {
    game.listOtherPlayers.forEach(player => {
        if (player.id == id) {
            console.log(player);
            player.element.remove()
        }
    })
})

socket.on("players-list", (playersList) => {
    console.log("players-list", playersList);
    playersList.forEach(player => {
        //CREATION DE PLAYER POUR L'INTERFACE
        const tmp = new OtherCharacter(player.name, player.id)
        addPlayerOnDisplay(tmp);
        game.listOtherPlayers.push(tmp);
    })
})

socket.on("new-player", ({name, id}) => {
    console.log("un nouveau joueur");
    const tmp = new OtherCharacter(name, id)
    addPlayerOnDisplay(tmp);
    game.listOtherPlayers.push(tmp)
})

socket.on("move", ({id, x, y}) => {
    game.listOtherPlayers.forEach(player => {
        if (player.id == id) {
            player.update(x, y)
        }
    })
})

socket.on('player-disconnected', id => {
    document.getElementById('player-display-' + id).remove();
    game.listOtherPlayers.forEach(player => {
        if (player.id == id) {
            console.log(player);
            player.element.remove()
        }
    })
})

socket.on('player-chat', ({id, message, x, y}) => {
    const dom = document.createElement('div');
    const sender = game.listOtherPlayers.find(player => player.id === id) || game.mainCharacter;
    console.log(sender);
    if (!sender.isInPlayerRange()) {
        console.log('NO')
        return;
    } 
    
    dom.innerHTML = message;
    dom.className = 'chat-message';
    dom.style.zIndex = 10;
    
    sender.chatbox.appendChild(dom);

    setTimeout(() => {
        dom.remove();
    }, 2000);
})
