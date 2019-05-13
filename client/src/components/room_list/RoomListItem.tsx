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
        <div>
          { roomData ? this.getWholeTimeString( roomData ) : null }
        </div>
        <div>
          <span>{ roomData.title }</span>
          <span>3명</span>
        </div>
      </li>
    );
  }
}

export default RoomListItem