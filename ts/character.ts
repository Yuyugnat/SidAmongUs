import { Game } from './game.js';

class Character {
    public name: string;
    public id: number;
    public x: number;
    public y: number;
    public width: number;
    public directionX: number;
    public directionY: number;
    public height: number;
    public imgLink: string;

    public element!: HTMLDivElement;

    constructor(username: string, id: number) {
        this.name = username;
        this.id = id;
        this.x = 2100;
        this.y = 1500;
        this.width = 50;
        this.directionX = 0;
        this.directionY = 0;
        this.height = 50;
        this.imgLink = `img/sidamongus-${this.id % 8}.png`;
    }

    create() {
        this.element = document.createElement('div');
        this.element.id = `character-${this.id}`;
        this.element.classList.add('character');
        let img = document.createElement('img');
        img.src = this.imgLink;
        this.element.appendChild(img);
        let name = document.createElement('div');
        name.classList.add('name');
        name.innerText = this.name;
        this.element.appendChild(name);
    }

    render() {
        this.update(this.x, this.y);
    }

    update(x: number, y: number) {
        console.log('updating character', this.id);
        this.x = x;
        this.y = y;
    }
}

class MainCharacter extends Character {
    constructor(name: string, id: number) {
        super(name, id);
        this.create();
    }

    create() {
        super.create();
        this.element.classList.add('main-character');
        let shadow = document.createElement('div');
        shadow.classList.add('shadow');
        this.element.appendChild(shadow);
        let name = document.createElement('div');
        name.classList.add('name');
        name.innerText = this.name;
        this.element?.appendChild(name);
        this.render();
    }

    render() {
        super.render();
        document.body.appendChild(this.element);
    }

    update(x: number, y: number, directionX?: number, directionY?: number) {
        super.update(x, y);
        this.directionX = directionX || this.directionX;
        this.directionY = directionY || this.directionY;
        let xTranslation = x;
        let yTranslation = y;
        let ownXTranslation = 0;
        let ownYTranslation = 0;
        if (this.x < window.innerWidth / 2) {
            xTranslation = window.innerWidth / 2;
            ownXTranslation = this.x - window.innerWidth / 2;
        } else if (this.x + Game.charSize > Game.mapWidth - window.innerWidth / 2) {
            xTranslation = Game.mapWidth - window.innerWidth / 2 - Game.charSize;
            ownXTranslation =
                this.x - (Game.mapWidth - window.innerWidth / 2) + Game.charSize;
        }

        if (this.y < window.innerHeight / 2) {
            yTranslation = window.innerHeight / 2;
            ownYTranslation = this.y - window.innerHeight / 2;
        } else if (
            this.y + Game.charSize >
            Game.mapHeight - window.innerHeight / 2
        ) {
            yTranslation = Game.mapHeight - window.innerHeight / 2 - Game.charSize;
            ownYTranslation =
                this.y - (Game.mapHeight - window.innerHeight / 2) + Game.charSize;
        }

        this.element.style.transform = `translate(${ownXTranslation}px, ${ownYTranslation}px)`;
        const main = document.querySelector('main');
        if (!main) return console.error('main not found');
        main.style.transform = `translate(${-xTranslation}px, ${-yTranslation}px)`;
        if (this.directionX !== 0 || this.directionY !== 0)
            Game.getInstance().socket.send('move', {
                id: this.id,
                x: this.x,
                y: this.y
            });
    }
}

class OtherCharacter extends Character {
    public near: boolean;

    constructor(name: string, id: number) {
        super(name, id);
        this.create();
        this.near = false;
    }

    create() {
        super.create();
        this.element.classList.add('other-character');
        this.render();
    }

    render() {
        super.render();
        document.querySelector('main')?.appendChild(this.element);
        this.element.addEventListener('click', () => {
            console.log('click');
        });
        this.element.addEventListener('mouseover', () => {
            console.log('over');
            if (this.near) {
                this.element.classList.add('clickable');
            }
        });
    }

    update(x: number, y: number) {
        super.update(x, y);
        this.element.style.transform = `translate(${x}px, ${y}px)`;
    }
}

export { Character, MainCharacter, OtherCharacter };
