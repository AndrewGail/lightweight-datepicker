(function() {
  var $;
  $ = jQuery;
  $.fn.extend({
    lwDatepicker: function(options) {
      var settings;
      settings = {
        firstDayOfTheWeek: 'mon',
        multiple: false,
        dateFormat: 'yyyy.mm.dd'
      };
      settings = $.extend(settings, options);
      return this.each(function() {
        return log("Preparing magic show.");
      });
    }
  });
}).call(this);
