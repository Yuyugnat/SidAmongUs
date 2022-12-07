var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GameMap } from './gameMap.js';
import { MainCharacter } from './character.js';
import { Socket } from './socket.js';
import { EventHandlers } from './socketGestion.js';
import { Chat } from './chat.js';
const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));
class Game {
    constructor() {
        this.socket = Socket.getInstance(new WebSocket('ws://localhost:8080/ws'));
        this.boost = 0;
        this.pressedKeys = {
            KeyW: false,
            KeyA: false,
            KeyS: false,
            KeyD: false
        };
        this.mainCharacter = null;
        this.directionX = 0;
        this.directionY = 0;
        this.newDirectionX = 0;
        this.newDirectionY = 0;
        this.characterName = '';
        this.listOtherPlayers = [];
        this.map = null;
    }
    static getInstance() {
        if (Game.instance == null)
            Game.instance = new Game();
        return Game.instance;
    }
    setUpSocketListeners() {
        this.socket.on('player-info', (playerInfo) => __awaiter(this, void 0, void 0, function* () {
            const { id } = playerInfo;
            const map = JSON.parse(playerInfo.map);
            console.log('player info received', playerInfo);
            this.map = GameMap.getInstance(map.fragments, map.buildings);
            this.mainCharacter = new MainCharacter(this.characterName, id);
            const form = document.getElementById('landingForm');
            if (!form)
                return console.error('form not found');
            form.remove();
            const main = document.querySelector('main');
            if (!main)
                return console.error('main not found');
            main.style.filter = 'blur(0px)';
            yield this.socket.send('enter-game', {
                id: parseInt(id),
                name: this.characterName,
                x: this.mainCharacter.x,
                y: this.mainCharacter.y
            });
            this.start();
        }));
        EventHandlers.setup();
    }
    setUpWindowListeners() {
        var _a;
        window.addEventListener('keydown', e => {
            this.pressedKeys[e.code] = true;
        });
        window.addEventListener('keyup', e => {
            this.pressedKeys[e.code] = false;
            if (e.code == 'Enter') {
                Chat.handlePressEnter();
            }
        });
        (_a = document.getElementById('start')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            var _b;
            console.log('starting game');
            yield this.socket.send('ask-for-id', '');
            const input = (_b = document
                .getElementById('landingForm')) === null || _b === void 0 ? void 0 : _b.querySelector('input');
            if (!input)
                return console.error('input not found');
            this.characterName = input.value == '' ? 'no_name' : input.value;
        }));
    }
    adaptDirection() {
        return __awaiter(this, void 0, void 0, function* () {
            let newDirectionX = 0;
            let newDirectionY = 0;
            if (this.pressedKeys['KeyW']) {
                newDirectionY -= 1;
            }
            if (this.pressedKeys['KeyS']) {
                newDirectionY += 1;
            }
            if (this.pressedKeys['KeyA']) {
                newDirectionX -= 1;
            }
            if (this.pressedKeys['KeyD']) {
                newDirectionX += 1;
            }
            this.directionX = newDirectionX;
            this.directionY = newDirectionY;
            yield pause(50);
            this.adaptDirection();
        });
    }
    gameLoop() {
        return __awaiter(this, void 0, void 0, function* () {
            const mainCharacter = this.mainCharacter;
            if (!mainCharacter)
                return console.error('mainCharacter not found');
            if (this.map == null)
                return console.error('map not found');
            let nextX = mainCharacter.x + this.directionX * (Game.gridSize + this.boost);
            let nextY = mainCharacter.y + this.directionY * (Game.gridSize + this.boost);
            if (this.map.checkNextPos(nextX, nextY)) {
                mainCharacter.update(nextX, nextY, this.directionX, this.directionY);
            }
            else if (this.map.checkNextPos(nextX, mainCharacter.y)) {
                mainCharacter.update(nextX, mainCharacter.y, this.directionX, this.directionY);
            }
            else if (this.map.checkNextPos(mainCharacter.x, nextY)) {
                mainCharacter.update(mainCharacter.x, nextY, this.directionX, this.directionY);
            }
            const img = mainCharacter.element.querySelector('img');
            if (!img)
                return console.error('img not found');
            if (this.directionX == -1) {
                // mainCharacter.element.style.transition = 'transform 50ms linear'
                img.style.transform = 'scaleX(-1)';
                // transform 50ms linear
            }
            else if (this.directionX == 1) {
                img.style.transform = 'scaleX(1)';
                // mainCharacter.element.style.transition = 'transform 50ms linear'
            }
            for (const otherPlayer of this.listOtherPlayers) {
                let distanceX = mainCharacter.x - otherPlayer.x;
                let distanceY = mainCharacter.y - otherPlayer.y;
                let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                if (distance < 250) {
                    otherPlayer.element.style.opacity = '1';
                }
                else {
                    otherPlayer.element.style.opacity = '0';
                }
                if (distance < 50) {
                    otherPlayer.near = true;
                }
                else {
                    otherPlayer.near = false;
                }
            }
            this.boost = this.pressedKeys['ShiftLeft'] ? 5 : 0;
            yield pause(50);
            this.gameLoop();
        });
    }
    init() {
        this.setUpWindowListeners();
        this.setUpSocketListeners();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.gameLoop();
            this.adaptDirection();
        });
    }
}
Game.instance = null;
Game.mapWidth = 4300;
Game.mapHeight = 2900;
Game.gridSize = 20;
Game.charSize = 50;
export { Game };
