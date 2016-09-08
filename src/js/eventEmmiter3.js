/**
 * Created by haiwei on 2016/9/1.
 */
// This is a simple events emmiter
var eventsList = {},
	listen,
	trigger,
	remove,
	listenOnce;

// listen events
listen = function(key, fn) {
	if(!eventsList[key]) {
		eventsList[key] = {};
		eventsList[key].fns = [];
	}
	eventsList[key].once = false;
	eventsList[key].fns.push(fn);
};

// listen once
listenOnce = function(key, fn) {
	listen(key, fn);
	eventsList[key].once = true;
};

// trigger events
trigger = function() {
	var key = Array.prototype.shift.call(arguments),
		fns = eventsList[key].fns;
	if(!fns || fns.length === 0) {
		return false;
	}
	for(var i = 0; i < fns.length; i++) {
		var fn = fns[i];
		fn.apply(this, arguments);
	}
	// listen once!
	if(eventsList[key].once) {
		remove(key);
	}
};

// remove events
remove = function(key, fn){
	var fns = eventsList[key].fns;
	if(!fns) {
		return false;
	}
	if(!fn) {
		fns.length = 0;
	} else {
		for(var l = fns.length - 1; l >= 0; l--) {
			var _fn = fns[l];
			if(_fn === fn) {
				fns.splice(l, 1);
			}
		}
	}
};

module.exports = {
	listen: listen,
	listenOnce: listenOnce,
	trigger: trigger,
	remove: remove
};