export default class DateUtils {
  public static getIsLastDay( year: number, monthIndexStart0: number, day: number ) {
    return  new Date( year, monthIndexStart0 + 1, 0).getDate() === day;
  }
}