(function() {
  /*!
   * Lightweight DatePicker - jQuery Plugin
   * Provides themeable and customizable date picker
   *
   * © 2011 Maxim Zhukov (zhkv.mxm@gmail.com)
   * 
   * Version: 1.1
   * Requires: jQuery v1.6+
   *
   * Dual licensed under the MIT and GPL licenses:
   *   http://www.opensource.org/licenses/mit-license.php
   *   http://www.gnu.org/licenses/gpl.html
   */
  var $, LightweightDatepicker, compareDates, isDateValid, lw_dp_active_day_class, lw_dp_class, lw_dp_data_key, lw_dp_dows_class, lw_dp_dows_last_column_class, lw_dp_firstweek_class, lw_dp_hidden_class, lw_dp_lastweek_class, lw_dp_month_class, lw_dp_neighbour_month_day_class, lw_dp_next_class, lw_dp_out_of_interval_class, lw_dp_previous_class, lw_dp_today_class, lw_dp_toolbar_class, lw_dp_week_class, lw_dp_week_last_column_class, lw_dp_weekend_class, settings;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $ = jQuery;
  settings = {
    'startDate': null,
    'endDate': null,
    'dowNames': ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
    'monthNames': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    'firstDayOfTheWeekIndex': 0,
    'autoFillToday': false,
    'alwaysVisible': false,
    'autoHideAfterClick': false,
    'parseDate': null,
    'formatDate': null,
    'onChange': null
  };
  lw_dp_class = 'lw-dp';
  lw_dp_active_day_class = 'lw-dp-active-day';
  lw_dp_dows_class = 'lw-dp-dows';
  lw_dp_dows_last_column_class = 'lw-dp-dows-last-column';
  lw_dp_firstweek_class = 'lw-dp-firstweek';
  lw_dp_hidden_class = 'lw-dp-hidden';
  lw_dp_lastweek_class = 'lw-dp-lastweek';
  lw_dp_month_class = 'lw-dp-month';
  lw_dp_neighbour_month_day_class = 'lw-dp-neighbour-month-day';
  lw_dp_next_class = 'lw-dp-next';
  lw_dp_out_of_interval_class = 'lw-dp-out-of-interval';
  lw_dp_previous_class = 'lw-dp-previous';
  lw_dp_today_class = 'lw-dp-today';
  lw_dp_toolbar_class = 'lw-dp-toolbar';
  lw_dp_week_class = 'lw-dp-week';
  lw_dp_week_last_column_class = 'lw-dp-week-last-column';
  lw_dp_weekend_class = 'lw-dp-weekend';
  lw_dp_data_key = 'lw-datepicker';
  compareDates = function(date1, date2) {
    if (date1.getFullYear() < date2.getFullYear()) {
      return -1;
    }
    if (date1.getFullYear() > date2.getFullYear()) {
      return 1;
    }
    if (date1.getMonth() < date2.getMonth()) {
      return -1;
    }
    if (date1.getMonth() > date2.getMonth()) {
      return 1;
    }
    if (date1.getDate() < date2.getDate()) {
      return -1;
    }
    if (date1.getDate() > date2.getDate()) {
      return 1;
    }
    return 0;
  };
  isDateValid = function(date) {
    if (Object.prototype.toString.call(date) !== '[object Date]') {
      return false;
    }
    return !isNaN(date.getTime());
  };
  LightweightDatepicker = (function() {
    LightweightDatepicker.prototype.canShowPreviousMonth = true;
    LightweightDatepicker.prototype.canShowNextMonth = true;
    LightweightDatepicker.prototype.shouldHide = true;
    function LightweightDatepicker(el, settings) {
      this.handleKeyDown = __bind(this.handleKeyDown, this);
      this.showNextMonth = __bind(this.showNextMonth, this);
      this.showPreviousMonth = __bind(this.showPreviousMonth, this);
      this.show = __bind(this.show, this);
      this.hide = __bind(this.hide, this);
      this.isDateInsidePeriod = __bind(this.isDateInsidePeriod, this);
      this.setCurrentDate = __bind(this.setCurrentDate, this);
      this.setActiveDate = __bind(this.setActiveDate, this);
      this.updateMonth = __bind(this.updateMonth, this);
      this.getDateFromElement = __bind(this.getDateFromElement, this);      this.input = el;
      this.input.bind('focus', this.show);
      this.input.bind('blur', this.hide);
      this.input.bind('keydown', this.handleKeyDown);
      this.input.bind('change', __bind(function() {
        return this.setActiveDate(this.parseDate(this.input.val()));
      }, this));
      this.input.bind('click', __bind(function() {
        if (!$("." + lw_dp_class).has(this.wrapper).length) {
          return this.show();
        }
      }, this));
      this.isIE = $.browser.msie && parseInt($.browser.version, 10) <= 8;
      this.input.data(lw_dp_data_key, true);
      this.settings = {
        startDate: settings['startDate'],
        endDate: settings['endDate'],
        dowNames: settings['dowNames'],
        monthNames: settings['monthNames'],
        firstDayOfTheWeekIndex: settings['firstDayOfTheWeekIndex'],
        autoFillToday: settings['autoFillToday'],
        alwaysVisible: settings['alwaysVisible'],
        autoHideAfterClick: settings['autoHideAfterClick'],
        parseDate: settings['parseDate'],
        formatDate: settings['formatDate'],
        onChange: settings['onChange']
      };
      if (this.settings.autoFillToday) {
        this.activeDate = new Date;
      }
      this.todayDate = new Date;
      this.currentDate = new Date;
      this.createDatepicker();
      if (this.settings.alwaysVisible) {
        this.wrapper.insertAfter(this.input);
      } else {
        this.wrapper.appendTo(document.body);
      }
      this.margin = parseInt(this.wrapper.css('margin-top'), 10);
      this.wrapper.css('margin', 0);
      this.bindEvents();
      if (this.settings.alwaysVisible) {
        this.updatePosition();
      }
      this.updateInput();
      this.updateMonth();
      this.hide();
    }
    LightweightDatepicker.prototype.createDatepicker = function() {
      this.wrapper = $("<div class=" + lw_dp_class + "/>");
      this.toolbar = $("<div class=" + lw_dp_toolbar_class + "/>").appendTo(this.wrapper);
      this.previous = $("<div class=" + lw_dp_previous_class + ">◄</div>").appendTo(this.toolbar);
      this.next = $("<div class=" + lw_dp_next_class + ">►</div>").appendTo(this.toolbar);
      this.month = $("<div class=" + lw_dp_month_class + "/>").appendTo(this.toolbar);
      this.renderDows().appendTo(this.wrapper);
      return this.days = $('<div/>').appendTo(this.wrapper);
    };
    LightweightDatepicker.prototype.bindEvents = function() {
      var event;
      this.wrapper.bind('mousedown', __bind(function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.isIE) {
          return this.shouldHide = false;
        }
      }, this));
      event = this.isIE ? 'mousedown' : 'click';
      this.toolbar.delegate("." + lw_dp_next_class, event, this.showNextMonth);
      this.toolbar.delegate("." + lw_dp_previous_class, event, this.showPreviousMonth);
      return this.days.delegate("li:not(." + lw_dp_active_day_class + ")", event, __bind(function(e) {
        var currentLi;
        currentLi = $(e.currentTarget);
        this.setActiveDate(this.getDateFromElement(currentLi));
        if (this.settings.autoHideAfterClick) {
          this.hide();
        }
        if (typeof this.settings.onChange === 'function') {
          this.settings.onChange(this.activeDate);
        }
        return false;
      }, this));
    };
    LightweightDatepicker.prototype.getDateFromElement = function(el) {
      var currentDay, currentMonth, currentYear, diff;
      currentDay = el.text();
      currentYear = this.currentDate.getFullYear();
      diff = 0;
      if (el.hasClass(lw_dp_neighbour_month_day_class)) {
        diff = currentDay > 10 ? -1 : 1;
      }
      currentMonth = this.currentDate.getMonth() + diff;
      return new Date(currentYear, currentMonth, currentDay);
    };
    LightweightDatepicker.prototype.updateInput = function() {
      return this.input.val(this.formatDate(this.activeDate));
    };
    LightweightDatepicker.prototype.updateMonth = function() {
      var cd, date, day, daysInFirstWeek, daysInMonth, daysInPreviousMonth, firstDayDow, firstDayOfNextMonth, html, lastDayOfPreviousMonth, lastDowIndex, renderDay, week, weeks;
      this.month.html(this.settings.monthNames[this.currentDate.getMonth()] + ', ' + this.currentDate.getFullYear());
      cd = this.currentDate;
      lastDayOfPreviousMonth = new Date(cd.getFullYear(), cd.getMonth(), 0);
      if ((this.settings.startDate != null) && lastDayOfPreviousMonth.getTime() < this.settings.startDate.getTime()) {
        this.canShowPreviousMonth = false;
        $(this.previous).hide();
      } else {
        this.canShowPreviousMonth = true;
        $(this.previous).show();
      }
      firstDayOfNextMonth = new Date(cd.getFullYear(), cd.getMonth() + 1, 1);
      if ((this.settings.endDate != null) && firstDayOfNextMonth.getTime() > this.settings.endDate.getTime()) {
        this.canShowNextMonth = false;
        $(this.next).hide();
      } else {
        this.canShowNextMonth = true;
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
          classes.push(lw_dp_neighbour_month_day_class);
        }
        if (day.getDay() === 0 || day.getDay() === 6) {
          classes.push(lw_dp_weekend_class);
        }
        if (day.getDay() === lastDowIndex) {
          classes.push(lw_dp_week_last_column_class);
        }
        if (compareDates(day, this.todayDate) === 0) {
          classes.push(lw_dp_today_class);
          liContent = "<span>" + liContent + "</span>";
        }
        if ((this.activeDate != null) && compareDates(day, this.activeDate) === 0) {
          classes.push(lw_dp_active_day_class);
        }
        if (!this.isDateInsidePeriod(date)) {
          classes.push(lw_dp_out_of_interval_class);
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
          html += "<ul class='" + lw_dp_week_class + " " + lw_dp_firstweek_class + "'>";
        } else if (week === weeks) {
          html += "<ul class='" + lw_dp_week_class + " " + lw_dp_lastweek_class + "'>";
        } else {
          html += "<ul class=" + lw_dp_week_class + ">";
        }
        for (day = 1; day <= 7; day++) {
          html += renderDay(date);
        }
        html += '</ul>';
      }
      return this.days.html(html);
    };
    LightweightDatepicker.prototype.setActiveDate = function(date) {
      var activeLi, oldDate;
      if (!isDateValid(date)) {
        return false;
      }
      if (!this.isDateInsidePeriod(date)) {
        return false;
      }
      oldDate = this.activeDate;
      this.activeDate = date;
      this.setCurrentDate(date);
      this.updateInput();
      if ((oldDate != null) && (date.getFullYear() === oldDate.getFullYear() && date.getMonth() === oldDate.getMonth())) {
        this.days.find("li." + lw_dp_active_day_class).removeClass(lw_dp_active_day_class);
        activeLi = this.days.find("li:not(." + lw_dp_neighbour_month_day_class + ")").filter(function() {
          return parseInt($(this).text(), 10) === date.getDate();
        });
        return activeLi.addClass(lw_dp_active_day_class);
      }
    };
    LightweightDatepicker.prototype.setCurrentDate = function(date) {
      this.currentDate = date;
      return this.updateMonth();
    };
    LightweightDatepicker.prototype.isDateInsidePeriod = function(date) {
      if ((this.settings.startDate != null) && (compareDates(date, this.settings.startDate) === -1)) {
        return false;
      }
      if ((this.settings.endDate != null) && (compareDates(date, this.settings.endDate) === 1)) {
        return false;
      }
      return true;
    };
    LightweightDatepicker.prototype.parseDate = function(string) {
      if (typeof this.settings.parseDate === 'function') {
        return this.settings.parseDate(string);
      } else {
        return new Date(Date.parse(string));
      }
    };
    LightweightDatepicker.prototype.formatDate = function(date) {
      if (!isDateValid(date)) {
        return;
      }
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
    LightweightDatepicker.prototype.renderDows = function() {
      var day, first, found, html, name, temp, _i, _len, _ref;
      first = this.settings.dowNames[this.settings.firstDayOfTheWeekIndex];
      found = false;
      html = "<ul class=" + lw_dp_dows_class + ">";
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
    LightweightDatepicker.prototype.updatePosition = function() {
      var inputOffset, left, top, wrapperOuterHeight, wrapperOuterWidth;
      if (this.settings.alwaysVisible) {
        inputOffset = this.input.position();
      } else {
        inputOffset = this.input.offset();
      }
      wrapperOuterWidth = this.wrapper.outerWidth();
      wrapperOuterHeight = this.wrapper.outerHeight();
      left = inputOffset.left;
      if ($('body').width() > left + wrapperOuterWidth) {
        this.wrapper.css({
          'left': left
        });
      } else {
        if (inputOffset.left > wrapperOuterWidth + this.margin) {
          this.wrapper.css({
            'left': inputOffset.left - wrapperOuterWidth - this.margin
          });
        } else {
          this.wrapper.css({
            'left': left
          });
        }
      }
      top = inputOffset.top + this.input.outerHeight() + this.margin;
      if ($(document).height() > top + wrapperOuterHeight) {
        return this.wrapper.css({
          'top': top
        });
      } else {
        if (inputOffset.top > wrapperOuterHeight + this.margin) {
          return this.wrapper.css({
            'top': inputOffset.top - wrapperOuterHeight - this.margin
          });
        } else {
          return this.wrapper.css({
            'top': top
          });
        }
      }
    };
    LightweightDatepicker.prototype.hide = function() {
      var _ref;
      if (!this.settings.alwaysVisible && this.shouldHide) {
        this.wrapper.detach();
      }
      if (!this.shouldHide) {
        if ((_ref = this.input) != null) {
          _ref.focus();
        }
      }
      return this.shouldHide = true;
    };
    LightweightDatepicker.prototype.show = function() {
      if (!this.settings.alwaysVisible) {
        this.wrapper.appendTo(document.body);
      }
      this.updatePosition();
      return this.updateMonth();
    };
    LightweightDatepicker.prototype.showPreviousMonth = function() {
      return this.setCurrentDate(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, this.currentDate.getDate()));
    };
    LightweightDatepicker.prototype.showNextMonth = function() {
      return this.setCurrentDate(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate()));
    };
    LightweightDatepicker.prototype.handleKeyDown = function(e) {
      var handled, keyCode, newDate;
      keyCode = e.keyCode;
      handled = true;
      switch (keyCode) {
        case 27:
          this.input.blur();
          break;
        case 33:
          newDate = new Date(this.activeDate.getFullYear(), this.activeDate.getMonth() - 1, this.activeDate.getDate());
          while (newDate.getMonth() === this.activeDate.getMonth()) {
            newDate.setDate(newDate.getDate() - 1);
          }
          this.setActiveDate(newDate);
          break;
        case 34:
          newDate = new Date(this.activeDate.getFullYear(), this.activeDate.getMonth() + 1, this.activeDate.getDate());
          while (newDate.getMonth() === this.activeDate.getMonth() + 2) {
            newDate.setDate(newDate.getDate() - 1);
          }
          this.setActiveDate(newDate);
          break;
        case 38:
          this.setActiveDate(new Date(this.activeDate.getFullYear(), this.activeDate.getMonth(), this.activeDate.getDate() - 1));
          break;
        case 40:
          this.setActiveDate(new Date(this.activeDate.getFullYear(), this.activeDate.getMonth(), this.activeDate.getDate() + 1));
          break;
        default:
          handled = false;
      }
      return !handled;
    };
    return LightweightDatepicker;
  })();
  $.fn['lwDatepicker'] = function(options) {
    options = $.extend({}, settings, options);
    return this.each(function() {
      var $el;
      $el = $(this);
      if (($el.is('input, textarea')) && !$el.data(lw_dp_data_key)) {
        return new LightweightDatepicker($el, options);
      }
    });
  };
}).call(this);
