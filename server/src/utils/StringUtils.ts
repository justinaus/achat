export default class StringUtils {
  public static make00String( nOrigin: number ) {
    var strRet: string;

    if( nOrigin < 10 ) {
      strRet = '0' + nOrigin;
    } else {
      strRet = '' + nOrigin;
    }

    return strRet;
  }

  // 마지막 부분만 x.
  // ex) 123.456.78.x.
  public static parseIpLastX( strIpOrigin: string ) {
    var arrSplit = strIpOrigin.split( '.' );

    if( arrSplit.length < 1 ) {
      return 'invalid ip'
    }

    arrSplit[ arrSplit.length - 1 ] = 'x';

    const result = arrSplit.join( '.' );

    return result;
  }
}