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