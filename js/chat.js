class Chat {
    static input = document.getElementById('chat');
    static message = document.getElementById('message');
    static isChatOpened = false;

    static handlePressEnter() {
        console.log('enter');
        if (Chat.isChatOpened) {
            Chat.isChatOpened = false;
            Chat.input.style.display = 'none';
            const message = Chat.message.value;
            Chat.message.value = '';
            Game.getInstance()?.socket.send('chat-message', {
                id: parseInt(Game.getInstance()?.mainCharacter.id),
                message
            })
        } else {
            Chat.isChatOpened = true;
            Chat.input.style.display = 'flex';
            Chat.message.focus();
        }
    }
}