export class Character {

    constructor(name, id) {
        this.name = name
        this.id = id
        this.x = 2100
        this.y = 1500
        this.width = 50
        this.directionX = 0
        this.directionY = 0
        this.height = 50
        this.imgLink = `img/sidamongus-${this.id % 8}.png`
    }

    create() {
        this.element = document.createElement('div')
        this.element.id = `character-${this.id}`
        this.element.classList.add('character')
        let img = document.createElement('img')
        img.src = this.imgLink
        this.element.appendChild(img)
        let name = document.createElement('div')
        name.classList.add('name')
        name.innerText = this.name
        this.element.appendChild(name)
    }

    render() {
        this.update(this.x, this.y)
    }

    update(x, y) {
        console.log("updating character", this.id);
        this.x = x
        this.y = y
    }

}

export class MainCharacter extends Character {
    constructor(name, id) {
        super(name, id)
        this.create()
    }

    create() {
        super.create()
        this.element.classList.add('main-character')
        let shadow = document.createElement('div')
        shadow.classList.add('shadow')
        this.element.appendChild(shadow)
        let name = document.createElement('div')
        name.classList.add('name')
        name.innerText = this.name
        this.element.appendChild(name)
        this.render()
    }

    render() {
        super.render()
        document.body.appendChild(this.element)
    }

    update(x, y, directionX, directionY) {
        super.update(x, y)
        this.directionX = directionX
        this.directionY = directionY
        let xTranslation = x
        let yTranslation = y
        let ownXTranslation = 0
        let ownYTranslation = 0
        if (this.x < window.innerWidth / 2) {
            xTranslation = window.innerWidth / 2
            ownXTranslation = this.x - window.innerWidth / 2
        } else if (this.x + Game.charSize > Game.mapWidth - window.innerWidth / 2) {
            xTranslation = Game.mapWidth - window.innerWidth / 2 - Game.charSize
            ownXTranslation = this.x - (Game.mapWidth - window.innerWidth / 2) + Game.charSize
        }
       
        if (this.y < window.innerHeight / 2) {
            yTranslation = window.innerHeight / 2
            ownYTranslation = this.y - window.innerHeight / 2
        } else if (this.y + Game.charSize > Game.mapHeight - window.innerHeight / 2) {
            yTranslation = Game.mapHeight - window.innerHeight / 2 - Game.charSize
            ownYTranslation = this.y - (Game.mapHeight - window.innerHeight / 2) + Game.charSize
        }

        this.element.style.transform = `translate(${ownXTranslation}px, ${ownYTranslation}px)`

        document.querySelector('main').style.transform = `translate(${-xTranslation}px, ${-yTranslation}px)`
        if (this.directionX !== 0 || this.directionY !== 0)
            Game.getInstance()?.socket.send('move', {
                id: this.id,
                x: this.x,
                y: this.y,
            })
    }
}

export class OtherCharacter extends Character {
    constructor(name, id) {
        super(name, id)
        this.create()
        this.close = false
    }

    create() {
        super.create()
        this.element.classList.add('other-character')
        this.render()
    }

    render() {
        super.render()
        document.querySelector('main').appendChild(this.element)
        this.element.addEventListener('click', () => {
            console.log('click');
        })
        this.element.addEventListener('mouseover', () => {
            console.log('over');
            if (this.close) {
                this.element.classList.add('clickable')
            }
        })
    }

    update(x, y) {
        super.update(x, y)
        this.element.style.transform = `translate(${x}px, ${y}px)`
    }
}