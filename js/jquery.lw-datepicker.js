(function() {
  var $, LightweightDatepicker, dowNames, monthNames, settings;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $ = jQuery;
  dowNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  settings = {
    multiple: false,
    firstDayOfTheWeek: 'mon',
    dateFormat: 'yyyy.mm.dd'
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
      this.wrapper.appendTo(document.body);
    }
    LightweightDatepicker.prototype.onNextClick = function() {
      return this.updateMonth(1);
    };
    LightweightDatepicker.prototype.onPreviousClick = function() {
      return this.updateMonth(-1);
    };
    LightweightDatepicker.prototype.updateMonth = function(diff) {
      var adjustedFirstDow, cd, day, dayIndex, daysInFirstWeek, daysInPreviousMonth, firstDayDow, html, remainingDays, renderDay, startDatePreviousMonth;
      if (diff == null) {
        diff = 0;
      }
      this.currentDate.setMonth(this.currentDate.getMonth() + diff);
      this.month.html(monthNames[this.currentDate.getMonth()] + ', ' + this.currentDate.getFullYear());
      cd = this.currentDate;
      dayIndex = 0;
      firstDayDow = (new Date(cd.getFullYear(), cd.getMonth(), 1)).getDay();
      adjustedFirstDow = firstDayDow - this.firstDowIndex;
      if (adjustedFirstDow < 0) {
        adjustedFirstDow = 7 + adjustedFirstDow;
      }
      daysInPreviousMonth = (new Date(cd.getFullYear(), cd.getMonth(), 0)).getDate();
      daysInFirstWeek = (7 - firstDayDow + this.firstDowIndex) % 7;
      if (daysInFirstWeek === 0) {
        daysInFirstWeek = 7;
      }
      remainingDays = (new Date(cd.getFullYear(), cd.getMonth() + 1, 0)).getDate();
      remainingDays -= daysInFirstWeek;
      startDatePreviousMonth = daysInPreviousMonth - (6 - daysInFirstWeek);
      renderDay = function(day) {
        var classAttribute, classes, dow;
        classes = [];
        classAttribute = '';
        dow = (dayIndex + firstDayDow) % 7;
        if (dow === 0 || dow === 6) {
          classes.push('lw-dp-weekend');
        }
        if (((dayIndex + adjustedFirstDow) % 7) === 6) {
          classes.push('lw-dp-week-last-column');
        }
        if (classes.length) {
          classAttribute = " class='" + (classes.join(" ")) + "'";
        }
        dayIndex++;
        return "<li" + classAttribute + ">" + day + "</li>";
      };
      html = '<ul class="lw-dp-week lw-dp-firstweek">';
      if (startDatePreviousMonth <= daysInPreviousMonth) {
        for (day = startDatePreviousMonth; startDatePreviousMonth <= daysInPreviousMonth ? day <= daysInPreviousMonth : day >= daysInPreviousMonth; startDatePreviousMonth <= daysInPreviousMonth ? day++ : day--) {
          html += "<li class=\"lw-dp-neighbour-month-day\">" + day + "</li>";
        }
      }
      for (day = 1; 1 <= daysInFirstWeek ? day <= daysInFirstWeek : day >= daysInFirstWeek; 1 <= daysInFirstWeek ? day++ : day--) {
        html += renderDay(day);
      }
      html += '</ul>';
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
