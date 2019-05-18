import moment from 'moment-timezone'
import fs from 'fs'
import IRoom from './interfaces/IRoom';
import DateUtils from './utils/DateUtils';
import StringUtils from './utils/StringUtils';

export default class DataManager {
  public getJsonRoomsNow() {
    const strNow = moment().tz( 'Asia/Seoul' ).format( 'YYYYMMDDHHmm' );
    
    const arrMonthRoomDataList = this.getMonthListByNow( strNow );
  
    const arrRoomList = this.getListForRoom( strNow, arrMonthRoomDataList );
    
    return arrRoomList;
  }

  private getMonthListByNow( strNow: string ) {
    const json = JSON.parse(fs.readFileSync('room.json', 'utf8'));
  
    var arrList = json[ strNow.slice( 0,6 ) ];
    
    const strYear = strNow.slice( 0,4 );
    const strMonth = strNow.slice( 4,6 );
    const strDay = strNow.slice( 6,8 );
  
    if( DateUtils.getIsLastDay( Number( strYear ), Number( strMonth ) - 1, Number( strDay ) ) ) {
      const nNextMonth = Number( strMonth ) + 1;
      const next = json[ strYear + StringUtils.make00String( nNextMonth ) ];
      if( next ) {
        arrList.push( next );
      }
    } else if( Number( strDay ) === 1 ) {
      const nPrevMonth = Number( strMonth ) - 1;
      const prev = json[ strYear + StringUtils.make00String( nPrevMonth ) ];
      if( prev ) {
        arrList.push( prev );
      }
    }
  
    return arrList;
  }
  
  private getListForRoom( strNow: string, arrItemList: Array<IRoom> ) {
    var arrRet = [];
  
    var item;
    var startTime;
    var endTime;
  
    for(var i=0; i<arrItemList.length; ++i) {
      item = arrItemList[ i ];
      startTime = item.start_time;
      endTime = item.end_time;
  
      if( Number( startTime ) > Number( strNow ) ) {
        continue;
      }
      if( Number( endTime ) < Number( strNow ) ) {
        continue;
      }
  
      // // 룸이 이미 존재 하면 그 숫자, 없으면 널.
      // const roomById = io.sockets.adapter.rooms[ item.id ];
      // item.connected_count = roomById ? roomById.length : null;
  
      arrRet.push( item );
    }
  
    return arrRet;
  }
}