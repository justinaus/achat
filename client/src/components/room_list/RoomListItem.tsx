import React, { Component } from "react";
import './RoomListItem.css'
import { IRoom } from "../../interfaces/IRoom";

interface IProps {
  roomData: IRoom,
  onClickItem: ( roomData: IRoom ) => void
}

class RoomListItem extends Component<IProps, any> {
  render() {
    const { roomData, onClickItem } = this.props;
    
    return (
      <li className='liRoomListItemContainer' onClick={ () => onClickItem( roomData ) }>
        <div>
          10:00 ~ 13:00
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