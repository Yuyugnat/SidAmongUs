import { Game } from './game.js';
import { OtherCharacter } from './character.js';
import { addPlayerOnDisplay } from './interface.js';
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
                if (!player.id == undefined)
                    return;
                const tmp = new OtherCharacter(player.name, player.id);
                addPlayerOnDisplay(tmp);
                game.listOtherPlayers.push(tmp);
            });
        });
        socket.on('new-player', ({ name, id }) => {
            console.log('un nouveau joueur');
            if (!id)
                return;
            const tmp = new OtherCharacter(name, id);
            addPlayerOnDisplay(tmp);
            game.listOtherPlayers.push(tmp);
        });
        socket.on('move', ({ id, x, y }) => {
            game.listOtherPlayers.forEach(player => {
                if (player.id == id) {
                    player.update(x, y);
                }
            });
        });
        socket.on('player-disconnected', id => {
            var _a;
            (_a = document.getElementById('player-display-' + id)) === null || _a === void 0 ? void 0 : _a.remove();
            game.listOtherPlayers.forEach(player => {
                if (player.id == id) {
                    console.log(player);
                    player.element.remove();
                }
            });
        });
        socket.on('player-chat', ({ id, message }) => {
            if (!game.mainCharacter)
                return;
            const dom = document.createElement('div');
            const sender = game.listOtherPlayers.find(player => player.id === id) || game.mainCharacter;
            if (!sender.isInPlayerRange())
                return;
            dom.innerHTML = message;
            dom.className = 'chat-message';
            dom.style.left = `${sender.x}px`;
            dom.style.top = `${sender.y - 50}px`;
            dom.style.zIndex = '10';
            document.getElementsByTagName('main')[0].appendChild(dom);
            setTimeout(() => {
                dom.remove();
            }, 2000);
        });
    }
}
export { EventHandlers };
