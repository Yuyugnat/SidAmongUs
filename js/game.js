const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class Game {

    // singleton
    static instance =  null

    static mapWidth = 4300
    static mapHeight = 2900
    static gridSize = 5;
    static charSize = 50;

    constructor() {
        this.socket = Socket.getInstance(new WebSocket('ws://localhost:8080/ws'))
        this.boost = 0
        this.pressedKeys = {
            'KeyW': false,
            'KeyA': false,
            'KeyS': false,
            'KeyD': false
        };
        this.mainCharacter = null
        this.directionX = 0
        this.directionY = 0
        this.characterName = ""
        this.listOtherPlayers = []
        this.map = null
    }
    
    
    static getInstance() {
        if (Game.instance == null) Game.instance = new Game()
        return Game.instance
    }
    

    setUpSocketListeners() {
        this.socket.on("map", function (gameMap) {
            this.map = new GameMap(gameMap.fragments,gameMap.buildings)
            console.log("done");
        })

        this.socket.on("id", function (id) {
            console.log("id received");
            this.mainCharacter = new MainCharacter(this.characterName, id)
            const form = document.getElementById('landingForm')
            console.log(form);
            form.remove()
            document.querySelector('main').style.filter = 'blur(0px)'
            this.socket.send('enter-game', {
                id: parseInt(id),
                name: this.characterName,
                x: this.mainCharacter.x,
                y: this.mainCharacter.y,
            })
            this.start()
        })
    }
    

    setUpWindowListeners() {
        document.addEventListener('keydown', e => {
            console.log("keydown", e.code);
            this.pressedKeys[e.code] = true;
        })
        
        document.addEventListener('keyup', e => {
            console.log("down", e.code);
            this.pressedKeys[e.code] = false
        })

        document.getElementById('start').addEventListener('click', () => {
            console.log("starting game")
            this.socket.send('ask-for-id', '')
            const value = document.getElementById('landingForm').querySelector('input').value
            this.characterName = value == "" ? 'no_name' : value
        })
    }

    
    
    async adaptDirection() {
        console.log("adapt direction", this.pressedKeys);
        this.newDirectionX = 0
        this.newDirectionY = 0
        if (this.pressedKeys['KeyW']) {
            this.newDirectionY = -1
        }
        if (this.pressedKeys['KeyS']) {
            this.newDirectionY = 1
        }
        if (this.pressedKeys['KeyA']) {
            this.newDirectionX = -1
        }
        if (this.pressedKeys['KeyD']) {
            this.newDirectionX = 1
        }
        await pause(500)
        this.adaptDirection()
    }

    async gameLoop() {
        const mainCharacter = this.mainCharacter
        console.log("game-loop");
        console.log(this);
        console.log(this.map);
        let nextX = mainCharacter.x + this.directionX * (Game.gridSize +this.boost)
        let nextY = mainCharacter.y + this.directionY * (Game.gridSize +this.boost)
        if (this.map.checkNextPos(nextX, nextY)) {
           mainCharacter.update(nextX, nextY, this.directionX, this.directionY)
        } else if (checkNextPos(nextX, mainCharacter.y)) {
            mainCharacter.update(nextX, mainCharacter.y, this.directionX, 0)
        } else if (checkNextPos(mainCharacter.x, nextY)) {
            mainCharacter.update(mainCharacter.x, nextY, 0, this.directionY)
        }
        if (this.directionX == -1) {
            mainCharacter.element.querySelector('img').style.transform = 'rotateY(180deg)'
        } else if (this.directionX == 1) {
            mainCharacter.element.querySelector('img').style.transform = 'rotateY(0deg)'
        }
    
        for (const otherPlayer of this.listOtherPlayers) {
            let distanceX = mainCharacter.x - otherPlayer.x
            let distanceY = mainCharacter.y - otherPlayer.y
            let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
    
            if (distance < 250) {
                otherPlayer.element.style.opacity = 1
            } else {
                otherPlayer.element.style.opacity = 0
            }
        }
        this.this.boost = pressedKeys['ShiftLeft'] ? 3 : 0
        await pause(10)
        this.gameLoop()
    }

    init() {
        this.setUpWindowListeners()
        this.setUpSocketListeners()
    }

    async start() {
        this.gameLoop()
        this.adaptDirection()
    }
}

const game = Game.getInstance()
























