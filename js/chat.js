class Chat {
    static input = document.getElementById('chat');
    static isChatOpened = false;

    static handlePressEnter() {
        if (Chat.isChatOpened) {
            this.input.style.display = 'none';
            sendToServer('chat--message', {
                id: parseInt(mainCharacter.id),
                name: mainCharacter.name,
            })
        } else {
            this.input.style.display = 'flex';
        }
    }

    static handleMessageReceived(messageProps) {

    }
}