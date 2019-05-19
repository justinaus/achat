import express from 'express'
import cors from 'cors'
import http from 'http'
import { JSDOM } from 'jsdom'
import fetch from 'node-fetch'
import moment from 'moment'
import socketIO from 'socket.io'
import DataManager from './DataManager';
import IRoom from './interfaces/IRoom';
import StringUtils from './utils/StringUtils';

const port = 4001

const app = express()
app.use(cors());

const server = http.createServer(app)
const io = socketIO(server);

const dataManager = new DataManager();

connectSocket( io );

function connectSocket( socketServer: socketIO.Server ) {
  socketServer.on('connection', socket => {
    let currentRoomName: string | null = null;
    let currentUserName: string | null = null; // ex) 39.118.152.x

    socket.on('JOIN_ROOM_FROM_CLIENT', ( roomName ) => {
      socket.join( roomName, () => {
        // var socketId = socket.id;
        const clientIp = socket.request.connection.remoteAddress;
        const random = Math.round( Math.random() * 10000 );

        currentRoomName = roomName;
        currentUserName = StringUtils.parseIpLastX( clientIp ) + ' (test' + random + ')';

        const connectedCount = io.sockets.adapter.rooms[ roomName ].length;

        // io.to( currentRoomName ).emit('GUEST_CONNECTED', currentUserName);
        socket.emit('CONNECTED_SUCCESS', currentUserName, connectedCount);
        socket.broadcast.to(roomName).emit('GUEST_CONNECTED', currentUserName, connectedCount);
      });
    });

    socket.on( 'disconnect', () => {
      if( !currentRoomName || !currentUserName )  return;

      if( !getIsValidRoomByRoomName( currentRoomName ) ) {
        closeRoom( currentRoomName );
        return;
      }

      const currentRoom = io.sockets.adapter.rooms[ currentRoomName ];

      if( !currentRoom )  return;

      const connectedCount = currentRoom.length;
      
      io.to( currentRoomName ).emit('GUEST_DISCONNECTED', currentUserName, connectedCount);
    } );

    socket.on( 'MESSAGE_FROM_CLIENT', ( msg ) => {
      if( !currentRoomName || !currentUserName )  return;

      if( !getIsValidRoomByRoomName( currentRoomName ) ) {
        closeRoom( currentRoomName );

        socket.emit('ERROR_FROM_SERVER');
        return;
      }
      
      const now = Date.now();

      socket.emit('MY_MESSAGE_FROM_SERVER', currentUserName, msg, now);
      socket.broadcast.to(currentRoomName).emit('OTHERS_MESSAGE_FROM_SERVER', currentUserName, msg, now);
    } );
  })
}

function getIsValidRoomByRoomName( roomName: String ) {
  const rooms = dataManager.getJsonRoomsNow();

  const roomData = rooms.find( ( item ) => {
    return String( item.id ) === String( roomName );
  } );

  return Boolean( roomData );
}

function closeRoom( roomName: string ) {
  const room = io.of('/').in( roomName );

  if( !room ) {
    return;
  }

  room.clients((error: any, socketIds: Array<any>) => {
    if (error) throw error;

    if( socketIds ) {
      io.to( roomName ).emit('CLOSED_ROOM');
      
      socketIds.forEach(socketId => {
        io.sockets.sockets[socketId].leave( roomName )
      });
    }
  });
}

function addConnectedCountToItem( arrRooms: Array<IRoom> ) {
  const socketRooms = io.sockets.adapter.rooms;

  if( !socketRooms ) {
    return;
  }

  var item: IRoom;

  for(var i=0; i<arrRooms.length; ++i) {
    item = arrRooms[ i ];
    
    // 룸이 이미 존재 하면 그 숫자, 없으면 널.
    const roomById = io.sockets.adapter.rooms[ item.id ];
    item.connected_count = roomById ? roomById.length : null;
  }
}

app.get('/api/rooms', async (req, res) => {
  const params = new URLSearchParams({
    pkid: '66',
    where: 'nexearch',
    key: 'MultiChannelWeekSchedule',
    u1: '999',
    u5: moment().format('YYYYMMDD0hhmm0'),
    u2: '814715|815041|815548|814863|814819|814825|815571|815572|815574|815576|2438226|814595|814592|814588|814582|2876055|814574',
  })
  const response = await fetch(`https://m.search.naver.com/p/csearch/content/nqapirender.nhn?${params}`)
  const data = await response.json()
  const document = new JSDOM(data.dataHtml).window.document
  
  const rooms: any = [...document.querySelectorAll('.ind_program.on')].map((item, index) => {
    const titleEl = <HTMLElement>item.querySelector('.pr_title')
    const href = titleEl.getAttribute('href') || ''
    const id = href.slice(1).split('&').find(q => q.startsWith('os'))
    const timeEl = <HTMLElement>item.querySelector('.time')
    const nextItem = item.nextElementSibling
    const endTimeEl = nextItem ? nextItem.querySelector('.time') : null

    return {
      id: id ? id.replace('os=', '') : index + 1,
      title: titleEl.innerHTML || '',
      start_time: timeEl.innerHTML || '',
      end_time: endTimeEl ? endTimeEl.innerHTML : '--:--'
    }
  })

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

