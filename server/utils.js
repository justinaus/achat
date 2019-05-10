const make00String = function( origin ) {
  var nOrigin = Number( origin );

  if( nOrigin < 10 ) {
    nOrigin = '0' + nOrigin;
  }

  return '' + nOrigin;
}

const getIsLastDay = function( year, month, day){
  return  new Date( year, month +1, 0).getDate() === day;
}

// 마지막 부분만 x.
// ex) 123.456.78.x.
const parseIpLastX = function ( strIpOrigin ) {
  var arrSplit = strIpOrigin.split( '.' );

  if( arrSplit.length < 1 ) {
    return 'invalid ip'
  }

  arrSplit[ arrSplit.length - 1 ] = 'x';

  const result = arrSplit.join( '.' );

  return result;
}

module.exports = {
  make00String, 
  getIsLastDay,
  parseIpLastX
}
