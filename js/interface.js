const addPlayerOnDisplay = (player) => {
    const list = document.getElementById('playerListDisplay')
    const playerDisplay = document.createElement('div');
    playerDisplay.id = 'player-display-' + player.id;
    playerDisplay.classList.add('flex--row');
    playerDisplay.classList.add('player--display');
    
    const img = document.createElement('img');
    img.classList.add('avatar')
    img.src = player.imgLink;

    const name = document.createElement('div');
    name.classList.add('username');
    name.innerText = player.name;

    playerDisplay.appendChild(img);
    playerDisplay.appendChild(name);
    
    list.appendChild(playerDisplay);
}

removePlayerFromDisplay = (player) => {
    const dom = document.getElementById('player-display-' + player.id);
    dom.remove();
}