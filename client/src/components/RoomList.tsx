import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { IRoom } from "../interfaces/IRoom";
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
    const TEMP_URL: string = 'https://my-json-server.typicode.com/justinaus/achat/rooms';

    fetch( TEMP_URL )
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
    this.props.history.push( '/room', roomData );
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