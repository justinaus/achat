import React, { Component } from "react";
import './RoomListItem.css'
import { IRoom } from "../../interfaces/IRoom";

interface IProps {
  roomData: IRoom,
  onClickItem: ( roomData: IRoom ) => void
}

class RoomListItem extends Component<IProps, any> {
  getTimeString = ( strYYYYMMDDHHmm: String ) => {
    const strHHmm = strYYYYMMDDHHmm.slice(-4);
    const start = strHHmm.slice( 0,2 );
    const end = strHHmm.slice( 2 );

    return start + ':' + end;
  }

  getWholeTimeString = ( roomData: IRoom ) => {
    const start = this.getTimeString( roomData.start_time );
    const end = this.getTimeString( roomData.end_time );
    
    return start + ' ~ ' + end;
  }

  render() {
    const { roomData, onClickItem } = this.props;
    
    return (
      <li className='liRoomListItemContainer' onClick={ () => onClickItem( roomData ) }>
        <h4>
          { roomData ? this.getWholeTimeString( roomData ) : null }
        </h4>
        <div>
          <h3>{ roomData ? roomData.title : '' }</h3>
          <h4>{ roomData && roomData.connected_count ? roomData.connected_count : 0 } 명</h4>
        </div>
      </li>
    );
  }
}

export default RoomListItem