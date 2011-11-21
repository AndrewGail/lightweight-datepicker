(function() {
  var $, LightweightDatepicker, checkEqualDates, settings;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $ = jQuery;
  settings = {
    multiple: false,
    onChange: null,
    firstDayOfTheWeekIndex: 1,
    autoFillToday: false,
    alwaysVisible: false,
    parseDate: null,
    formatDate: null,
    startDate: null,
    endDate: null,
    dowNames: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
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
    function LightweightDatepicker(settings) {
      this.handleKeyUp = __bind(this.handleKeyUp, this);
      this.changeDay = __bind(this.changeDay, this);
      this.changeMonth = __bind(this.changeMonth, this);
      this.bindTo = __bind(this.bindTo, this);
      this.show = __bind(this.show, this);
      this.hide = __bind(this.hide, this);
      this.onChange = __bind(this.onChange, this);
      this.updateMonth = __bind(this.updateMonth, this);      this.settings = settings;
      this.todayDate = new Date;
      this.currentDate = new Date;
      this.wrapper = $('<div class="lw-dp"/>');
      this.toolbar = $('<div class="lw-dp-toolbar"/>').appendTo(this.wrapper);
      this.previous = $('<div class="lw-dp-previous">◄</div>').appendTo(this.toolbar);
      this.next = $('<div class="lw-dp-next">►</div>').appendTo(this.toolbar);
      this.month = $('<div class="lw-dp-month"/>').appendTo(this.toolbar);
      this.renderDows().appendTo(this.wrapper);
      this.days = $('<div />').appendTo(this.wrapper);
      this.next.bind('click', __bind(function() {
        return this.onNextClick();
      }, this));
      this.previous.bind('click', __bind(function() {
        return this.onPreviousClick();
      }, this));
      this.updateMonth();
      this.wrapper.bind('mousedown', function() {
        return false;
      });
      $(this.days).delegate('li:not(.lw-dp-active-day)', 'click', __bind(function(e) {
        var currentLi;
        currentLi = $(e.currentTarget);
        this.selectDay(currentLi);
        return false;
      }, this));
      console.log('constructor');
      this.wrapper.appendTo(document.body);
    }
    LightweightDatepicker.prototype.selectDay = function(currentLi) {
      var day, diff, month, selectedDate, year;
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
      var left, top;
      left = input.offset().left;
      if ($('body').width() > left + this.wrapper.outerWidth()) {
        this.wrapper.css({
          'left': left
        });
      } else {
        if (input.offset().left > this.wrapper.outerWidth() + this.settings.margin) {
          this.wrapper.css({
            'left': input.offset().left - this.wrapper.outerWidth() - this.settings.margin
          });
        } else {
          this.wrapper.css({
            'left': left
          });
        }
      }
      top = input.offset().top + input.outerHeight() + this.settings.margin;
      if ($(document).height() > top + this.wrapper.outerHeight()) {
        return this.wrapper.css({
          'top': top
        });
      } else {
        if (input.offset().top > this.wrapper.outerHeight() + this.settings.margin) {
          return this.wrapper.css({
            'top': input.offset().top - this.wrapper.outerHeight() - this.settings.margin
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
      console.log("hiding " + e);
      if (!this.settings.alwaysVisible) {
        this.wrapper.addClass('lw-dp-hidden');
        this.wrapper.css({
          'top': '-9999px'
        });
      }
      if (e != null) {
        return this.onChange(e);
      }
    };
    LightweightDatepicker.prototype.show = function(e) {
      console.log("showing " + e);
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
      $el.bind('keyup', this.handleKeyUp);
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
          return days.last().click();
        } else if ((this.settings.endDate != null) && activeDate.getTime() > this.settings.endDate.getTime()) {
          return days.eq(this.settings.endDate.getDate() - 2).click();
        } else if ((this.settings.startDate != null) && activeDate.getTime() < this.settings.startDate.getTime()) {
          return days.eq(this.settings.startDate.getDate()).click();
        } else {
          return days.eq(activeIndex).click();
        }
      }
    };
    LightweightDatepicker.prototype.changeDay = function(action) {
      var $current, $el, direction;
      direction = action === 'prev' ? 'last' : 'first';
      if (this.activeDate != null) {
        $current = $(this.days).find('li.lw-dp-active-day');
        $el = $current[action]();
        if ($el.length) {
          return $el.click();
        } else {
          return $current.parent()[action]().children()[direction]().click();
        }
      } else {
        return $(this.days).find('li.lw-dp-today').click();
      }
    };
    LightweightDatepicker.prototype.handleKeyUp = function(e) {
      var keyCode;
      keyCode = e.keyCode;
      switch (keyCode) {
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
      }
      return this.updateMonth;
    };
    return LightweightDatepicker;
  })();
  $.fn.lwDatepicker = function(options) {
    var instance;
    options = $.extend(settings, options);
    instance = null;
    return this.each(function() {
      var picker;
      if ($(this).is('input, textarea')) {
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
}).call(this);
