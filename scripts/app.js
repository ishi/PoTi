require.config({waitSeconds:0,paths:{app:".",lodash:"../bower_components/lodash/lodash.min",Q:"../bower_components/q/q"},deps:["main"]}),define("timer/timer",["lodash"],function(t){var i=function(i){if(!i)throw new Error("Illegel value: "+i);this.interval=t.clone(i)};return i.prototype._tick=function(){var t=this.interval.value-Math.floor(((new Date).getTime()-this.startDate)/1e3);0>=t&&(t=0),this.remainingTime!==t&&this.tickCb&&this.tickCb(t),this.remainingTime=t,0===t&&this._timeUp()},i.prototype._timeUp=function(){this._stop(),this.timeUpCb&&this.timeUpCb()},i.prototype.start=function(){return this.stop(),this.startDate=(new Date).getTime(),this.timerId=setInterval(this._tick.bind(this),100),this},i.prototype.stop=function(){return this._stop(),this.remainingTime=this.interval.value,this},i.prototype._stop=function(){this.timerId&&clearInterval(this.timerId),this.remainingTime=0,delete this.timerId},i.prototype.onTick=function(t){return this.tickCb=t,this},i.prototype.onTimeUp=function(t){return this.timeUpCb=t,this},i}),define("timer/swTimerProxy",[],function(){var t=function(t){if(void 0===t||null===t)throw new Error("Illegel value: "+t);this.interval=t,this._setUp()};return t.prototype._tick=function(t){this.tickCb&&this.tickCb(t)},t.prototype._timeUp=function(){this.timeUpCb&&this.timeUpCb(),this._tearDown()},t.prototype._setUp=function(){this._tearDown(),window.addEventListener("message",this._messageListener.bind(this))},t.prototype._tearDown=function(){window.removeEventListener("message",this._messageListener)},t.prototype._messageListener=function(t){var i=t.data;switch(i.type){case"timer-tick":this._tick(i.payload);break;case"timer-time-up":this._timeUp()}},t.prototype.start=function(){return this._setUp(),navigator.serviceWorker.ready.then(function(t){t.active.postMessage({type:"timer-start",payload:this.interval})}.bind(this)),this},t.prototype.stop=function(){return this._tearDown(),navigator.serviceWorker.ready.then(function(t){t.active.postMessage({type:"timer-stop"})}.bind(this)),this},t.prototype.onTick=function(t){return this.tickCb=t,this},t.prototype.onTimeUp=function(t){return this.timeUpCb=t,this},t}),define("timer",["timer/timer","timer/swTimerProxy"],function(t,i){return navigator.serviceWorker?i:t}),define("notifier/notifier",[],function(){var t=function(){};return t.prototype.info=function(t,i){var e=new Notification(t,i);e.onclick=function(){window.focus()}},t}),define("notifier/swNotifierProxy",[],function(){var t=function(){};return t.prototype.info=function(t,i){navigator.serviceWorker.ready.then(function(e){e.active.postMessage({type:"notification",payload:{title:t,body:i}})})},t}),define("notifier",["notifier/notifier","notifier/swNotifierProxy"],function(t,i){function e(){if(!window.Notification||!Notification.requestPermission)return!1;if("granted"===Notification.permission)throw new Error("You must only call this *before* calling Notification.requestPermission(), otherwise this feature detect would bug theuser with an actual notification!");try{new Notification("")}catch(t){if("TypeError"===t.name)return!1}return!0}return window.Notification&&"granted"!==Notification.permission&&e()&&Notification.requestPermission(),navigator.serviceWorker?i:t}),define("main",["require","lodash","timer","notifier"],function(t,i,e,n){"use strict";function o(t){var e=i.clone(t);e.value*=60,u.counter=e}function r(t){u.set("counter.value",t)}function s(){var t=new Audio;t.src=t.canPlayType("audio/mpeg;")?"audio/alarm.mp3":"audio/alarm.wav",t.load(),t.play(),!navigator.serviceWorker&&window.Notification&&p.info({title:"Pomodoro",body:{body:"Your time is up"}})}function a(){c&&(c.stop(),c=void 0)}var c,u=document.querySelector("#app"),p=new n;u.displayInstalledToast=function(){document.querySelector("#caching-complete").show()},window.addEventListener("WebComponentsReady",function(){}),u.addEventListener("dom-change",function(){console.log("Our app is ready to rock!")}),u.settings={intervals:{FOCUS_TIME:{type:"FOCUS_TIME",value:25,label:"Focus time"},SHORT_BREAK:{type:"SHORT_BREAK",value:5,label:"Short break"},LONG_BREAK:{type:"LONG_BREAK",value:15,label:"Long break"}}},u.startTimer=function(t){t.stopPropagation(),a(),o(t.detail),c=new e(u.counter).onTick(r).onTimeUp(s),c.start()},u.stopTimer=function(t){t.preventDefault(),a()},o(u.settings.intervals.FOCUS_TIME),c=new e(u.counter).onTick(r)});