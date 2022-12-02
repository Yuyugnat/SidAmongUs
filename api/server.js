import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
httpServer.listen(3001)

let nbPlayers = 0
let playersList = []

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on('ask-for-id', () => {
        socket.emit('id', ++nbPlayers)
    })

    socket.on('enter-game', ({name, id}) => {
        socket.broadcast.emit('new-player', {name: name, id: id})
        console.log(name, id);
        io.to(socket.id).emit('players-list', playersList)
        playersList.push({name: name, id: id, sockID: socket.id})
        console.log(socket.id);
        console.log(playersList);
    })

    socket.on('move', ({id, x, y}) => {
        socket.broadcast.emit('move', {id: id, x: x, y: y})
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
        playersList.forEach(player => {
            if (player.sockID == socket.id) {
                socket.broadcast.emit('player-disconnected', {socket: player.id})
            }
        })
        playersList = playersList.filter(player => player.sockID != socket.id)
    })
})

console.log('ok');