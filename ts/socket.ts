import { Game } from './game.js';
const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class Socket {
	static instance: Socket | null = null;

	public instance = this;
	public ws: WebSocket;
	public functions: Map<string, Function>;

	private constructor(ws: WebSocket) {
		this.instance = this;
		this.ws = ws;
		this.functions = new Map();
		this.ws.onmessage = event => {
			const { type, data } = JSON.parse(event.data);
			console.log('message received', type, JSON.parse(data));
			this.functions.get(type)?.(JSON.parse(data));
		};
	}

	static getInstance(ws: WebSocket) {
		return this.instance || new Socket(ws);
	}

	async send(type: string, data: any) {
		while (this.ws.readyState === 0) {
			await pause(2000);
		} 
		if(type != 'move') console.log('message sent', type, data);
		this.ws.send(JSON.stringify({ type: type, data: JSON.stringify(data) }));
	}

	on(type: string, callback: (data: any) => void) {
		console.log('new listener', type);
		this.functions.set(type, callback.bind(Game.getInstance()));
	}
}

export { Socket };
