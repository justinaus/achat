import React, { Component, RefObject } from "react";
import * as io from 'socket.io-client';
import { RouteComponentProps } from "react-router";
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import './Room.css'
import ChatEvent from "../events/ChatEvent";
import { IRoom } from "../interfaces/IRoom";

interface IChatMsg {
  text: string,
  isMyChat: boolean,
  isNotice: boolean
}

interface IState {
  roomData: IRoom,
  chatList: Array<IChatMsg>
}

class Room extends Component<RouteComponentProps, IState> {
  endpoint: string = 'localhost:4001';

  socket: SocketIOClient.Socket;
  refForm: RefObject<any>;

  constructor( props: RouteComponentProps  ) {
    super( props );
    
    this.refForm = React.createRef();

    const locationState: IRoom = this.props.location.state;

    this.state = {
      roomData: locationState,
      chatList: []
    }

    const params: any = this.props.match.params;
    const id: string = params.id;

    this.socket = io.connect( this.endpoint + '/' + id );

    if( !locationState ) {
      this.getData( id );
    }
  }

  getData = ( id: string ) => {
    const TEMP_URL: string = 'http://localhost:4001/room/' + id;

    fetch( TEMP_URL )
    .then( ( response ) => {
      return response.json();
    } ).then( ( data: any ) => {
      this.setState( {
        roomData: data
      } );
    } ).catch( ( error ) => {
      console.log( error );
    } );
  }

  componentDidMount() {
    this.addSocketEvent();
  }

  addSocketEvent = () => {
    this.socket.on( ChatEvent.GUEST_CONNECTED, ( msg: string ) => {
      const chat: IChatMsg = {
        text: msg,
        isMyChat: false,
        isNotice: true
      }

      this.addChat( chat );
    } );

    this.socket.on( ChatEvent.GUEST_DISCONNECTED, ( msg: string ) => {
      const chat: IChatMsg = {
        text: msg,
        isMyChat: false,
        isNotice: true
      }

      this.addChat( chat );
    } );

    this.socket.on( ChatEvent.MY_MESSAGE_FROM_SERVER, ( msg: string ) => {
      const chat: IChatMsg = {
        text: msg,
        isMyChat: true,
        isNotice: false
      }

      this.addChat( chat );
    } );

    this.socket.on( ChatEvent.OTHERS_MESSAGE_FROM_SERVER, ( msg: string ) => {
      const chat: IChatMsg = {
        text: msg,
        isMyChat: false,
        isNotice: false
      }

      this.addChat( chat );
    } );
  }

  addChat = ( chat: IChatMsg ) => {
    const arrOld: Array<IChatMsg> = this.state.chatList;

    this.setState( {
      chatList: arrOld.concat( chat )
    } );
  }

  onClickSend = () => {
    const currentText: string = this.refForm.current.value;

    this.socket.emit( ChatEvent.MESSAGE_FROM_CLIENT, currentText );

    this.refForm.current.value = '';
  }

  renderChatItem = ( chatMsg: IChatMsg, index: number ) => {
    var clsName: string;

    if( chatMsg.isNotice ) {
      clsName = 'liConnected';
    } else {
      clsName = chatMsg.isMyChat ? 'liMe' : 'liOthers';
    }

    return (
      <li key={ index } className={ clsName }>
        { chatMsg.text }
      </li>
    );
  }

  render() {
    const { chatList, roomData } = this.state;

    const title: string = roomData ? roomData.title : '';

    return (
      <div>
        <h3>{ title }</h3>
        <InputGroup className="mb-3" id='igChat'>
          <FormControl
            placeholder="Chat" ref={ this.refForm }
          />
          <InputGroup.Append>
            <Button variant="outline-secondary" onClick={ this.onClickSend }>Send</Button>
          </InputGroup.Append>
        </InputGroup>
        <ul>
          { chatList.map( this.renderChatItem ) }
        </ul>
      </div>
    );
  }
}

export default Room