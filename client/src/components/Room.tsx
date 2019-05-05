import React, { Component, RefObject } from "react";
import * as io from 'socket.io-client';
import { RouteComponentProps } from "react-router";
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import './Room.css'
import ChatEvent from "../events/ChatEvent";
import { IRoom } from "../interfaces/IRoom";
import ChatEnum from "../enums/ChatEnum";

interface IChatMsg {
  text: string,
  kind: ChatEnum
}

interface IState {
  roomData: IRoom,
  chatList: Array<IChatMsg>,
  myName: string | null,
  connectedCount: number
}

class Room extends Component<RouteComponentProps, IState> {
  socket: SocketIOClient.Socket;
  refForm: RefObject<any>;
  roomId: string;
  
  constructor( props: RouteComponentProps ) {
    super( props );
    
    this.refForm = React.createRef();

    const locationState: IRoom = this.props.location.state;

    this.state = {
      roomData: locationState,
      chatList: [],
      myName: null,
      connectedCount: 0
    }

    const params: any = this.props.match.params;
    this.roomId = params.id;
    
    const ENV_HOST: string | undefined = process.env.REACT_APP_TEMP_HOST;
    const HOST: string = ENV_HOST ? ENV_HOST : 'localhost:4001';
    
    this.socket = io.connect( HOST );

    this.socket.emit( ChatEvent.JOIN_ROOM_FROM_CLIENT, this.roomId);

    if( !locationState ) {
      this.getData( this.roomId );
    }
  }

  getData = ( roomId: string ) => {
    const TEMP_URL: string = 'http://localhost:4001/api/room/' + roomId;

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
    this.socket.on( ChatEvent.CONNECTED_SUCCESS, ( userName: string, connectedCount: number ) => {
      this.setState( {
        myName: userName,
        connectedCount: connectedCount
      } );

      const chat: IChatMsg = {
        text: userName + ' connected',
        kind: ChatEnum.Notice
      }

      this.addChat( chat );
    } );

    this.socket.on( ChatEvent.GUEST_CONNECTED, ( userName: string, connectedCount: number ) => {
      this.setState( {
        connectedCount: connectedCount
      } );

      const chat: IChatMsg = {
        text: userName + ' connected',
        kind: ChatEnum.Notice
      }

      this.addChat( chat );
    } );

    this.socket.on( ChatEvent.GUEST_DISCONNECTED, ( userName: string, connectedCount: number ) => {
      this.setState( {
        connectedCount: connectedCount
      } );

      const chat: IChatMsg = {
        text: userName + ' disconnected',
        kind: ChatEnum.Notice
      }

      this.addChat( chat );
    } );

    this.socket.on( ChatEvent.MY_MESSAGE_FROM_SERVER, ( userName:string, msg: string, nowUtc: number ) => {
      const chat: IChatMsg = {
        text: userName + ': ' + msg,
        kind: ChatEnum.MyChat
      }

      this.addChat( chat );
    } );

    this.socket.on( ChatEvent.OTHERS_MESSAGE_FROM_SERVER, ( userName:string, msg: string, nowUtc: number ) => {
      const chat: IChatMsg = {
        text: userName + ': ' + msg,
        kind: ChatEnum.OthersChat
      }

      this.addChat( chat );
    } );

    this.socket.on( ChatEvent.ERROR_FROM_SERVER, ( msg: string ) => {
      alert( msg );
    } );
  }

  addChat = ( chat: IChatMsg ) => {
    const arrOld: Array<IChatMsg> = this.state.chatList;

    this.setState( {
      chatList: arrOld.concat( chat )
    } );
  }

  renderChatItem = ( chatMsg: IChatMsg, index: number ) => {
    var clsName: string;

    switch( chatMsg.kind ) {
      case ChatEnum.Notice :
        clsName = 'liConnected';
        break;
      case ChatEnum.MyChat :
        clsName = 'liMe';
        break;
      case ChatEnum.OthersChat :
        clsName = 'liOthers';
        break;
      default :
        clsName = '';
    }

    return (
      <li key={ index } className={ clsName }>
        { chatMsg.text }
      </li>
    );
  }

  onClickSend = () => {
    this.sendMsg();
  }

  onKeyUp = ( e: React.KeyboardEvent ) => {
    const ENTER_KEY_CODE: number = 13;

    if( e.keyCode !== ENTER_KEY_CODE )  return;

    this.sendMsg();
  }

  sendMsg = () => {
    const currentText: string = this.refForm.current.value;
    const currentTextTrim: string = currentText.trim();

    if( currentTextTrim === '' ) return;

    this.socket.emit( ChatEvent.MESSAGE_FROM_CLIENT, currentTextTrim );

    this.refForm.current.value = '';
  }

  render() {
    const { chatList, roomData, myName, connectedCount } = this.state;
    
    const title: string = roomData ? roomData.title : '';

    return (
      <div>
        <h3>{ title }</h3>
        <h5>my name: { myName || '' }</h5>
        <h5>users: { connectedCount }</h5>
        <InputGroup className="mb-3" id='igChat'>
          <FormControl
            placeholder="Chat" ref={ this.refForm } onKeyUp={ this.onKeyUp }
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