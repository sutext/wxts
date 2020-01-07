global.wx = {};
require('./index');
var sys = wx.sys;
sys.debug = true;
var func = sys.oknum;
var log = sys.log;
log('0:', func(0));
log('110:', func(110));
log('str:1:', func('1'));
log('str:11:', func('11'));
log('str:xdfs0:', func('xdfs0'));
log('str:1xxfdf:', func('1xxfdf'));
log('str:1.0.1:', func('1.0.1'));
log('str:1..0:', func('1..0'));
log('str:1.:', func('1.'));
log('str:12380128390', func('12380128390'));
log('023:', func(023));
log('0.23:', func(0.23));
log('1110.23:', func(1110.23));
log('boolean:true', func(true));
console.log((999).kmgtify(3)); //1M
console.log((1000000).kmgtify(4)); //1,000K
console.log((1000000).kmgtify(5)); //1,000K
console.log((1000000).kmgtify(6)); //1,000K
console.log((10000000).kmgtify(3)); //10M
console.log((10000000).kmgtify(4)); //10M
console.log((10000000).kmgtify(5)); //10,000K
console.log((999999999999999).kmgtify(6)); //1G
console.log((-999999999999999).toString(16));
console.log(wx);
