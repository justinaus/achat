const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const cors = require('cors');
const { parseIpLastX } = require('./utils.js');
const dataManager = require('./dataManager.js');

const port = 4001

const app = express()
app.use(cors());

const server = http.createServer(app)

const io = socketIO(server);

connectSocket( io );

function connectSocket( nsp ) {
  nsp.on('connection', socket => {
    let currentRoomId = null;
    let currentUserName = null; // ex) 39.118.152.x

    socket.on('JOIN_ROOM_FROM_CLIENT', ( roomId ) => {
      if( !getIsValidRoomByRoomId( roomId ) ) {
        closeRoom( roomId );
        socket.emit('ERROR_FROM_SERVER');
        return;
      }

      socket.join( roomId, () => {
        // var socketId = socket.id;
        const clientIp = socket.request.connection.remoteAddress;
        const random = Math.round( Math.random() * 10000 );

        currentRoomId = roomId;
        currentUserName = parseIpLastX( clientIp ) + ' (test' + random + ')';

        const connectedCount = io.sockets.adapter.rooms[ currentRoomId ].length;

        // io.to( currentRoomId ).emit('GUEST_CONNECTED', currentUserName);
        socket.emit('CONNECTED_SUCCESS', currentUserName, connectedCount);
        socket.broadcast.to(currentRoomId).emit('GUEST_CONNECTED', currentUserName, connectedCount);
      });
    });

    socket.on( 'disconnect', () => {
      if( !currentRoomId || !currentUserName )  return;

      if( !getIsValidRoomByRoomId( currentRoomId ) ) {
        closeRoom( currentRoomId );
        return;
      }

      const currentRoom = io.sockets.adapter.rooms[ currentRoomId ];

      if( !currentRoom )  return;

      const connectedCount = currentRoom.length;
      
      io.to( currentRoomId ).emit('GUEST_DISCONNECTED', currentUserName, connectedCount);
    } );

    socket.on( 'MESSAGE_FROM_CLIENT', ( msg ) => {
      if( !currentRoomId || !currentUserName )  return;

      if( !getIsValidRoomByRoomId( currentRoomId ) ) {
        closeRoom( currentRoomId );
        socket.emit('ERROR_FROM_SERVER');
        return;
      }
      
      const now = Date.now();

      socket.emit('MY_MESSAGE_FROM_SERVER', currentUserName, msg, now);
      socket.broadcast.to(currentRoomId).emit('OTHERS_MESSAGE_FROM_SERVER', currentUserName, msg, now);
    } );
  })
}

function getIsValidRoomByRoomId( roomId ) {
  const rooms = dataManager.getJsonRoomsNow();

  const roomData = rooms.find( ( item ) => {
    return String( item.id ) === String( roomId );
  } );

  return Boolean( roomData );
}

function closeRoom( roomId ) {
  const room = io.of('/').in( roomId );

  if( !room ) {
    return;
  }

  room.clients((error, socketIds) => {
    if (error) throw error;

    if( socketIds ) {
      io.to( roomId ).emit('CLOSED_ROOM');
      
      socketIds.forEach(socketId => {
        io.sockets.sockets[socketId].leave( roomId )
      });
    }
  });
}

function addConnectedCountToItem( arrRooms ) {
  const socketRooms = io.sockets.adapter.rooms;

  if( !socketRooms ) {
    return;
  }

  for(var i=0; i<arrRooms.length; ++i) {
    item = arrRooms[ i ];
    
    // 룸이 이미 존재 하면 그 숫자, 없으면 널.
    const roomById = io.sockets.adapter.rooms[ item.id ];
    item.connected_count = roomById ? roomById.length : null;
  }
}

app.get('/api/rooms', (req, res) => {
  const rooms = dataManager.getJsonRoomsNow();

  addConnectedCountToItem( rooms );

  return res.json( rooms );
});

app.get('/api/room/:id', (req, res) => {
  const rooms = dataManager.getJsonRoomsNow();

  const room = rooms.find( ( item ) => {
    return String( item.id ) === String( req.params.id )
  } );

  if( room ) {
    addConnectedCountToItem( [ room ] );
  }

  return res.json(room);
});

server.listen(port, '0.0.0.0', () => console.log(`Listening on port ${port}`))