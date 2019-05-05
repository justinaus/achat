import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { IRoom } from "../../interfaces/IRoom";
import { Table } from "react-bootstrap";

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
      <tr key={ roomData.id } onClick={ () => this.onClickItem( roomData ) }>
        <td>{ roomData.title }</td>
      </tr>
    );
  }

  render() {
    const roomList = this.state.roomList;

    return (
      <Table hover size="sm">
        <tbody>
          { roomList.map( this.renderRoomItem ) }
        </tbody>
      </Table>
    );
  }
}

export default RoomList