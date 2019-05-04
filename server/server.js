const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const cors = require('cors');

// our localhost port
const port = 4001

const app = express()

app.use(cors());

// our server instance
const server = http.createServer(app)

const rooms = [
  {
    "id": 1,
    "title": "Anim occaecat"
  },
  {
    "id": 2,
    "title": "Bulla et est sint"
  },
  {
    "id": 3,
    "title": "Colore"
  },
  {
    "id": 4,
    "title": "Exercitation ea"
  }
];

// This creates our socket using the instance of the server
const io = socketIO(server);

connectSocket( io );

function connectSocket( nsp ) {
  nsp.on('connection', socket => {
    // socket.broadcast.emit( 'GUEST_CONNECTED', 'a guest connected' );

    let currentRoomId = null;
    let currentUserName = null;

    socket.on('JOIN_ROOM', ( roomId, userName) => {
      const roomData = rooms.find( ( item ) => {
        return String( item.id ) === String( roomId );
      } );

      if( !roomData ) {
        socket.emit('ERROR', 'wrong room');
        return;
      }

      socket.join( roomId, () => {
        currentRoomId = roomId;
        currentUserName = userName;

        io.to( currentRoomId ).emit('GUEST_CONNECTED', currentUserName);
      });
    });

    socket.on( 'disconnect', () => {
      if( !currentRoomId || !currentUserName )  return;
      
      io.to( currentRoomId ).emit('GUEST_DISCONNECTED', currentUserName);
    } );

    socket.on( 'MESSAGE_FROM_CLIENT', ( msg ) => {
      if( !currentRoomId || !currentUserName )  return;

      socket.emit('MY_MESSAGE_FROM_SERVER', currentUserName, msg);
      socket.broadcast.to(currentRoomId).emit('OTHERS_MESSAGE_FROM_SERVER', currentUserName, msg);
    } );
  })
}

app.get('/api/rooms', (req, res) => {
  return res.json(rooms);
});

app.get('/api/room/:id', (req, res) => {
  const room = rooms.find( ( item ) => {
    return String( item.id ) === String( req.params.id )
  } );

  return res.json(room);
});

server.listen(port, () => console.log(`Listening on port ${port}`))