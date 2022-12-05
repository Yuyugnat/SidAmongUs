let map = {
    fragments: [],
    buildings: []
}

const socket = new WebSocket('ws://172.16.20.35:8080/ws')

let eventHandler = {}

eventHandler.onMap = gameMap => {
    map = gameMap
    for (mapFragment of map.fragments) {
        const htmlMapFragment = document.createElement('div')
        htmlMapFragment.style.top = mapFragment.y + 'px'
        htmlMapFragment.style.left = mapFragment.x + 'px'
        htmlMapFragment.style.width = mapFragment.width + 'px'
        htmlMapFragment.style.height = mapFragment.height + 'px'
        htmlMapFragment.classList.add('map-fragment')
        htmlMapFragment.id = 'mf-' + mapFragment.id
        document.querySelector('main').appendChild(htmlMapFragment)
    }

    for (building of map.buildings) {
        const htmlBuilding = document.createElement('img')
        htmlBuilding.src = building.link
        htmlBuilding.style.top = building.y + 'px'
        htmlBuilding.style.left = building.x + 'px'
        htmlBuilding.style.width = building.width + 'px'
        htmlBuilding.style.height = building.height + 'px'
        htmlBuilding.classList.add('building')
        htmlBuilding.id = 'b-' + building.id
        document.querySelector('main').appendChild(htmlBuilding)
    }
}

function sendToServer(type, data) {
    socket.send(JSON.stringify({type: type, data: JSON.stringify(data)}))
}

socket.addEventListener('open', function (event) {
    socket.send(JSON.stringify({
        type: 'test',
        data: 'hello world'
    }))
    // socket.dispatchEvent(new CustomEvent('start'))
})

console.log(socket);

let boost = 0

var pressedKeys = {
    'KeyW': false,
    'KeyA': false,
    'KeyS': false,
    'KeyD': false
};

const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let mainCharacter

const mapSize = 500; // en pixel
const gridSize = 5;
const charSize = 50;

let keyDown = false

let directionX = 0
let directionY = 0

let isMoving = false

function checkNextPos(x, y) {
    let goodXY = false
    let goodXsizeYsize = false
    let goodXsizeY = false
    let goodXYsize = false
    // console.log("map is " + map.fragments);
    for(mapFragment of map.fragments) {
        if (x >= mapFragment.x && y >= mapFragment.y && x <= mapFragment.x + mapFragment.width && y <= mapFragment.y + mapFragment.height) {
            goodXY = true
        }
        if (x + charSize <= mapFragment.x + mapFragment.width && y + charSize <= mapFragment.y + mapFragment.height && x + charSize >= mapFragment.x && y + charSize >= mapFragment.y) {
            goodXsizeYsize = true
        }
        if (x + charSize <= mapFragment.x + mapFragment.width && y <= mapFragment.y + mapFragment.height && x + charSize >= mapFragment.x && y >= mapFragment.y) {
            goodXsizeY = true
        }
        if (x <= mapFragment.x + mapFragment.width && y + charSize <= mapFragment.y + mapFragment.height && x >= mapFragment.x && y + charSize >= mapFragment.y) {
            goodXYsize = true
        }
    }
    return goodXY && goodXYsize && goodXsizeY && goodXsizeYsize
}

document.addEventListener('keydown', e => {
    pressedKeys[e.code] = true;
})

document.addEventListener('keyup', e => {
    pressedKeys[e.code] = false
})

async function adaptDirection() {
    let newDirectionX = 0
    let newDirectionY = 0
    if (pressedKeys['KeyW']) {
        newDirectionY = -1
    }
    if (pressedKeys['KeyS']) {
        newDirectionY = 1
    }
    if (pressedKeys['KeyA']) {
        newDirectionX = -1
    }
    if (pressedKeys['KeyD']) {
        newDirectionX = 1
    }
    directionX = newDirectionX
    directionY = newDirectionY
    await pause(50)
    adaptDirection()
}

async function gameLoop() {

    let nextX = mainCharacter.x + directionX * (gridSize + boost)
    let nextY = mainCharacter.y + directionY * (gridSize + boost)

    if (checkNextPos(nextX, nextY)) {
        mainCharacter.update(nextX, nextY, directionX, directionY)
    } else if (checkNextPos(nextX, mainCharacter.y)) {
        mainCharacter.update(nextX, mainCharacter.y, directionX, 0)
    } else if (checkNextPos(mainCharacter.x, nextY)) {
        mainCharacter.update(mainCharacter.x, nextY, 0, directionY)
    }

    if (directionX == -1) {
        mainCharacter.element.querySelector('img').style.transform = 'rotateY(180deg)'
    } else if (directionX == 1) {
        mainCharacter.element.querySelector('img').style.transform = 'rotateY(0deg)'
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

function start() {
    gameLoop()
    adaptDirection()
}

let characterName

document.getElementById('start').addEventListener('click', () => {
    console.log(start);
    sendToServer('ask-for-id', '')
    let value = document.getElementById('landingForm').querySelector('input').value
    characterName = value == "" ? 'no_name' : value
})




eventHandler.onId = id => {
    mainCharacter = new MainCharacter(characterName, id)
    document.getElementById('landingForm').remove()
    document.querySelector('main').style.filter = 'blur(0px)'
    sendToServer('enter-game', {
        id: parseInt(id),
        name: characterName
    })
    start()
}