class GameMap {
    // singleton

    static instance = null
    /**
     * 
     * @param {Object[]} fragments 
     * @param {Object[]} buildings 
     */
    constructor(fragments, buildings) {
        this.fragments = fragments
        this.buildings = buildings

        for (const mapFragment of this.fragments) {
            const htmlMapFragment = document.createElement('div')
            htmlMapFragment.style.top = mapFragment.y + 'px'
            htmlMapFragment.style.left = mapFragment.x + 'px'
            htmlMapFragment.style.width = mapFragment.width + 'px'
            htmlMapFragment.style.height = mapFragment.height + 'px'
            htmlMapFragment.classList.add('map-fragment')
            htmlMapFragment.id = 'mf-' + mapFragment.id
            document.querySelector('main').appendChild(htmlMapFragment)
        }

        for (const building of this.buildings) {
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

    static getInstance(fragments = [], buildings = []) {
        if (GameMap.instance == null) GameMap.instance = new GameMap(fragments, buildings)
        return GameMap.instance
    }

    getFragments() {
        return this.fragments
    }

    getBuildings() {
        return this.buildings
    }


    checkNextPos(x, y) {
        let goodXY = false
        let goodXsizeYsize = false
        let goodXsizeY = false
        let goodXYsize = false
        for(const mapFragment of this.fragments) {
            if (x >= mapFragment.x && y >= mapFragment.y && x <= mapFragment.x + mapFragment.width && y <= mapFragment.y + mapFragment.height) {
                goodXY = true
            }
            if (x + Game.charSize <= mapFragment.x + mapFragment.width && y + Game.charSize <= mapFragment.y + mapFragment.height && x + Game.charSize >= mapFragment.x && y + Game.charSize >= mapFragment.y) {
                goodXsizeYsize = true
            }
            if (x + Game.charSize <= mapFragment.x + mapFragment.width && y <= mapFragment.y + mapFragment.height && x + Game.charSize >= mapFragment.x && y >= mapFragment.y) {
                goodXsizeY = true
            }
            if (x <= mapFragment.x + mapFragment.width && y + Game.charSize <= mapFragment.y + mapFragment.height && x >= mapFragment.x && y + Game.charSize >= mapFragment.y) {
                goodXYsize = true
            }
        }

        return goodXY && goodXYsize && goodXsizeY && goodXsizeYsize
    }
}