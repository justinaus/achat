import React, { Component } from "react";
import styles from './RoomListItem.module.css'
import { IRoom } from "../../interfaces/IRoom";
import classNames from "classnames";

interface IProps {
  roomData: IRoom,
  onClickItem: ( roomData: IRoom ) => void,
  isLast: boolean
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
    const { roomData, onClickItem, isLast } = this.props;

    let cn: any;

    if( isLast ) {
      cn = classNames( styles.wrapper );
    } else {
      cn = classNames( styles.wrapper, styles.borderBottom );
    }
    
    return (
      <li className={ cn } onClick={ () => onClickItem( roomData ) }>
        <div className={ styles.time }>
          { roomData ? this.getWholeTimeString( roomData ) : null }
        </div>
        <div>
          <div className={ styles.title }>{ roomData ? roomData.title : '' }</div>
          <div className={styles.users}>
            <svg xmlns="http://www.w3.org/2000/svg" height="8" viewBox="0 0 12 6.5">
              <path d="M4,7.5H2.5V6h-1V7.5H0v1H1.5V10h1V8.5H4ZM9,8a1.5,1.5,0,1,0-.455-2.93A2.467,2.467,0,0,1,9,6.5a2.516,2.516,0,0,1-.45,1.43A1.5,1.5,0,0,0,9,8ZM6.5,8A1.5,1.5,0,1,0,5,6.5,1.494,1.494,0,0,0,6.5,8ZM9.81,9.08a1.85,1.85,0,0,1,.69,1.42v1H12v-1C12,9.73,10.815,9.255,9.81,9.08ZM6.5,9c-1,0-3,.5-3,1.5v1h6v-1C9.5,9.5,7.5,9,6.5,9Z" transform="translate(0 -5)" fill="#868e96"/>
            </svg>
            <span>  </span>
            { roomData && roomData.connected_count ? roomData.connected_count : 0 }명
          </div>
        </div>
      </li>
    );
  }
}

export default RoomListItem