export class Socket {
    static instance = null;

    /**
     * @param { WebSocket } ws 
     * @returns {Socket}
     */
    constructor(ws) {
        if(this.instance) return this.instance;
        this.instance = this;
        this.ws = ws;
        this.functions = new Map();
        this.ws.onmessage = (event) => {
            const {type ,data} = JSON.parse(event.data);
            console.log("message received", type, JSON.parse(data));
            this.functions.get(type)?.(JSON.parse(data));
        }
        this.map = null;
    }
    /**
     * @param {WebSocket} ws 
     * @returns {Socket}
     */
    static getInstance(ws) {
        return this.instance || new Socket(ws);
    }

    send(type, data) {
        console.log("message sent", type, data);
        this.ws.send(JSON.stringify({type: type, data: JSON.stringify(data)}))
    }

    /**
     * @param { string } type 
     * @param { function(data) } callback 
     * @returns { void }
     */
    on(type, callback) {
        console.log("new listener", type);
        this.functions.set(type, callback.bind(Game.getInstance()));
    }
}