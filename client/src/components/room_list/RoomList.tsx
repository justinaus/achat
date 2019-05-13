import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { IRoom } from "../../interfaces/IRoom";
import styles from './RoomList.module.css'
import RoomListItem from "./RoomListItem";

interface IState {
  roomList: Array<IRoom>
}

class RoomList extends Component<RouteComponentProps, IState> {
  constructor( props: RouteComponentProps  ) {
    super( props );

    this.state = {
      roomList: []
    }

    this.getData();
  }

  getData = () => {
    const ENV_HOST: string | undefined = process.env.REACT_APP_TEMP_HOST;
    const HOST: string = ENV_HOST ? ENV_HOST : 'localhost:4001';
    const URL: string = `http://${HOST}/api/rooms`;

    fetch( URL )
    .then( ( response ) => {
      return response.json();
    } ).then( ( data ) => {
      this.setState( {
        roomList: data
      } );
    } ).catch( ( error ) => {
      console.log( error );
    } );
  }

  onClickItem = ( roomData: IRoom ) => {
    this.props.history.push( '/room/' + roomData.id, roomData );
  }

  renderRoomItem = ( roomData: IRoom ) => {
    return (
      <RoomListItem 
        key={ roomData.id } 
        roomData={ roomData } 
        onClickItem={ this.onClickItem } />
    );
  }

  render() {
    const roomList = this.state.roomList;

    return (
      <div>
        <div className={ styles.header }>
          <img src='/assets/images/microsoft_PNG19.png' className={ styles.logo } alt='logo' />
        </div>
        <ul className={ styles.list }>
          { roomList.map( this.renderRoomItem ) }
        </ul>
      </div>
    );
  }
}

export default RoomList