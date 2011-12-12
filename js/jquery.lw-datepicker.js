var $, LightweightDatepicker, checkEqualDates, settings;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
$ = jQuery;
settings = {
  startDate: null,
  endDate: null,
  dowNames: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  firstDayOfTheWeekIndex: 1,
  autoFillToday: false,
  multiple: false,
  alwaysVisible: false,
  autoHideAfterClick: false,
  parseDate: null,
  formatDate: null,
  onChange: null,
  margin: 6
};
checkEqualDates = function(date1, date2) {
  if (date1.getFullYear() !== date2.getFullYear()) {
    return false;
  }
  if (date1.getMonth() !== date2.getMonth()) {
    return false;
  }
  return date1.getDate() === date2.getDate();
};
LightweightDatepicker = (function() {
  LightweightDatepicker.prototype.currentInput = null;
  LightweightDatepicker.prototype.activeDate = null;
  LightweightDatepicker.prototype.canSelectPreviousMonth = true;
  LightweightDatepicker.prototype.canSelectNextMonth = true;
  LightweightDatepicker.prototype.shouldHide = true;
  function LightweightDatepicker(settings) {
    this.handleKeyDown = __bind(this.handleKeyDown, this);
    this.changeDay = __bind(this.changeDay, this);
    this.changeMonth = __bind(this.changeMonth, this);
    this.bindTo = __bind(this.bindTo, this);
    this.show = __bind(this.show, this);
    this.hide = __bind(this.hide, this);
    this.onChange = __bind(this.onChange, this);
    this.updateMonth = __bind(this.updateMonth, this);
    this.onPreviousClick = __bind(this.onPreviousClick, this);
    this.onNextClick = __bind(this.onNextClick, this);
    var event;
    this.settings = settings;
    this.isIE = $.browser.msie && parseInt($.browser.version) <= 8;
    this.todayDate = new Date;
    this.currentDate = new Date;
    this.wrapper = $('<div class="lw-dp"/>');
    this.toolbar = $('<div class="lw-dp-toolbar"/>').appendTo(this.wrapper);
    this.previous = $('<div class="lw-dp-previous">◄</div>').appendTo(this.toolbar);
    this.next = $('<div class="lw-dp-next">►</div>').appendTo(this.toolbar);
    this.month = $('<div class="lw-dp-month"/>').appendTo(this.toolbar);
    this.renderDows().appendTo(this.wrapper);
    this.days = $('<div />').appendTo(this.wrapper);
    this.updateMonth();
    this.wrapper.bind('mousedown', __bind(function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (this.isIE) {
        return this.shouldHide = false;
      }
    }, this));
    event = this.isIE ? 'mousedown' : 'click';
    this.wrapper.delegate('.lw-dp-next', event, this.onNextClick);
    this.wrapper.delegate('.lw-dp-previous', event, this.onPreviousClick);
    $(this.days).delegate('li:not(.lw-dp-active-day)', event, __bind(function(e) {
      var currentLi;
      currentLi = $(e.currentTarget);
      return this.selectDay(currentLi);
    }, this));
    this.wrapper.appendTo(document.body);
  }
  LightweightDatepicker.prototype.selectDay = function(currentLi, fromEvent) {
    var day, diff, month, selectedDate, year, _ref;
    if (fromEvent == null) {
      fromEvent = true;
    }
    year = this.currentDate.getFullYear();
    month = this.currentDate.getMonth();
    day = parseInt(currentLi.text());
    diff = 0;
    if (currentLi.hasClass('lw-dp-neighbour-month-day')) {
      diff = day > 10 ? -1 : 1;
    }
    selectedDate = new Date(year, month + diff, day);
    if (!(this.settings.startDate != null) || selectedDate.getTime() >= this.settings.startDate.getTime()) {
      if (!(this.settings.endDate != null) || selectedDate.getTime() <= this.settings.endDate.getTime()) {
        currentLi.parent().parent().find('li').removeClass('lw-dp-active-day');
        currentLi.addClass('lw-dp-active-day');
        this.activeDate = selectedDate;
        if (diff !== 0) {
          this.updateMonth(diff);
        }
      }
    }
    this.updateInput();
    if (this.settings.autoHideAfterClick && fromEvent) {
      if ((_ref = this.currentInput) != null) {
        _ref.blur();
      }
    }
    if (typeof this.settings.onChange === 'function') {
      return this.settings.onChange(this.currentInput, this.activeDate);
    }
  };
  LightweightDatepicker.prototype.updateInput = function($el) {
    if ($el == null) {
      $el = this.currentInput;
    }
    return $el != null ? $el.val(this.formatDate(this.activeDate)) : void 0;
  };
  LightweightDatepicker.prototype.parseDate = function(string) {
    if (typeof this.settings.parseDate === 'function') {
      return this.settings.parseDate(string);
    } else {
      return new Date(Date.parse(string));
    }
  };
  LightweightDatepicker.prototype.formatDate = function(date) {
    if (typeof this.settings.formatDate === 'function') {
      return this.settings.formatDate(date);
    } else {
      if (date != null) {
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
      } else {
        return '';
      }
    }
  };
  LightweightDatepicker.prototype.onNextClick = function() {
    return this.updateMonth(1);
  };
  LightweightDatepicker.prototype.onPreviousClick = function() {
    return this.updateMonth(-1);
  };
  LightweightDatepicker.prototype.updateMonth = function(diff) {
    var cd, date, day, daysInFirstWeek, daysInMonth, daysInPreviousMonth, firstDayDow, firstDayOfNextMonth, html, lastDayOfPreviousMonth, lastDowIndex, renderDay, week, weeks;
    if (diff == null) {
      diff = 0;
    }
    this.currentDate.setMonth(this.currentDate.getMonth() + diff);
    this.month.html(this.settings.monthNames[this.currentDate.getMonth()] + ', ' + this.currentDate.getFullYear());
    cd = this.currentDate;
    lastDayOfPreviousMonth = new Date(cd.getFullYear(), cd.getMonth(), 0);
    if ((this.settings.startDate != null) && lastDayOfPreviousMonth.getTime() < this.settings.startDate.getTime()) {
      this.canSelectPreviousMonth = false;
      $(this.previous).hide();
    } else {
      this.canSelectPreviousMonth = true;
      $(this.previous).show();
    }
    firstDayOfNextMonth = new Date(cd.getFullYear(), cd.getMonth() + 1, 1);
    if ((this.settings.endDate != null) && firstDayOfNextMonth.getTime() > this.settings.endDate.getTime()) {
      this.canSelectNextMonth = false;
      $(this.next).hide();
    } else {
      this.canSelectNextMonth = true;
      $(this.next).show();
    }
    firstDayDow = (new Date(cd.getFullYear(), cd.getMonth(), 1)).getDay();
    lastDowIndex = (this.settings.firstDayOfTheWeekIndex + 6) % 7;
    daysInFirstWeek = (7 - firstDayDow + this.settings.firstDayOfTheWeekIndex) % 7;
    if (daysInFirstWeek === 0) {
      daysInFirstWeek = 7;
    }
    daysInPreviousMonth = lastDayOfPreviousMonth.getDate();
    date = new Date(cd.getFullYear(), cd.getMonth(), daysInFirstWeek - 6);
    daysInMonth = (new Date(cd.getFullYear(), cd.getMonth() + 1, 0)).getDate();
    weeks = Math.ceil((daysInMonth + 7 - daysInFirstWeek) / 7.0);
    renderDay = __bind(function(day) {
      var classAttribute, classes, liContent;
      classes = [];
      classAttribute = '';
      liContent = day.getDate();
      if (day.getMonth() !== cd.getMonth()) {
        classes.push('lw-dp-neighbour-month-day');
      }
      if (day.getDay() === 0 || day.getDay() === 6) {
        classes.push('lw-dp-weekend');
      }
      if (day.getDay() === lastDowIndex) {
        classes.push('lw-dp-week-last-column');
      }
      if (checkEqualDates(day, this.todayDate)) {
        classes.push('lw-dp-today');
        liContent = "<span>" + liContent + "</span>";
      }
      if ((this.activeDate != null) && checkEqualDates(day, this.activeDate)) {
        classes.push('lw-dp-active-day');
      }
      if (this.settings.startDate && day.getTime() <= this.settings.startDate.getTime()) {
        classes.push('lw-dp-out-of-interval');
        liContent = '';
      }
      if (this.settings.endDate && day.getTime() >= this.settings.endDate.getTime()) {
        classes.push('lw-dp-out-of-interval');
        liContent = '';
      }
      if (classes.length) {
        classAttribute = " class='" + (classes.join(" ")) + "'";
      }
      day.setDate(day.getDate() + 1);
      return "<li" + classAttribute + ">" + liContent + "</li>";
    }, this);
    html = '';
    for (week = 1; 1 <= weeks ? week <= weeks : week >= weeks; 1 <= weeks ? week++ : week--) {
      if (week === 1) {
        html += '<ul class="lw-dp-week lw-dp-firstweek">';
      } else if (week === weeks) {
        html += '<ul class="lw-dp-week lw-dp-lastweek">';
      } else {
        html += '<ul class="lw-dp-week">';
      }
      for (day = 1; day <= 7; day++) {
        html += renderDay(date);
      }
      html += '</ul>';
    }
    return this.days.html(html);
  };
  LightweightDatepicker.prototype.renderDows = function() {
    var day, first, found, html, name, temp, _i, _len, _ref;
    first = this.settings.dowNames[this.settings.firstDayOfTheWeekIndex];
    found = false;
    html = '<ul class="lw-dp-dows">';
    temp = '';
    _ref = this.settings.dowNames;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      if (name === first) {
        found = true;
      }
      day = "<li>" + name + "</li>";
      if (found) {
        html += day;
      } else {
        temp += day;
      }
    }
    html += temp;
    html += '</ul>';
    return $(html);
  };
  LightweightDatepicker.prototype.updatePosition = function(input) {
    var inputOffset, left, top, wrapperOuterHeight, wrapperOuterWidth;
    inputOffset = input.offset();
    wrapperOuterWidth = this.wrapper.outerWidth();
    wrapperOuterHeight = this.wrapper.outerHeight();
    left = inputOffset.left;
    if ($('body').width() > left + wrapperOuterWidth) {
      this.wrapper.css({
        'left': left
      });
    } else {
      if (inputOffset.left > wrapperOuterWidth + this.settings.margin) {
        this.wrapper.css({
          'left': inputOffset.left - wrapperOuterWidth - this.settings.margin
        });
      } else {
        this.wrapper.css({
          'left': left
        });
      }
    }
    top = inputOffset.top + input.outerHeight() + this.settings.margin;
    if ($(document).height() > top + wrapperOuterHeight) {
      return this.wrapper.css({
        'top': top
      });
    } else {
      if (inputOffset.top > wrapperOuterHeight + this.settings.margin) {
        return this.wrapper.css({
          'top': inputOffset.top - wrapperOuterHeight - this.settings.margin
        });
      } else {
        return this.wrapper.css({
          'top': top
        });
      }
    }
  };
  LightweightDatepicker.prototype.onChange = function(e) {
    this.saveData($(e.currentTarget));
    this.updateMonth();
    return this.updateInput($(e.currentTarget));
  };
  LightweightDatepicker.prototype.hide = function(e) {
    var _ref;
    if (!this.settings.alwaysVisible && this.shouldHide) {
      this.wrapper.addClass('lw-dp-hidden');
      this.wrapper.css({
        'top': '-9999px'
      });
    }
    if (!this.shouldHide) {
      if ((_ref = this.currentInput) != null) {
        _ref.focus();
      }
    }
    this.shouldHide = true;
    if (e != null) {
      return this.onChange(e);
    }
  };
  LightweightDatepicker.prototype.show = function(e) {
    this.wrapper.removeClass('lw-dp-hidden');
    if (e != null) {
      this.loadData($(e.currentTarget));
      this.updatePosition($(e.currentTarget));
    }
    return this.updateMonth();
  };
  LightweightDatepicker.prototype.loadData = function($el) {
    var data;
    data = $el.data('lw-datepicker');
    return $.extend(this, data);
  };
  LightweightDatepicker.prototype.isDateValid = function(date) {
    if (Object.prototype.toString.call(date) !== '[object Date]') {
      return false;
    }
    return !isNaN(date.getTime());
  };
  LightweightDatepicker.prototype.saveData = function($el) {
    var parsedDate;
    parsedDate = this.parseDate($el.val());
    if (this.isDateValid(parsedDate)) {
      this.currentDate = new Date(parsedDate.getTime());
      this.activeDate = new Date(parsedDate.getTime());
    } else if (this.settings.autoFillToday) {
      this.activeDate = new Date(this.todayDate.getTime());
    }
    return $el.data('lw-datepicker', {
      activeDate: this.activeDate,
      currentDate: new Date(this.currentDate.getTime()),
      currentInput: $el
    });
  };
  LightweightDatepicker.prototype.bindTo = function(el) {
    var $el;
    $el = $(el);
    $el.bind('focus', this.show);
    $el.bind('blur', this.hide);
    $el.bind('change', this.onChange);
    $el.bind('keydown', this.handleKeyDown);
    this.saveData($el);
    this.loadData($el);
    this.updatePosition($el);
    this.updateInput($el);
    this.updateMonth();
    return this.hide();
  };
  LightweightDatepicker.prototype.changeMonth = function() {
    var activeDate, activeIndex, days;
    if (this.activeDate != null) {
      activeIndex = this.activeDate.getDate() - 1;
      activeDate = new Date(this.activeDate.getTime());
      activeDate.setMonth(this.currentDate.getMonth());
      activeDate.setFullYear(this.currentDate.getFullYear());
      days = $(this.days).find('li:not(.lw-dp-neighbour-month-day)');
      if (days.length <= activeIndex) {
        return this.selectDay(days.last(), false);
      } else if ((this.settings.endDate != null) && activeDate.getTime() > this.settings.endDate.getTime()) {
        return this.selectDay(days.eq(this.settings.endDate.getDate() - 2), false);
      } else if ((this.settings.startDate != null) && activeDate.getTime() < this.settings.startDate.getTime()) {
        return this.selectDay(days.eq(this.settings.startDate.getDate()), false);
      } else {
        return this.selectDay(days.eq(activeIndex), false);
      }
    }
  };
  LightweightDatepicker.prototype.changeDay = function(action) {
    var $current, $el, direction;
    direction = action === 'prev' ? 'last' : 'first';
    if (this.activeDate != null) {
      $current = $(this.days).find('li.lw-dp-active-day');
      $el = $current[action]();
      if (!$el.length) {
        $el = $current.parent()[action]().children()[direction]();
      }
    } else {
      $el = $(this.days).find('li.lw-dp-today');
    }
    return this.selectDay($el, false);
  };
  LightweightDatepicker.prototype.handleKeyDown = function(e) {
    var handled, keyCode;
    keyCode = e.keyCode;
    handled = true;
    switch (keyCode) {
      case 27:
        this.hide();
        this.currentInput.blur();
        break;
      case 33:
        if (this.canSelectPreviousMonth) {
          this.onPreviousClick();
          this.changeMonth();
        }
        break;
      case 34:
        if (this.canSelectNextMonth) {
          this.onNextClick();
          this.changeMonth();
        }
        break;
      case 38:
        this.changeDay('prev');
        break;
      case 40:
        this.changeDay('next');
        break;
      default:
        handled = false;
    }
    this.updateMonth;
    return !handled;
  };
  return LightweightDatepicker;
})();
$.fn.lwDatepicker = function(options) {
  var instance;
  options = $.extend(settings, options);
  instance = null;
  return this.each(function() {
    var $el, picker;
    $el = $(this);
    if (($el.is('input, textarea')) && !$el.data('lw-datepicker')) {
      if (options.multiple) {
        picker = new LightweightDatepicker(options);
        return picker.bindTo(this);
      } else {
        if (!instance) {
          instance = new LightweightDatepicker(options);
        }
        return instance.bindTo(this);
      }
    }
  });
};