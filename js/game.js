const map = [
    {
        id: 1,
        x: 200,
        y: 1000,
        width: 200,
        height: 900
    },
    {
        id: 2,
        x: 400,
        y: 1600,
        width: 2500,
        height: 300
    },
    {
        id: 3,
        x: 800,
        y: 900,
        width: 400,
        height: 700
    },
    {
        id: 4,
        x: 800,
        y: 200,
        width: 200,
        height: 700
    },
    {
        id: 5,
        x: 1000,
        y: 200,
        width: 3000,
        height: 200
    },
    {
        id: 6,
        x: 1000,
        y: 800,
        width: 100,
        height: 100
    },
    {
        id: 7,
        x: 3800,
        y: 400,
        width: 200,
        height: 1900
    },
    {
        id: 8,
        x: 2000,
        y: 400,
        width: 100,
        height: 200
    },
    {
        id: 9,
        x: 2100,
        y: 500,
        width: 900,
        height: 100
    },
    {
        id: 10,
        x: 2900,
        y: 600,
        width: 100,
        height: 300
    },
    {
        id: 11,
        x: 1200,
        y: 900,
        width: 1700,
        height: 200
    },
    {
        id: 12,
        x: 2900,
        y: 900,
        width: 600,
        height: 300
    },
    {
        id: 13,
        x: 3200,
        y: 800,
        width: 300,
        height: 100
    },
    {
        id: 14,
        x: 2900,
        y: 1200,
        width: 300,
        height: 1000
    },
    {
        id: 15,
        x: 3200,
        y: 1500,
        width: 300,
        height: 200
    },
    {
        id: 16,
        x: 2700,
        y: 1400,
        width: 200,
        height: 200
    },
    {
        id: 17,
        x: 2700,
        y: 1300,
        width: 100,
        height: 100
    },
    {
        id: 18,
        x: 3200,
        y: 2100,
        width: 300,
        height: 100
    },
    {
        id: 19,
        x: 2200,
        y: 2300,
        width: 1800,
        height: 200
    },
    {
        id: 20,
        x: 2200,
        y: 1900,
        width: 300,
        height: 300
    },
    {
        id: 21,
        x: 1500,
        y: 1900,
        width: 300,
        height: 500
    },
    {
        id: 22,
        x: 800,
        y: 2200,
        width: 700,
        height: 200
    },
    {
        id: 23,
        x: 800,
        y: 1900,
        width: 300,
        height: 300
    },
    {
        id: 24,
        x: 1400,
        y: 1500,
        width: 100,
        height: 100
    },
    {
        id: 25,
        x: 2100,
        y: 1400,
        width: 100,
        height: 200
    }
]

for (mapFragment of map) {
    const htmlMapFragment = document.createElement('div')
    htmlMapFragment.style.top = mapFragment.y + 'px'
    htmlMapFragment.style.left = mapFragment.x + 'px'
    htmlMapFragment.style.width = mapFragment.width + 'px'
    htmlMapFragment.style.height = mapFragment.height + 'px'
    htmlMapFragment.classList.add('map-fragment')
    htmlMapFragment.id = 'mf-' + mapFragment.id
    document.querySelector('main').appendChild(htmlMapFragment)
}

const socket = io('ws://localhost:3001')

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
    for(mapFragment of map) {
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
    console.log(e.code);
    pressedKeys[e.code] = true;

        switch (e.code) {
            case 'KeyW':
                directionY = -1
                break;
            case 'KeyA':
                directionX = -1
                break;
            case 'KeyS':
                directionY = 1
                break;
            case 'KeyD':
                directionX = 1
                break;
        }
    
})

async function nullifyDirection() {
    if (pressedKeys['KeyA'] == false &&  pressedKeys['KeyD'] == false) {
        directionX = 0
    }
    if (pressedKeys['KeyS'] == false && pressedKeys['KeyW'] == false) {
        directionY = 0
    }
    await pause(50)
    nullifyDirection()
}

document.addEventListener('keyup', e => {
    pressedKeys[e.code] = false
})

async function gameLoop() {

    let nextX = mainCharacter.x + directionX * gridSize
    let nextY = mainCharacter.y + directionY * gridSize

    if (checkNextPos(nextX, nextY)) {
        mainCharacter.update(nextX, nextY)
    }

    if (directionX == -1) {
        mainCharacter.element.style.transform = 'rotateY(180deg)'
    } else if (directionX == 1) {
        mainCharacter.element.style.transform = 'rotateY(0deg)'
    }

    let timePause = pressedKeys['ShiftLeft'] ? 8 : 15
    document.querySelector('main').style.transition = `transform ${timePause}ms linear`
    await pause(timePause)
    gameLoop()
}

function start() {
    gameLoop()
    nullifyDirection()
}

let characterName

document.getElementById('start').addEventListener('click', () => {
    console.log(start);
    socket.emit('ask-for-id')
    characterName = document.getElementById('landingForm').querySelector('input').value ?? 'no_name'
})

socket.on('id', id => {
    mainCharacter = new MainCharacter(characterName, id)
    document.getElementById('landingForm').remove()
    document.querySelector('main').style.filter = 'blur(0px)'
    socket.emit('enter-game', {id: id, name: characterName})
    start()
})