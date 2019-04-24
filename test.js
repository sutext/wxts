var wxts = require('./index');
var sys = wxts.sys;
sys.debug = true;
var func = sys.okstr
var log = sys.log
log('0:', func(0));
log('110:', func(110));
log('str:1:', func('1'));
log('str:11:', func('11'));
log('str:xdfs0:', func('xdfs0'));
log('str:1xxfdf:', func('1xxfdf'));
log('str:1.0.1:', func('1.0.1'));
log('str:1..0:', func('1..0'));
log('str:1.1:', func('1.1'));
log('str:12380128390', func('12380128390'));
log('023:', func(023));
log('0.23:', func(0.23));
log('1110.23:', func(1110.23));
log('boolean:true', func(true));