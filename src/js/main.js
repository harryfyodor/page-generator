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