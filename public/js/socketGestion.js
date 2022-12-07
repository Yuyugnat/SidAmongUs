import { Game } from './game.js';
import { OtherCharacter } from './character.js';
class EventHandlers {
    static setup() {
        const game = Game.getInstance();
        const socket = game.socket;
        socket.on('player-disconnected', id => {
            console.log(game.listOtherPlayers);
            game.listOtherPlayers.forEach(player => {
                if (player.id == id) {
                    console.log(player);
                    player.element.remove();
                }
            });
        });
        socket.on('players-list', (playersList) => {
            console.log('players-list', playersList);
            playersList.forEach(player => {
                if (!player.id)
                    return;
                game.listOtherPlayers.push(new OtherCharacter(player.name || 'no_name', player.id));
            });
        });
        socket.on('new-player', ({ name, id }) => {
            console.log('un nouveau joueur');
            if (!id)
                return;
            game.listOtherPlayers.push(new OtherCharacter(name || 'no_name', id));
        });
        socket.on('move', ({ id, x, y }) => {
            game.listOtherPlayers.forEach(player => {
                if (player.id == id) {
                    player.update(x, y);
                }
            });
        });
        socket.on('player-disconnected', id => {
            console.log(game.listOtherPlayers);
            game.listOtherPlayers.forEach(player => {
                if (player.id == id) {
                    console.log(player);
                    player.element.remove();
                }
            });
        });
        socket.on('player-chat', ({ id, message, x, y }) => {
            if (!game.mainCharacter)
                return;
            const dom = document.createElement('div');
            const xDiff = game.mainCharacter.x - x;
            const yDiff = game.mainCharacter.y - y;
            const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
            if (distance >= 250)
                return;
            const sender = game.listOtherPlayers.find(player => player.id === id);
            if (!sender)
                return;
            console.log('DISPLAY');
            dom.innerHTML = message;
            dom.className = 'chat-message';
            dom.style.left = sender.x + 'px';
            dom.style.top = sender.y - 50 + 'px';
            dom.style.zIndex = '10';
            document.getElementsByTagName('main')[0].appendChild(dom);
            setTimeout(() => {
                dom.remove();
            }, 2000);
        });
    }
}
export { EventHandlers };
