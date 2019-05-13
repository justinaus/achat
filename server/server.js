const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const cors = require('cors');
const moment = require('moment-timezone');
const fs = require('fs');
const { make00String, getIsLastDay, parseIpLastX } = require('./utils.js');

// our localhost port
const port = 4001

const app = express()

app.use(cors());

// our server instance
const server = http.createServer(app)

// This creates our socket using the instance of the server
const io = socketIO(server);

connectSocket( io );

function connectSocket( nsp ) {
  nsp.on('connection', socket => {
    let currentRoomId = null;
    let currentUserName = null; // ex) 39.118.152.x

    socket.on('JOIN_ROOM_FROM_CLIENT', ( roomId ) => {
      const rooms = getJsonRooms();

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
        currentUserName = parseIpLastX( clientIp ) + ' (test' + random + ')';

        const connectedCount = io.sockets.adapter.rooms[ currentRoomId ].length;

        // io.to( currentRoomId ).emit('GUEST_CONNECTED', currentUserName);
        socket.emit('CONNECTED_SUCCESS', currentUserName, connectedCount);
        socket.broadcast.to(currentRoomId).emit('GUEST_CONNECTED', currentUserName, connectedCount);
      });
    });

    socket.on( 'disconnect', () => {
      if( !currentRoomId || !currentUserName )  return;

      const currentRoom = io.sockets.adapter.rooms[ currentRoomId ];

      if( !currentRoom )  return;

      const connectedCount = currentRoom.length;
      
      io.to( currentRoomId ).emit('GUEST_DISCONNECTED', currentUserName, connectedCount);
    } );

    socket.on( 'MESSAGE_FROM_CLIENT', ( msg ) => {
      if( !currentRoomId || !currentUserName )  return;
      
      const now = Date.now();

      socket.emit('MY_MESSAGE_FROM_SERVER', currentUserName, msg, now);
      socket.broadcast.to(currentRoomId).emit('OTHERS_MESSAGE_FROM_SERVER', currentUserName, msg, now);
    } );
  })
}

function getJsonRooms() {
  const strNow = moment().tz( 'Asia/Seoul' ).format( 'YYYYMMDDHHmm' );
  
  const arrMonthRoomDataList = getMonthListByNow( strNow );

  const arrRoomList = getListForRoom( strNow, arrMonthRoomDataList );
  
  return arrRoomList;
}

function getListForRoom( strNow, arrItemList ) {
  var arrRet = [];

  var item;
  var startTime;
  var endTime;

  for(var i=0; i<arrItemList.length; ++i) {
    item = arrItemList[ i ];
    startTime = item.start_time;
    endTime = item.end_time;

    if( Number( startTime ) > Number( strNow ) ) {
      continue;
    }
    if( Number( endTime ) < Number( strNow ) ) {
      continue;
    }

    // 룸이 이미 존재 하면 그 숫자, 없으면 널.
    const roomById = io.sockets.adapter.rooms[ item.id ];
    item.connected_count = roomById ? roomById.length : null;

    arrRet.push( item );
  }

  return arrRet;
}

function getMonthListByNow( strNow ) {
  const json = JSON.parse(fs.readFileSync('./room.json', 'utf8'));

  var arrList = json[ strNow.slice( 0,6 ) ];
  
  const strYear = strNow.slice( 0,4 );
  const strMonth = strNow.slice( 4,6 );
  const strDay = strNow.slice( 6,8 );

  if( getIsLastDay( Number( strYear ), Number( strMonth ) - 1, Number( strDay ) ) ) {
    const nNextMonth = Number( strMonth ) + 1;
    const next = json[ strYear + make00String( nNextMonth ) ];
    arrList.push( next );
  } else if( Number( strDay ) === 1 ) {
    const nPrevMonth = Number( strMonth ) - 1;
    const prev = json[ strYear + make00String( nPrevMonth ) ];
    arrList.push( prev );
  }

  return arrList;
}

app.get('/api/rooms', (req, res) => {
  const rooms = getJsonRooms();

  return res.json( rooms );
});

app.get('/api/room/:id', (req, res) => {
  const rooms = getJsonRooms();

  const room = rooms.find( ( item ) => {
    return String( item.id ) === String( req.params.id )
  } );

  return res.json(room);
});

server.listen(port, '0.0.0.0', () => console.log(`Listening on port ${port}`))