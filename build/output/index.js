parcelRequire=function(e,r,n){var t="function"==typeof parcelRequire&&parcelRequire,i="function"==typeof require&&require;function u(n,o){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!o&&f)return f(n,!0);if(t)return t(n,!0);if(i&&"string"==typeof n)return i(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}a.resolve=function(r){return e[n][1][r]||r};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,a,l,l.exports)}return r[n].exports;function a(e){return u(a.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=t;for(var o=0;o<n.length;o++)u(n[o]);return u}({2:[function(require,module,exports) {
module.exports=n;var t=/^(?:\w+:)?\/\/(\S+)$/,r=/^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/,e=/^[^\s\.]+\.\S{2,}$/;function n(n){if("string"!=typeof n)return!1;var o=n.match(t);if(!o)return!1;var s=o[1];return!!s&&!(!r.test(s)&&!e.test(s))}
},{}],1:[function(require,module,exports) {
"use strict";var t=require("is-url"),e=i(t);function i(t){return t&&t.__esModule?t:{default:t}}window.i=0;var n=function(t){var e=$("<i></i>").addClass("fa fa-spinner fa-pulse loading fa-2x"),i=$("<div></div>").addClass("absolute-center").append(e),n=$("<iframe></iframe>").attr("src",t.url||"").attr("onload","initIframe(this)").attr("width","100%").attr("height","100%").addClass("page").addClass("hide"),a=$("<div></div>").addClass("iframe-holder");return a.append(i).append(n),a},a=function(t,e){return!(!t||!e)&&(!!t.parentElement&&void $(e).insertBefore($(t)))},r=function(){resetIframeHeight(),window.onresize=function(){resetIframeHeight()}};window.initIframe=function(t){if(!t)return!1;var e=$(t).parent()[0];$(e).children().each(function(t,i){"IFRAME"!=i.tagName&&e.removeChild(i)}),$(t).removeClass("hide"),window.resetIframeHeight()},window.resetIframeHeight=function(){$("iframe").each(function(t,e){if(e){var i=$(e).attr("height")||"",n=i.match(/\d+%$/);if(n){var a=parseInt(n);i=$(e).parent().height()*a/100,$(e).css("height",i+"px")}}})};var d=function(t){return!(!t||"string"!=typeof t)&&(t.match(/^http[s]?:[/]{2}/)||(t="http://"+t),t)},o=function(t){if(!e.default)throw"isUri 未能成功加载";return(0,e.default)(t)?t:void 0},s=function(t,e,i){if(!t||1!=t.nodeType)return!1;if(!i||"string"!=typeof i)return!1;var n=Boolean(e),a=n?"is-valid":"is-invalid",r=n?"valid-tooltip":"invalid-tooltip",d=$(t).parent().find(".feedback")[0];d||(d=$("<div></div>").addClass("feedback").insertAfter(t)),$(t).removeClass("is-valid is-invalid").addClass(a),$(d).text(i).removeClass("valid-tooltip invalid-tooltip").addClass(r)},f=function(t,e){s(t,!0,e)},u=function(t,e){s(t,!1,e)},l=function(t){if(!t||!$(t).hasClass("entrance"))return!1;var e=$(t).find("input[type=text]")[0];if(!e||!e.value)return!1;var i=$(e).val(),a=o(d(i))||"https://www.baidu.com/s?ie=UTF-8&wd="+i,r=n({url:a});$(t).html(r)},c=function(t){if(!t||!$(t).hasClass("entrance"))return!1;var e=$(t).find("input[type=text]")[0];e&&$(e).on("keypress",function(e){13==e.keyCode&&t.submit()})},v=function(t){if(!t||!$(t).hasClass("entrance"))return!1;t.submit=function(){l(t)};var e=$(t).find("button")[0];e&&$(e).on("click",function(){t.submit()})},h=function(){$(".entrance").each(function(t,e){e&&(window.i+=1,$(e).attr("id","entrance-"+window.i),v(e),c(e))})};$(document).ready(function(){if(!document.querySelector)return!1;r(),h()});
},{"is-url":2}]},{},[1])
//# sourceMappingURL=/index.map