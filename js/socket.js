class Socket {
    static instance = null;

    /**
     * @param { WebSocket } ws 
     * @returns {void}
     */
    constructor(ws) {
        if(this.instance) return this.instance;
        this.instance = this;
        this.ws = ws;
        this.functions = new Map();
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const f = this.functions.get(data.type);
            if(f) f(data.data);
        }
    }
    /**
     * @param {WebSocket} ws 
     * @returns {void}
     */
    getInstance(ws) {
        if(!socket.instance) new Socket(ws);
        return socket.instance;
    }

    send(type, data) {
        this.ws.send(JSON.stringify({type: type, data: JSON.stringify(data)}))
    }

    /**
     * @param { string } type 
     * @param { function(data) } callback 
     * @returns { void }
     */
    on(type, callback) {
        this.functions.set(type, callback);
    }

   


}