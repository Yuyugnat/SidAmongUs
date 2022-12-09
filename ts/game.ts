import { GameMap } from './gameMap.js';
import { Character, MainCharacter, OtherCharacter } from './character.js';
import { Socket } from './socket.js';
import { EventHandlers } from './socketGestion.js';
import { Chat } from './chat.js';

const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class Game {
	static instance: Game | null = null;

	static mapWidth = 4300;
	static mapHeight = 2900;
	static gridSize = 20;
	static charSize = 50;

	public socket: Socket;
	public boost: number;

	public pressedKeys: { [key: string]: boolean };

	public mainCharacter: MainCharacter | null;
	public directionX: number;
	public directionY: number;
	public newDirectionX: number;
	public newDirectionY: number;
	public characterName: string;
	public listOtherPlayers: OtherCharacter[];
	public map: GameMap | null;

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
		if (Game.instance == null) Game.instance = new Game();
		return Game.instance;
	}

	setUpSocketListeners() {
		this.socket.on('player-info', async (playerInfo: any) => {
			const { id } = playerInfo;
			const map = JSON.parse(playerInfo.map);
			console.log('player info received', playerInfo);

			this.map = GameMap.getInstance(map.fragments, map.buildings);
			this.mainCharacter = new MainCharacter(this.characterName, id);

			const form = document.getElementById('startScreen');
			if (!form) return console.error('form not found');

			form.remove();

			const main = document.querySelector('main');
			if (!main) return console.error('main not found');

			main.style.filter = 'blur(0px)';
			await this.socket.send('enter-game', {
				id: parseInt(id),
				name: this.characterName,
				x: this.mainCharacter.x,
				y: this.mainCharacter.y
			});

			this.start();
		});

		EventHandlers.setup();
	}

	setUpWindowListeners() {
		window.addEventListener('keydown', e => {
			if (e.code == 'Enter') return Chat.handlePressEnter();
			if (!Chat.isChatOpened) this.pressedKeys[e.code] = true;
		});

		window.addEventListener('keyup', e => {
			this.pressedKeys[e.code] = false;
		});

		document.getElementById('start')?.addEventListener('click', async () => {
			const main = document.getElementsByTagName('main')[0];
			if (!main) return console.error('main not found');
			main.style['display'] = 'block';
			console.log('starting game');
			await this.socket.send('ask-for-id', '');
			const input = document.getElementById('startScreen')?.querySelector('input');
			if (!input) return console.error('input not found');
			this.characterName = input.value == '' ? 'no_name' : input.value;
		});
	}

	async adaptDirection() {
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
		await pause(50);
		this.adaptDirection();
	}

	async gameLoop() {
		const mainCharacter = this.mainCharacter;
		if (!mainCharacter) return console.error('mainCharacter not found');
		if (this.map == null) return console.error('map not found');

		let nextX =
			mainCharacter.x + this.directionX * (Game.gridSize + this.boost);
		let nextY =
			mainCharacter.y + this.directionY * (Game.gridSize + this.boost);

		if (this.map.checkNextPos(nextX, nextY)) {
			mainCharacter.update(nextX, nextY, this.directionX, this.directionY);
		} else if (this.map.checkNextPos(nextX, mainCharacter.y)) {
			mainCharacter.update(
				nextX,
				mainCharacter.y,
				this.directionX,
				this.directionY
			);
		} else if (this.map.checkNextPos(mainCharacter.x, nextY)) {
			mainCharacter.update(
				mainCharacter.x,
				nextY,
				this.directionX,
				this.directionY
			);
		}

		const img = mainCharacter.element.querySelector('img');
		if (!img) return console.error('img not found');

		if (this.directionX == -1) {
			// mainCharacter.element.style.transition = 'transform 50ms linear'
			img.style.transform = 'scaleX(-1)';
			// transform 50ms linear
		} else if (this.directionX == 1) {
			img.style.transform = 'scaleX(1)';
			// mainCharacter.element.style.transition = 'transform 50ms linear'
		}

		for (const otherPlayer of this.listOtherPlayers) {
			let distanceX = mainCharacter.x - otherPlayer.x;
			let distanceY = mainCharacter.y - otherPlayer.y;
			let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

			if (distance < 250) {
				otherPlayer.element.style.opacity = '1';
			} else {
				otherPlayer.element.style.opacity = '0';
			}

			if (distance < 50) {
				otherPlayer.near = true;
			} else {
				otherPlayer.near = false;
			}
		}
		this.boost = this.pressedKeys['ShiftLeft'] ? 5 : 0;
		await pause(50);
		this.gameLoop();
	}

	init() {
		this.setUpWindowListeners();
		this.setUpSocketListeners();
	}

	async start() {
		this.gameLoop();
		this.adaptDirection();
	}
}

export { Game };
