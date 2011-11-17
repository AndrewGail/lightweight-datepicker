(function() {
  var $, LightweightDatepicker, checkEqualDates, dowNames, monthNames, settings;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $ = jQuery;
  dowNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  settings = {
    multiple: false,
    firstDayOfTheWeek: 'mon',
    dateFormat: 'yyyy.mm.dd',
    autoSwitchToNeighbourMonth: false,
    startDate: new Date(2000, 0, 1),
    endDate: new Date(2030, 11, 31)
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
    LightweightDatepicker.prototype.activeDate = null;
    function LightweightDatepicker(settings) {
      var first, name, _i, _len;
      this.settings = settings;
      this.currentDate = new Date;
      this.todayDate = new Date;
      first = this.settings.firstDayOfTheWeek.toLowerCase();
      this.firstDowIndex = 0;
      for (_i = 0, _len = dowNames.length; _i < _len; _i++) {
        name = dowNames[_i];
        if (name === first) {
          break;
        }
        this.firstDowIndex++;
      }
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
        var currentLi, day, diff, month, selectedDate, year;
        currentLi = $(e.currentTarget);
        year = this.currentDate.getFullYear();
        month = this.currentDate.getMonth();
        day = parseInt(currentLi.text());
        diff = 0;
        if (currentLi.hasClass('lw-dp-neighbour-month-day')) {
          diff = day > 10 ? -1 : 1;
        }
        selectedDate = new Date(year, month + diff, day);
        if (selectedDate.getTime() >= this.settings.startDate.getTime()) {
          if (selectedDate.getTime() <= this.settings.endDate.getTime()) {
            currentLi.parent().parent().find('li').removeClass('lw-dp-active-day');
            currentLi.addClass('lw-dp-active-day');
            this.activeDate = selectedDate;
            if (this.settings.autoSwitchToNeighbourMonth && diff !== 0) {
              this.updateMonth(diff);
            }
          }
        }
        return false;
      }, this));
      this.wrapper.appendTo(document.body);
    }
    LightweightDatepicker.prototype.onNextClick = function() {
      return this.updateMonth(1);
    };
    LightweightDatepicker.prototype.onPreviousClick = function() {
      return this.updateMonth(-1);
    };
    LightweightDatepicker.prototype.updateMonth = function(diff) {
      var cd, date, day, daysInFirstWeek, daysInMonth, daysInPreviousMonth, firstDayDow, html, lastDowIndex, renderDay, week, weeks;
      if (diff == null) {
        diff = 0;
      }
      this.currentDate.setMonth(this.currentDate.getMonth() + diff);
      this.month.html(monthNames[this.currentDate.getMonth()] + ', ' + this.currentDate.getFullYear());
      cd = this.currentDate;
      firstDayDow = (new Date(cd.getFullYear(), cd.getMonth(), 1)).getDay();
      lastDowIndex = (this.firstDowIndex + 6) % 7;
      daysInFirstWeek = (7 - firstDayDow + this.firstDowIndex) % 7;
      if (daysInFirstWeek === 0) {
        daysInFirstWeek = 7;
      }
      daysInPreviousMonth = (new Date(cd.getFullYear(), cd.getMonth(), 0)).getDate();
      date = new Date(cd.getFullYear(), cd.getMonth(), daysInFirstWeek - 6);
      daysInMonth = (new Date(cd.getFullYear(), cd.getMonth() + 1, 0)).getDate();
      weeks = Math.ceil((daysInMonth + 6 - daysInFirstWeek) / 7.0);
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
      var day, first, found, html, name, temp, _i, _len;
      first = this.settings.firstDayOfTheWeek.toLowerCase();
      found = false;
      html = '<ul class="lw-dp-dows">';
      temp = '';
      for (_i = 0, _len = dowNames.length; _i < _len; _i++) {
        name = dowNames[_i];
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
    return LightweightDatepicker;
  })();
  $.fn.lwDatepicker = function(options) {
    var picker;
    options = $.extend(settings, options);
    picker = new LightweightDatepicker(options);
    return this.each(function() {});
  };
}).call(this);
