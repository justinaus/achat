import moment = require("moment");
import { JSDOM } from "jsdom";
import fetch from 'node-fetch'
import IRoom from "./interfaces/IRoom";

export default class DataManager {
  public async getJsonRoomsNow() {
    const params = new URLSearchParams({
      pkid: '66',
      where: 'nexearch',
      key: 'MultiChannelWeekSchedule',
      u1: '999',
      u5: moment().format('YYYYMMDD0hhmm0'),
      u2: '814715|815041|815548|814863|814819|814825|815571|815572|815574|815576|2438226|814595|814592|814588|814582|2876055|814574',
    })

    const response = await fetch(`https://m.search.naver.com/p/csearch/content/nqapirender.nhn?${params}`)
    const data = await response.json()
    const document = new JSDOM(data.dataHtml).window.document

    const arrProgram = [...document.querySelectorAll('.ind_program.on')];

    var arrRet:Array<IRoom> = [];
    
    for( var i:number=0; i<arrProgram.length; ++i) {
      const item: any = arrProgram[ i ];

      const elSubInfoRe = <HTMLElement>item.querySelector('.sub_info .re');

      if( elSubInfoRe ) continue;

      const titleEl = <HTMLElement>item.querySelector('.pr_title')
      const href = titleEl.getAttribute('href') || ''
      const id = href.slice(1).split('&').find(q => q.startsWith('os'))

      if( !id ) continue;

      const timeEl = <HTMLElement>item.querySelector('.time')
      const nextItem = item.nextElementSibling
      const endTimeEl = nextItem ? nextItem.querySelector('.time') : null

      const room: IRoom = {
        id: Number( id.replace('os=', '') ),
        title: titleEl.innerHTML || '',
        start_time: timeEl.innerHTML || '',
        end_time: endTimeEl ? endTimeEl.innerHTML : '--:--',
        connected_count: null
      }

      arrRet.push( room );
    }

    return arrRet;
  }
}