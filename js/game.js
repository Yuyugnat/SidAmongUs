const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class Game {

    // singleton
    static instance =  null

    static mapSize = 500; // en pixel
    static gridSize = 5;
    static charSize = 50;

    constructor() {
        this.socket = new Socket(new WebSocket('ws://localhost:8080/ws'))
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
    }
    
    
    static getInstance() {
        if (Game.instance == null) Game.instance = new Game()
        return Game.instance
    }
    

    setUpSocketListeners() {
        this.socket.on("map", function (gameMap) {
            console.log("map is " + this.map.fragments);
            this.map = new Map(gameMap)
        })
        this.socket.on('open', function (event) {
            socket.send(JSON.stringify({
                type: 'test',
                data: 'hello world'
            }))
        })

        this.socket.on("id", id => {
            this.mainCharacter = new MainCharacter(this.characterName, id)
            document.getElementById('landingForm').remove()
            document.querySelector('main').style.filter = 'blur(0px)'
            socket.send('enter-game', {
                id: parseInt(id),
                name: characterName
            })
            this.start()
        })
    }
    

    setUpWindowListeners() {
        document.addEventListener('keydown', e => {
            this.pressedKeys[e.code] = true;
        })
        
        document.addEventListener('keyup', e => {
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
        await pause(50)
        adaptDirection()
    }

    async gameLoop() {

        let nextX = this.mainCharacter.x + directionX * (gridSize + boost)
        let nextY = this.mainCharacter.y + directionY * (gridSize + boost)
    
        if (checkNextPos(nextX, nextY)) {
           this.mainCharacter.update(nextX, nextY, directionX, directionY)
        } else if (checkNextPos(nextX, mainCharacter.y)) {
            this.mainCharacter.update(nextX, mainCharacter.y, directionX, 0)
        } else if (checkNextPos(mainCharacter.x, nextY)) {
            this.mainCharacter.update(mainCharacter.x, nextY, 0, directionY)
        }
    
        if (directionX == -1) {
            this.mainCharacter.element.querySelector('img').style.transform = 'rotateY(180deg)'
        } else if (directionX == 1) {
            this.mainCharacter.element.querySelector('img').style.transform = 'rotateY(0deg)'
        }
    
        for (otherPlayer of listOtherPlayers) {
            let distanceX = mainCharacter.x - otherPlayer.x
            let distanceY = mainCharacter.y - otherPlayer.y
            let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
    
            if (distance < 250) {
                otherPlayer.element.style.opacity = 1
            } else {
                otherPlayer.element.style.opacity = 0
            }
        }
    
        boost = pressedKeys['ShiftLeft'] ? 3 : 0
        await pause(10)
        gameLoop()
    }

    async start() {
        gameLoop()
        adaptDirection()
    }
}

const game = Game.getInstance()
























