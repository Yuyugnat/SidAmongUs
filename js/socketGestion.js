const socket = game.socket

socket.on("player-disconnected", (id) => {
    console.log(listOtherPlayers);
    listOtherPlayers.forEach(player => {
        if (player.id == id) {
            console.log(player);
            player.element.remove()
        }
    })
})

socket.on("players-list", (playersList) => {
    console.log("players-list", playersList);
    playersList.forEach(player => {
        console.log(player);
        game.listOtherPlayers.push(new OtherCharacter(player.name, player.id))
    })
})

socket.on("new-player", ({name, id}) => {
    console.log("un nouveau joueur");
    game.listOtherPlayers.push(new OtherCharacter(name, id))
})

socket.on("move", ({id, x, y}) => {
    game.listOtherPlayers.forEach(player => {
        if (player.id == id) {
            player.update(x, y)
        }
    })
})

socket.on('player-disconnected', id => {
    console.log(listOtherPlayers);
    listOtherPlayers.forEach(player => {
        if (player.id == id) {
            console.log(player);
            player.element.remove()
        }
    })
})

socket.on('chat-message', ({id, message, x, y}) => {
    const dom = document.createElement('div');
    const xDiff = mainCharacter.x - x;
    const yDiff =  mainCharacter.y - y;
    const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);

    if (distance >= 250) return;

    const sender = listOtherPlayers.find(player => player.id === id);
    console.log('DISPLAY')
    
    dom.innerHTML = message;
    dom.className = 'chat-message';
    dom.style.left = sender.x + 'px';
    dom.style.top = sender.y - 50 + 'px';
    dom.style.zIndex = 10;
    document.getElementsByTagName('main')[0].appendChild(dom);

    setTimeout(() => {
        dom.remove();
    }, 2000);
})
// socket.on("move", (playersList) => {
//     console.log("coucou", playersList);
//     playersList.forEach(player => {
//         console.log(player);
//         game.listOtherPlayers.push(new OtherCharacter(player.name, player.id))
//     })
// })

/*
switch (event.type) {
                case 'id':
                    eventHandler.onId(event.data);
                    break
                case 'players-list':
                    eventHandler.onPlayersList(JSON.parse(event.data));
                    break
                case 'new-player':
                    eventHandler.onNewPlayer(JSON.parse(event.data));
                    break
                case 'player-disconnected':
                    console.log('launch the event', event.type);
                    console.log(eventHandler.onPlayerDisconnected);
                    eventHandler.onPlayerDisconnected(parseInt(event.data));
                    break
                case 'move':
                    eventHandler.onMove(JSON.parse(event.data));
                    break
                case 'map':
                    eventHandler.onMap(JSON.parse(event.data));
                    break
            }
*/
