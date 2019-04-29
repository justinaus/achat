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

// This creates our socket using the instance of the server
const io = socketIO(server);

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

for(var i=0; i<rooms.length; ++i) {
  const nsp = io.of( '/' + rooms[ i ].id );
  connectByNamespace( nsp );
}

function connectByNamespace( nsp ) {
  // This is what the socket.io syntax is like, we will work this later
  nsp.on('connection', socket => {
    socket.broadcast.emit( 'GUEST_CONNECTED', 'a guest connected' );

    socket.on( 'MESSAGE_FROM_CLIENT', ( msg ) => {
      socket.emit('MY_MESSAGE_FROM_SERVER', msg);
      socket.broadcast.emit( 'OTHERS_MESSAGE_FROM_SERVER', msg );
    } );

    socket.on( 'disconnect', () => {
      socket.broadcast.emit( 'GUEST_DISCONNECTED', 'a guest disconnected' );
    } );
  })
}

app.get('/rooms', (req, res) => {
  return res.json(rooms);
});

app.get('/room/:id', (req, res) => {
  const room = rooms.find( ( item ) => {
    return String( item.id ) === String( req.params.id )
  } );

  return res.json(room);
});

server.listen(port, () => console.log(`Listening on port ${port}`))