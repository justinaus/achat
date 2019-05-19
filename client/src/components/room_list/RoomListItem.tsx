import React, { Component } from "react";
import styles from './RoomListItem.module.css'
import { IRoom } from "../../interfaces/IRoom";
import classNames from "classnames";
import ConnectedCount from "../common/ConnectedCount";

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

    // 동적으로 가져와야 하는데 임시로 처리.
    const gray = '#868e96';

    const connectedCountStyle = {
      'fontSize': '12px',
      'color': gray
    }
    
    return (
      <li className={ cn } onClick={ () => onClickItem( roomData ) }>
        <div className={ styles.time }>
          { roomData ? this.getWholeTimeString( roomData ) : null }
        </div>
        <div>
          <div className={ styles.title }>{ roomData ? roomData.title : '' }</div>
          <ConnectedCount 
            count={ roomData && roomData.connected_count ? roomData.connected_count : 0 } 
            iconColor={ gray }
            objStyle={ connectedCountStyle } />
        </div>
      </li>
    );
  }
}

export default RoomListItem