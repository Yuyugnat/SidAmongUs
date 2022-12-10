import { ClienToServerEvents } from './events.js';
import { Game } from './game.js';

class Chat {
	static input = document.getElementById('chat') as HTMLDivElement;
	static message = document.getElementById('message') as HTMLInputElement;
	static isChatOpened = false;

	static handlePressEnter() {
		console.log('enter');
		if (Chat.isChatOpened) {
			Chat.isChatOpened = false;
			Chat.input.style.display = 'none';
			const message = Chat.message.value;
			Chat.message.value = '';
			Game.getInstance().socket.send(ClienToServerEvents.CHAT_MESSAGE, {
				id: parseInt(Game.getInstance().mainCharacter?.id + ''),
				message
			});
		} else {
			Chat.isChatOpened = true;
			Chat.input.style.display = 'flex';
			Chat.message.focus();
		}
	}
}

export { Chat };
