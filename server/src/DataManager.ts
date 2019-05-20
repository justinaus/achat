import moment = require("moment");
import { JSDOM } from "jsdom";
import fetch from 'node-fetch'

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
    
    const rooms: any = [...document.querySelectorAll('.ind_program.on')].map((item, index) => {
      const titleEl = <HTMLElement>item.querySelector('.pr_title')
      const href = titleEl.getAttribute('href') || ''
      const id = href.slice(1).split('&').find(q => q.startsWith('os'))
      const timeEl = <HTMLElement>item.querySelector('.time')
      const nextItem = item.nextElementSibling
      const endTimeEl = nextItem ? nextItem.querySelector('.time') : null
  
      return {
        id: id ? id.replace('os=', '') : index + 1,
        title: titleEl.innerHTML || '',
        start_time: timeEl.innerHTML || '',
        end_time: endTimeEl ? endTimeEl.innerHTML : '--:--'
      }
    })
    
    return rooms;
  }
}