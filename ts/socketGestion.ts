import { Game } from './game.js';
import { OtherCharacter } from './character.js';
import { addPlayerOnDisplay } from './interface.js';
import { ClienToServerEvents, ServerToClientEvents} from './events.js';

class EventHandlers {
	static setup() {
		const game = Game.getInstance();
		const socket = game.socket;

		socket.on(ServerToClientEvents.PLAYER_LIST, (playersList: any[]) => {
			console.log('players-list', playersList);
			playersList.forEach(player => {
				console.log("zizi");
				
				const tmp = new OtherCharacter(player.name, player.id)
				addPlayerOnDisplay(tmp);
				game.listOtherPlayers.push(tmp);
			});
		});

		socket.on(ServerToClientEvents.NEW_PLAYER, ({ name, id }) => {
			console.log('un nouveau joueur');
			const tmp = new OtherCharacter(name, id)
			addPlayerOnDisplay(tmp);
			game.listOtherPlayers.push(tmp)
		});

		socket.on(ServerToClientEvents.MOVE, ({ id, x, y }) => {
			game.listOtherPlayers.forEach(player => {
				if (player.id == id) {
					player.update(x, y);
				}
			});
		});

		socket.on(ServerToClientEvents.PLAYER_DISCONNECTED, id => {
			console.log("zizi",id);
			
			document.getElementById('player-display-' + id)?.remove();
			game.listOtherPlayers.forEach(player => {
				if (player.id == id) {
					console.log(player);
					player.element.remove();
				}
			});
		});

		socket.on(ServerToClientEvents.PLAYER_CHAT, ({ id, message }) => {
			if (!game.mainCharacter) return;

			const dom = document.createElement('div');

			const sender = game.listOtherPlayers.find(player => player.id === id) || game.mainCharacter;
			if (!sender.isInPlayerRange()) return;
			
			dom.innerHTML = message;
			dom.className = 'chat-message';
			dom.style.left = `${ sender.x }px`;
			dom.style.top = `${ sender.y - 50 }px`;
			dom.style.zIndex = '10';
			document.getElementsByTagName('main')[0].appendChild(dom);

			setTimeout(() => {
				dom.remove();
			}, 2000);
		});
	}
}

export { EventHandlers };
