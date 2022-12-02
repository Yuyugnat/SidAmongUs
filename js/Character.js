class Character {
    constructor(name, id) {
        this.name = name
        this.id = id
        this.x = 200
        this.y = 1000
        this.width = 50
        this.height = 50
        this.imgLink = `img/sidamongus-${this.id % 5}.png`
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
        this.x = x
        this.y = y
    }

}

class MainCharacter extends Character {
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
        this.render()
    }

    render() {
        super.render()
        document.body.appendChild(this.element)
    }

    update(x, y) {
        super.update(x, y)
        document.querySelector('main').style.transform = `translate(${-x}px, ${-y}px)`
        socket.emit('move', {id: this.id, x: this.x, y: this.y})
    }
}

class OtherCharacter extends Character {
    constructor(name, id) {
        super(name, id)
        this.create()
    }

    create() {
        super.create()
        this.element.classList.add('other-character')
        this.render()
    }

    render() {
        super.render()
        document.querySelector('main').appendChild(this.element)
    }

    update(x, y) {
        console.log(x, y);
        super.update(x, y)
        this.element.style.transform = `translate(${x}px, ${y}px)`
    }
}