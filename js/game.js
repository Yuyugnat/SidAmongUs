const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class Game {

    // singleton
    static instance =  null

    static mapWidth = 4300
    static mapHeight = 2900
    static gridSize = 20;
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
        this.newDirectionX = 0
        this.newDirectionY = 0
        this.characterName = ""
        this.listOtherPlayers = []
    }
    
    
    static getInstance() {
        if (Game.instance == null) Game.instance = new Game()
        return Game.instance
    }

    setUpSocketListeners() {
        this.socket.on("player-info", function (playerInfo) {
            const {id} = playerInfo
            const map = JSON.parse(playerInfo.map)
            console.log("player info received", playerInfo);
            
            this.map =  GameMap.getInstance(map.fragments,map.buildings)
            this.mainCharacter = new MainCharacter(this.characterName, parseInt(id))
            const form = document.getElementById('landingForm')
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
        window.addEventListener('keydown', e => {
            this.pressedKeys[e.code] = true;
        })
        
        window.addEventListener('keyup', e => {
            this.pressedKeys[e.code] = false

            if (e.code == 'Enter') {
                Chat.handlePressEnter()
            }
        })

        document.getElementById('start').addEventListener('click', () => {
            console.log("starting game")
            this.socket.send('ask-for-id', '')
            const value = document.getElementById('landingForm').querySelector('input').value
            this.characterName = value == "" ? 'no_name' : value
        })
    }

    
    
    async adaptDirection() {
        let newDirectionX = 0
        let newDirectionY = 0
        if (this.pressedKeys['KeyW']) {
            newDirectionY -= 1
        }
        if (this.pressedKeys['KeyS']) {
            newDirectionY += 1
        }
        if (this.pressedKeys['KeyA']) {
            newDirectionX -= 1
        }
        if (this.pressedKeys['KeyD']) {
            newDirectionX += 1
        }
        this.directionX = newDirectionX
        this.directionY = newDirectionY
        await pause(50)
        this.adaptDirection()
    }

    async gameLoop() {
        const mainCharacter = this.mainCharacter

        let nextX = mainCharacter.x + this.directionX * (Game.gridSize + this.boost)
        let nextY = mainCharacter.y + this.directionY * (Game.gridSize + this.boost)
    
        if (this.map.checkNextPos(nextX, nextY)) {
            mainCharacter.update(nextX, nextY, this.directionX, this.directionY)
        } else if (this.map.checkNextPos(nextX, mainCharacter.y)) {
            mainCharacter.update(nextX, mainCharacter.y, this.directionX, this.directionY)
        } else if (this.map.checkNextPos(mainCharacter.x, nextY)) {
            mainCharacter.update(mainCharacter.x, nextY, this.directionX, this.directionY)
        }
    
        if (this.directionX == -1) {
            // mainCharacter.element.style.transition = 'transform 50ms linear'
            mainCharacter.element.querySelector('img').style.transform = 'scaleX(-1)'
            // transform 50ms linear
        } else if (this.directionX == 1) {
            mainCharacter.element.querySelector('img').style.transform = 'scaleX(1)'
            // mainCharacter.element.style.transition = 'transform 50ms linear'
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
    
            if (distance < 50) {
                otherPlayer.close = true
            } else {
                otherPlayer.close = false
            }
        }
        this.boost = this.pressedKeys['ShiftLeft'] ? 5 : 0
        await pause(50)
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




















