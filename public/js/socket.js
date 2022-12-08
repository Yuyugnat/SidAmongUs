var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Game } from './game.js';
const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));
class Socket {
    constructor(ws) {
        this.instance = this;
        this.instance = this;
        this.ws = ws;
        this.functions = new Map();
        this.ws.onmessage = event => {
            var _a;
            const { type, data } = JSON.parse(event.data);
            console.log('message received', type, JSON.parse(data));
            (_a = this.functions.get(type)) === null || _a === void 0 ? void 0 : _a(JSON.parse(data));
        };
    }
    static getInstance(ws) {
        return this.instance || new Socket(ws);
    }
    send(type, data) {
        return __awaiter(this, void 0, void 0, function* () {
            while (this.ws.readyState === 0) {
                yield pause(2000);
            }
            if (type != 'move')
                console.log('message sent', type, data);
            this.ws.send(JSON.stringify({ type: type, data: JSON.stringify(data) }));
        });
    }
    on(type, callback) {
        console.log('new listener', type);
        this.functions.set(type, callback.bind(Game.getInstance()));
    }
}
Socket.instance = null;
export { Socket };
