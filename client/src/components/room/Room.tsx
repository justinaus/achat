import React, { Component, ReactElement } from "react";
import * as io from 'socket.io-client';
import { RouteComponentProps } from "react-router";
import styles from './Room.module.css'
import ChatEvent from "../../events/ChatEvent";
import { IRoom } from "../../interfaces/IRoom";
import ChatEnum from "../../enums/ChatEnum";
import ChatNotice from "./chat/ChatNotice";
import ChatMessage from "./chat/ChatMessage";
import ChatInput from "./ChatInput";
import RoomHeader from './RoomHeader'

interface IChatBase {
  kind: ChatEnum
}
interface IChatNotice extends IChatBase {
  noticeMsg: string
}
interface IChatMsg extends IChatBase {
  userName: string,
  msg: string,
  strTime: string,
  isMyChat: boolean
}

interface IState {
  roomData: IRoom,
  chatList: Array<IChatBase>,
  myName: string | null,
  connectedCount: number
}

class Room extends Component<RouteComponentProps, IState> {
  socket: SocketIOClient.Socket;
  
  constructor( props: RouteComponentProps ) {
    super( props );
    
    const locationState: IRoom = this.props.location.state;

    this.state = {
      roomData: locationState,
      chatList: [],
      myName: null,
      connectedCount: 0
    }

    const ENV_HOST: string | undefined = process.env.REACT_APP_TEMP_HOST;
    const HOST: string = ENV_HOST ? ENV_HOST : 'localhost:4001';
    
    this.socket = io.connect( HOST );

    const params: any = this.props.match.params;
    const roomId: string = params.id;
        
    this.socket.emit( ChatEvent.JOIN_ROOM_FROM_CLIENT, roomId);

    if( !locationState ) {
      this.getData( roomId );
    }
  }

  getData = ( roomId: string ) => {
    const ENV_HOST: string | undefined = process.env.REACT_APP_TEMP_HOST;
    const HOST: string = ENV_HOST ? ENV_HOST : 'localhost:4001';
    const URL: string = `http://${HOST}/api/room/${roomId}`;

    fetch( URL )
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

      const chat: IChatNotice = {
        noticeMsg: userName + ' connected',
        kind: ChatEnum.Notice
      }

      this.addChat( chat );
    } );

    this.socket.on( ChatEvent.GUEST_CONNECTED, ( userName: string, connectedCount: number ) => {
      this.setState( {
        connectedCount: connectedCount
      } );

      const chat: IChatNotice = {
        noticeMsg: userName + ' connected',
        kind: ChatEnum.Notice
      }

      this.addChat( chat );
    } );

    this.socket.on( ChatEvent.GUEST_DISCONNECTED, ( userName: string, connectedCount: number ) => {
      this.setState( {
        connectedCount: connectedCount
      } );

      const chat: IChatNotice = {
        noticeMsg: userName + ' disconnected',
        kind: ChatEnum.Notice
      }

      this.addChat( chat );
    } );

    this.socket.on( ChatEvent.MY_MESSAGE_FROM_SERVER, ( userName:string, msg: string, nowUtc: number ) => {
      const chat: IChatMsg = {
        userName: userName,
        msg: msg,
        strTime: this.makeTimeStringByUtc( nowUtc ),
        isMyChat: true,
        kind: ChatEnum.MyChat
      }

      this.addChat( chat );
    } );

    this.socket.on( ChatEvent.OTHERS_MESSAGE_FROM_SERVER, ( userName:string, msg: string, nowUtc: number ) => {
      const chat: IChatMsg = {
        userName: userName,
        msg: msg,
        strTime: this.makeTimeStringByUtc( nowUtc ),
        isMyChat: false,
        kind: ChatEnum.OthersChat
      }

      this.addChat( chat );
    } );

    this.socket.on( ChatEvent.ERROR_FROM_SERVER, () => {
      alert( '현재 존재하지 않는 방입니다.' );
    } );

    this.socket.on( ChatEvent.CLOSED_ROOM, () => {
      alert( '현재 존재하지 않는 방입니다.' );
    } );
  }

  addChat = ( chat: IChatBase ) => {
    const arrOld: Array<IChatBase> = this.state.chatList;

    this.setState( {
      chatList: arrOld.concat( chat )
    } );
  }

  makeTimeStringByUtc = ( milSec: number ) => {
    const date: Date = new Date( milSec );
    let hours: string = String( date.getHours() );
    let minutes: string = String( date.getMinutes() );

    if( hours.length < 2 ) {
      hours = '0' + hours;
    }
    if( minutes.length < 2 ) {
      minutes = '0' + minutes;
    }

    return `${ hours }:${ minutes }`;
  }

  onSendChat = ( msg: string ) => {
    this.socket.emit( ChatEvent.MESSAGE_FROM_CLIENT, msg );
  }

  renderChatItem = ( chat: IChatBase, index: number ) => {
    var retComponent: ReactElement | null;
    
    switch( chat.kind ) {
      case ChatEnum.Notice : {
        const dataNotice: IChatNotice = chat as IChatNotice;
        retComponent = <ChatNotice key={ index } noticeMsg={ dataNotice.noticeMsg } />
        break;
      }
        
      case ChatEnum.MyChat :
        const dataMyChat: IChatMsg = chat as IChatMsg;
        retComponent = 
          <ChatMessage 
            key={ index }
            userName={ dataMyChat.userName } 
            msg={ dataMyChat.msg }
            strTime={ dataMyChat.strTime }
            isMyChat={ true } />
        break;
      case ChatEnum.OthersChat :
        const dataOthersChat: IChatMsg = chat as IChatMsg;
        retComponent = 
          <ChatMessage 
            key={ index }
            userName={ dataOthersChat.userName } 
            msg={ dataOthersChat.msg }
            strTime={ dataOthersChat.strTime }
            isMyChat={ false } />
        break;
      default:
        retComponent = null
    }
    
    return retComponent;
  }

  render() {
    const { chatList, roomData, connectedCount } = this.state;
    
    const title: string = roomData ? roomData.title : '';

    return (
      <div className={styles.wrapper}>
        <RoomHeader 
          title={title}
          connectedCount={connectedCount} 
        />

        <ul className={styles.list}>
          { chatList.map( this.renderChatItem ) }
        </ul>

        <div className={styles.form}>
          <ChatInput onSendChat={ this.onSendChat } />
        </div>
      </div>
    );
  }
}

export default Room