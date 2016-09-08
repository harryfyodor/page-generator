(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
/**
 * Created by haiwei on 2016/9/1.
 */
(function(){
	var eventEventEmmiter3 = require('./eventEmmiter3.js'),
		utils = require('./utils.js'),
		eventUtil = utils.eventUtil,
		animate = utils.animate,
		getElemenTop = utils.getElementTop;

	// dom needed
	var header = document.getElementsByTagName('header')[0];
	var secAbout = document.getElementsByClassName('sec-about')[0];
	var secTech = document.getElementsByClassName('sec-tech')[0];
	var secProj = document.getElementsByClassName('sec-proj')[0];
	var secBlogs = document.getElementsByClassName('sec-blogs')[0];
	var secContact = document.getElementsByClassName('sec-contact')[0];

	// tops of dom node
	var tops = {
		ABOUT_TOP : getElemenTop(secAbout),
		TECH_TOP: getElemenTop(secTech),
		PROJ_TOP: getElemenTop(secProj),
		BLOGS_TOP: getElemenTop(secBlogs),
		CONTACT_TOP: getElemenTop(secContact)
	}

	function detectmob() {
		if( navigator.userAgent.match(/Android/i)
			|| navigator.userAgent.match(/webOS/i)
			|| navigator.userAgent.match(/iPhone/i)
			|| navigator.userAgent.match(/iPad/i)
			|| navigator.userAgent.match(/iPod/i)
			|| navigator.userAgent.match(/BlackBerry/i)
			|| navigator.userAgent.match(/Windows Phone/i)
		){
			return true;
		}
		else {
			return false;
		}
	}

	// when to fade in
	var halfClientHeight = detectmob() ? document.documentElement.clientHeight - 200
							: document.documentElement.clientHeight/2 + 130;

	// listen for once
	eventEventEmmiter3.listenOnce("tech", function(){
		animate(secTech, "appearing", "appeared", 1000);
	});

	eventEventEmmiter3.listenOnce("proj", function(){
		animate(secProj, "appearing", "appeared", 1000);
	});

	eventEventEmmiter3.listenOnce("blogs", function(){
		animate(secBlogs, "appearing", "appeared", 1000);
	});

	eventEventEmmiter3.listenOnce("contact", function(){
		animate(secContact, "appearing", "appeared", 1000);
	});

	// listen scroll
	eventUtil.addHandler(window, "scroll", function(){
		var scrollTop = document.body.scrollTop + halfClientHeight;
		if(scrollTop >= tops.TECH_TOP && scrollTop <= tops.PROJ_TOP) {
			eventEventEmmiter3.trigger("tech");
		} else if(scrollTop >= tops.PROJ_TOP && scrollTop <= tops.BLOGS_TOP) {
			eventEventEmmiter3.trigger("proj");
		} else if(scrollTop >= tops.BLOGS_TOP && scrollTop <= tops.CONTACT_TOP) {
			eventEventEmmiter3.trigger("blogs");
		} else if(scrollTop >= tops.CONTACT_TOP) {
			eventEventEmmiter3.trigger("contact");
		}
	});

	// scroll menu
	var menu = header.getElementsByTagName('ul')[0];
	eventUtil.addHandler(menu, 'click', function(event){
		event = eventUtil.getEvent(event);
		if(eventUtil.getTarget(event).tagName.toLowerCase() === "a") {
			var top,
			    targetName = eventUtil.getTarget(event).name,
			    topType = targetName.toUpperCase() + "_TOP";

			top = tops[topType];

			var t = (top - document.body.scrollTop - 20)/50,
				i = 0;
			var setInter = setInterval(function(){
				if(i === 50) {
					clearInterval(setInter);
				}
				document.body.scrollTop += t;

				i++;
			}, 15)
		}
	});

	// scroll to top
	var getToTop = document.getElementsByClassName('back-top')[0];
	eventUtil.addHandler(getToTop, 'click', function(){
		var top = document.body.scrollTop,
			t = top/50,
			i = 0;
		var setInter = setInterval(function(){
			document.body.scrollTop -= t;
			i++;
			if(i === 50) {
				clearInterval(setInter);
			}
		}, 10);
	});

})();
},{"./eventEmmiter3.js":1,"./utils.js":3}],3:[function(require,module,exports){
/**
 * Created by haiwei on 2016/9/5.
 */

// animation
var animate = function(ele, transitionClass, endClass, time) {
	var preClass = ele.className;
	ele.className = preClass + " " + transitionClass;
	var timeout = setTimeout(function(){
		ele.className = preClass + " " + endClass;
		clearTimeout(timeout);
	}, time);
};

// handle events
var eventUtil = {
	addHandler: function(element, type, handler) {
		if(element.addEventListener) {
			element.addEventListener(type, handler, false);
		} else if (element.attachEvent) {
			element.attachEvent("on" + type, handler);
		} else {
			element["on" + type] = handler;
		}
	},
	getEvent: function(event) {
		return event ? event : window.event;
	},
	getTarget: function(event) {
		return event.target || event.srcElement;
	},
	preventDefault: function(event) {
		if(event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	},
	stopPropagation: function(event) {
		if(event.stopPropagation) {
			event.stopPropagation();
		} else {
			event.cancelBubble = true;
		}
	}
}

// top
var getElementTop = function(element) {
	var actualTop = element.offsetTop;
	var current = element.offsetParent;

	while (current !== null) {
		actualTop += current.offsetTop;
		current = current.offsetParent;
	}

	return actualTop;
}

module.exports = {
	animate: animate,
	eventUtil: eventUtil,
	getElementTop: getElementTop
}
},{}]},{},[2,1,3])


//# sourceMappingURL=bundle.js.map
