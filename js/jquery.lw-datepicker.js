(function() {
  var $, LightweightDatepicker, dowNames, monthNames, settings;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $ = jQuery;
  dowNames = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  settings = {
    multiple: false,
    firstDayOfTheWeek: 'mon',
    dateFormat: 'yyyy.mm.dd'
  };
  LightweightDatepicker = (function() {
    LightweightDatepicker.prototype.currentDate = new Date;
    function LightweightDatepicker(settings) {
      this.settings = settings;
      this.wrapper = $('<div class="lw-dp"/>');
      this.toolbar = $('<div class="lw-dp-toolbar"/>').appendTo(this.wrapper);
      this.previous = $('<div class="lw-dp-previous">◄</div>').appendTo(this.toolbar);
      this.next = $('<div class="lw-dp-next">►</div>').appendTo(this.toolbar);
      this.month = $('<div class="lw-dp-month"/>').appendTo(this.toolbar);
      this.days = $('<div />').appendTo(this.wrapper);
      this.next.bind('click', __bind(function() {
        return this.onNextClick();
      }, this));
      this.previous.bind('click', __bind(function() {
        return this.onPreviousClick();
      }, this));
      this.renderDows().appendTo(this.wrapper);
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
      if (diff == null) {
        diff = 0;
      }
      this.currentDate.setMonth(this.currentDate.getMonth() + diff);
      return this.month.html(monthNames[this.currentDate.getMonth()] + ', ' + this.currentDate.getFullYear());
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
