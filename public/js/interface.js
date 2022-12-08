export const addPlayerOnDisplay = (player) => {
    const list = document.getElementById('playerListDisplay');
    if (!list)
        return console.error('playerListDisplay not found');
    console.log("new player on display");
    const playerDisplay = document.createElement('div');
    playerDisplay.id = 'player-display-' + player.id;
    playerDisplay.classList.add('flex--row');
    playerDisplay.classList.add('player--display');
    const img = document.createElement('img');
    img.classList.add('avatar');
    img.src = player.imgLink;
    const name = document.createElement('div');
    name.classList.add('username');
    name.innerText = player.name;
    playerDisplay.appendChild(img);
    playerDisplay.appendChild(name);
    list.appendChild(playerDisplay);
};
export const removePlayerFromDisplay = (player) => {
    const dom = document.getElementById('player-display-' + player.id);
    dom === null || dom === void 0 ? void 0 : dom.remove();
};
