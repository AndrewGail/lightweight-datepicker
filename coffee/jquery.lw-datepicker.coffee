# References jQuery
$ = jQuery

# Adds plugin object to jQuery
$.fn.extend {}=
  # Change the pluginName.
  lwDatepicker: (options) ->
    # Default settings
    settings =
      firstDayOfTheWeek: 'mon'
      multiple: false # If true there will be created one for each input
      dateFormat: 'yyyy.mm.dd'

    # Merge default settings with options.
    settings = $.extend settings, options



    # _Insert magic here._
    return @each ()->
      log "Preparing magic show."