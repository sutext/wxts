var wxts = require('./index');
var sys = wxts.sys;
sys.debug = true;
var func = sys.okint
sys.log('0:', func(0));
sys.log('110:', func(110));
sys.log('str:0:', func('0'));
sys.log('str:xdfs0:', func('xdfs0'));
sys.log('str:1xxfdf:', func('1xxfdf'));
sys.log('str:10.1:', func('10.1'));
sys.log('str:12380128390', func('12380128390'));
sys.log('023:', func(023));
sys.log('0.23:', func(0.23));
sys.log('1110.23:', func(1110.23));
sys.log('boolean:true', func(true));