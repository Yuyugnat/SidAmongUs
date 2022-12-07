import { Game } from './game.js';
class Chat {
    static handlePressEnter() {
        var _a, _b;
        console.log('enter');
        if (Chat.isChatOpened) {
            Chat.isChatOpened = false;
            Chat.input.style.display = 'none';
            const message = Chat.message.value;
            Chat.message.value = '';
            (_a = Game.getInstance()) === null || _a === void 0 ? void 0 : _a.socket.send('chat-message', {
                id: parseInt(((_b = Game.getInstance().mainCharacter) === null || _b === void 0 ? void 0 : _b.id) + ''),
                message
            });
        }
        else {
            Chat.isChatOpened = true;
            Chat.input.style.display = 'flex';
            Chat.message.focus();
        }
    }
}
Chat.input = document.getElementById('chat');
Chat.message = document.getElementById('message');
Chat.isChatOpened = false;
export { Chat };
