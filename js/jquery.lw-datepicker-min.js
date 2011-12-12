/*!
 * Lightweight DatePicker - jQuery Plugin
 * Provides themeable and customizable date picker
 *
 * © 2011 Maxim Zhukov (zhkv.mxm@gmail.com)
 * 
 * Version: 1.0 (12/12/2011)
 * Requires: jQuery v1.6+
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
var $,LightweightDatepicker,checkEqualDates,settings,__bind=function(b,a){return function(){return b.apply(a,arguments)}};$=jQuery;settings={startDate:null,endDate:null,dowNames:"sun,mon,tue,wed,thu,fri,sat".split(","),monthNames:"January,February,March,April,May,June,July,August,September,October,November,December".split(","),firstDayOfTheWeekIndex:1,autoFillToday:!1,multiple:!1,alwaysVisible:!1,autoHideAfterClick:!1,parseDate:null,formatDate:null,onChange:null,margin:6};
checkEqualDates=function(b,a){return b.getFullYear()!==a.getFullYear()||b.getMonth()!==a.getMonth()?!1:b.getDate()===a.getDate()};
LightweightDatepicker=function(){function b(a){this.handleKeyDown=__bind(this.handleKeyDown,this);this.changeDay=__bind(this.changeDay,this);this.changeMonth=__bind(this.changeMonth,this);this.bindTo=__bind(this.bindTo,this);this.show=__bind(this.show,this);this.hide=__bind(this.hide,this);this.onChange=__bind(this.onChange,this);this.updateMonth=__bind(this.updateMonth,this);this.onPreviousClick=__bind(this.onPreviousClick,this);this.onNextClick=__bind(this.onNextClick,this);this.settings=a;this.isIE=
$.browser.msie&&8>=parseInt($.browser.version);this.todayDate=new Date;this.currentDate=new Date;this.wrapper=$('<div class="lw-dp"/>');this.toolbar=$('<div class="lw-dp-toolbar"/>').appendTo(this.wrapper);this.previous=$('<div class="lw-dp-previous">\u25c4</div>').appendTo(this.toolbar);this.next=$('<div class="lw-dp-next">\u25ba</div>').appendTo(this.toolbar);this.month=$('<div class="lw-dp-month"/>').appendTo(this.toolbar);this.renderDows().appendTo(this.wrapper);this.days=$("<div />").appendTo(this.wrapper);
this.updateMonth();this.wrapper.bind("mousedown",__bind(function(a){a.preventDefault();a.stopPropagation();if(this.isIE)return this.shouldHide=!1},this));a=this.isIE?"mousedown":"click";this.wrapper.delegate(".lw-dp-next",a,this.onNextClick);this.wrapper.delegate(".lw-dp-previous",a,this.onPreviousClick);$(this.days).delegate("li:not(.lw-dp-active-day)",a,__bind(function(a){return this.selectDay($(a.currentTarget))},this));this.wrapper.appendTo(document.body)}b.prototype.currentInput=null;b.prototype.activeDate=
null;b.prototype.canSelectPreviousMonth=!0;b.prototype.canSelectNextMonth=!0;b.prototype.shouldHide=!0;b.prototype.selectDay=function(a,e){var c,b,f,h,g;null==e&&(e=!0);h=this.currentDate.getFullYear();f=this.currentDate.getMonth();c=parseInt(a.text());b=0;a.hasClass("lw-dp-neighbour-month-day")&&(b=10<c?-1:1);c=new Date(h,f+b,c);if(null==this.settings.startDate||c.getTime()>=this.settings.startDate.getTime())if(null==this.settings.endDate||c.getTime()<=this.settings.endDate.getTime())a.parent().parent().find("li").removeClass("lw-dp-active-day"),
a.addClass("lw-dp-active-day"),this.activeDate=c,0!==b&&this.updateMonth(b);this.updateInput();if(this.settings.autoHideAfterClick&&e)null!=(g=this.currentInput)&&g.blur();if("function"===typeof this.settings.onChange)return this.settings.onChange(this.currentInput,this.activeDate)};b.prototype.updateInput=function(a){if(null==a)a=this.currentInput;return null!=a?a.val(this.formatDate(this.activeDate)):void 0};b.prototype.parseDate=function(a){return"function"===typeof this.settings.parseDate?this.settings.parseDate(a):
new Date(Date.parse(a))};b.prototype.formatDate=function(a){return"function"===typeof this.settings.formatDate?this.settings.formatDate(a):null!=a?a.getMonth()+1+"/"+a.getDate()+"/"+a.getFullYear():""};b.prototype.onNextClick=function(){return this.updateMonth(1)};b.prototype.onPreviousClick=function(){return this.updateMonth(-1)};b.prototype.updateMonth=function(a){var e,b,d,f,h,g,i;null==a&&(a=0);this.currentDate.setMonth(this.currentDate.getMonth()+a);this.month.html(this.settings.monthNames[this.currentDate.getMonth()]+
", "+this.currentDate.getFullYear());e=this.currentDate;a=new Date(e.getFullYear(),e.getMonth(),0);null!=this.settings.startDate&&a.getTime()<this.settings.startDate.getTime()?(this.canSelectPreviousMonth=!1,$(this.previous).hide()):(this.canSelectPreviousMonth=!0,$(this.previous).show());b=new Date(e.getFullYear(),e.getMonth()+1,1);null!=this.settings.endDate&&b.getTime()>this.settings.endDate.getTime()?(this.canSelectNextMonth=!1,$(this.next).hide()):(this.canSelectNextMonth=!0,$(this.next).show());
b=(new Date(e.getFullYear(),e.getMonth(),1)).getDay();f=(this.settings.firstDayOfTheWeekIndex+6)%7;b=(7-b+this.settings.firstDayOfTheWeekIndex)%7;0===b&&(b=7);a.getDate();a=new Date(e.getFullYear(),e.getMonth(),b-6);d=(new Date(e.getFullYear(),e.getMonth()+1,0)).getDate();i=Math.ceil((d+7-b)/7);h=__bind(function(a){var b,c,d;c=[];b="";d=a.getDate();a.getMonth()!==e.getMonth()&&c.push("lw-dp-neighbour-month-day");(0===a.getDay()||6===a.getDay())&&c.push("lw-dp-weekend");a.getDay()===f&&c.push("lw-dp-week-last-column");
checkEqualDates(a,this.todayDate)&&(c.push("lw-dp-today"),d="<span>"+d+"</span>");null!=this.activeDate&&checkEqualDates(a,this.activeDate)&&c.push("lw-dp-active-day");this.settings.startDate&&a.getTime()<=this.settings.startDate.getTime()&&(c.push("lw-dp-out-of-interval"),d="");this.settings.endDate&&a.getTime()>=this.settings.endDate.getTime()&&(c.push("lw-dp-out-of-interval"),d="");c.length&&(b=" class='"+c.join(" ")+"'");a.setDate(a.getDate()+1);return"<li"+b+">"+d+"</li>"},this);d="";for(g=1;1<=
i?g<=i:g>=i;1<=i?g++:g--){d=1===g?d+'<ul class="lw-dp-week lw-dp-firstweek">':g===i?d+'<ul class="lw-dp-week lw-dp-lastweek">':d+'<ul class="lw-dp-week">';for(b=1;7>=b;b++)d+=h(a);d+="</ul>"}return this.days.html(d)};b.prototype.renderDows=function(){var a,b,c,d,f,h,g,i;b=this.settings.dowNames[this.settings.firstDayOfTheWeekIndex];c=!1;d='<ul class="lw-dp-dows">';f="";i=this.settings.dowNames;for(h=0,g=i.length;h<g;h++)a=i[h],a===b&&(c=!0),a="<li>"+a+"</li>",c?d+=a:f+=a;return $(d+f+"</ul>")};b.prototype.updatePosition=
function(a){var b,c,d,f;b=a.offset();f=this.wrapper.outerWidth();d=this.wrapper.outerHeight();c=b.left;$("body").width()>c+f?this.wrapper.css({left:c}):b.left>f+this.settings.margin?this.wrapper.css({left:b.left-f-this.settings.margin}):this.wrapper.css({left:c});a=b.top+a.outerHeight()+this.settings.margin;return $(document).height()>a+d?this.wrapper.css({top:a}):b.top>d+this.settings.margin?this.wrapper.css({top:b.top-d-this.settings.margin}):this.wrapper.css({top:a})};b.prototype.onChange=function(a){this.saveData($(a.currentTarget));
this.updateMonth();return this.updateInput($(a.currentTarget))};b.prototype.hide=function(a){var b;!this.settings.alwaysVisible&&this.shouldHide&&(this.wrapper.addClass("lw-dp-hidden"),this.wrapper.css({top:"-9999px"}));if(!this.shouldHide)null!=(b=this.currentInput)&&b.focus();this.shouldHide=!0;if(null!=a)return this.onChange(a)};b.prototype.show=function(a){this.wrapper.removeClass("lw-dp-hidden");null!=a&&(this.loadData($(a.currentTarget)),this.updatePosition($(a.currentTarget)));return this.updateMonth()};
b.prototype.loadData=function(a){a=a.data("lw-datepicker");return $.extend(this,a)};b.prototype.isDateValid=function(a){return"[object Date]"!==Object.prototype.toString.call(a)?!1:!isNaN(a.getTime())};b.prototype.saveData=function(a){var b;b=this.parseDate(a.val());if(this.isDateValid(b))this.currentDate=new Date(b.getTime()),this.activeDate=new Date(b.getTime());else if(this.settings.autoFillToday)this.activeDate=new Date(this.todayDate.getTime());return a.data("lw-datepicker",{activeDate:this.activeDate,
currentDate:new Date(this.currentDate.getTime()),currentInput:a})};b.prototype.bindTo=function(a){a=$(a);a.bind("focus",this.show);a.bind("blur",this.hide);a.bind("change",this.onChange);a.bind("keydown",this.handleKeyDown);this.saveData(a);this.loadData(a);this.updatePosition(a);this.updateInput(a);this.updateMonth();return this.hide()};b.prototype.changeMonth=function(){var a,b,c;if(null!=this.activeDate)return b=this.activeDate.getDate()-1,a=new Date(this.activeDate.getTime()),a.setMonth(this.currentDate.getMonth()),
a.setFullYear(this.currentDate.getFullYear()),c=$(this.days).find("li:not(.lw-dp-neighbour-month-day)"),c.length<=b?this.selectDay(c.last(),!1):null!=this.settings.endDate&&a.getTime()>this.settings.endDate.getTime()?this.selectDay(c.eq(this.settings.endDate.getDate()-2),!1):null!=this.settings.startDate&&a.getTime()<this.settings.startDate.getTime()?this.selectDay(c.eq(this.settings.startDate.getDate()),!1):this.selectDay(c.eq(b),!1)};b.prototype.changeDay=function(a){var b,c,d;d="prev"===a?"last":
"first";null!=this.activeDate?(b=$(this.days).find("li.lw-dp-active-day"),c=b[a](),c.length||(c=b.parent()[a]().children()[d]())):c=$(this.days).find("li.lw-dp-today");return this.selectDay(c,!1)};b.prototype.handleKeyDown=function(a){var b;b=a.keyCode;a=!0;switch(b){case 27:this.hide();this.currentInput.blur();break;case 33:this.canSelectPreviousMonth&&(this.onPreviousClick(),this.changeMonth());break;case 34:this.canSelectNextMonth&&(this.onNextClick(),this.changeMonth());break;case 38:this.changeDay("prev");
break;case 40:this.changeDay("next");break;default:a=!1}return!a};return b}();$.fn.lwDatepicker=function(b){var a,b=$.extend(settings,b);a=null;return this.each(function(){var e;e=$(this);if(e.is("input, textarea")&&!e.data("lw-datepicker")){if(b.multiple)return e=new LightweightDatepicker(b),e.bindTo(this);a||(a=new LightweightDatepicker(b));return a.bindTo(this)}})};
