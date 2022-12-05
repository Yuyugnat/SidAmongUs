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

eventHandler.onChatMessage = ({id, message, x, y}) => {
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
}