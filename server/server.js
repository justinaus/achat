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
    let currentRoomId = null;
    let currentUserName = null; // ex) 39.118.152.x

    socket.on('JOIN_ROOM_FROM_CLIENT', ( roomId ) => {
      const roomData = rooms.find( ( item ) => {
        return String( item.id ) === String( roomId );
      } );

      if( !roomData ) {
        socket.emit('ERROR_FROM_SERVER', 'wrong room');
        return;
      }

      socket.join( roomId, () => {
        // var socketId = socket.id;
        const clientIp = socket.request.connection.remoteAddress;
        const random = Math.round( Math.random() * 10000 );

        currentRoomId = roomId;
        currentUserName = parseIpWithX( clientIp ) + ' (test' + random + ')';

        // io.to( currentRoomId ).emit('GUEST_CONNECTED', currentUserName);
        socket.emit('CONNECTED_SUCCESS', currentUserName);
        socket.broadcast.to(currentRoomId).emit('GUEST_CONNECTED', currentUserName);
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

function parseIpWithX( strOrigin ) {
  var arrSplit = strOrigin.split( '.' );

  if( arrSplit.length < 1 ) {
    return 'invalid ip'
  }

  arrSplit[ arrSplit.length - 1 ] = 'x';

  const result = arrSplit.join( '.' );

  return result;
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

server.listen(port, '0.0.0.0', () => console.log(`Listening on port ${port}`))