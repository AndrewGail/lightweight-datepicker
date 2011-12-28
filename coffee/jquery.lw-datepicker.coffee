###!
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
 ###

# References jQuery
$ = jQuery

settings = 
  # Sets start date
  'startDate': null
  # Sets end date
  'endDate': null
  # Sets names for days of the week
  'dowNames': ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  # Sets names of months
  'monthNames': ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']
  # Sets first day of the week starting with Sunday (in 0-based index)
  'firstDayOfTheWeekIndex': 0
  # Sets whether auto fill empty input with today value
  'autoFillToday': false
  # Sets whether datepicker stay visible after input field loses focus
  'alwaysVisible': false
  # Sets whether datepicker hides after day selection with a mouse
  'autoHideAfterClick': false
  # Holds optional user function for parsing typed date
  'parseDate': null
  # Holds optional user function for formatting selected date
  'formatDate': null
  # Holds optional user function called after active date changed
  'onChange': null

# Classes
lw_dp_class = 'lw-dp'
lw_dp_active_day_class = 'lw-dp-active-day'
lw_dp_dows_class = 'lw-dp-dows'
lw_dp_dows_last_column_class = 'lw-dp-dows-last-column'
lw_dp_firstweek_class = 'lw-dp-firstweek'
lw_dp_hidden_class = 'lw-dp-hidden'
lw_dp_lastweek_class = 'lw-dp-lastweek'
lw_dp_month_class = 'lw-dp-month'
lw_dp_neighbour_month_day_class = 'lw-dp-neighbour-month-day'
lw_dp_next_class = 'lw-dp-next'
lw_dp_out_of_interval_class = 'lw-dp-out-of-interval'
lw_dp_previous_class = 'lw-dp-previous'
lw_dp_today_class = 'lw-dp-today'
lw_dp_toolbar_class = 'lw-dp-toolbar'
lw_dp_week_class = 'lw-dp-week'
lw_dp_week_last_column_class = 'lw-dp-week-last-column'
lw_dp_weekend_class = 'lw-dp-weekend'

# Other constants
lw_dp_data_key = 'lw-datepicker'

# Checks whether two dates are equal to each other
compareDates = (date1, date2) ->
  return -1 if date1.getFullYear() < date2.getFullYear()
  return 1 if date1.getFullYear() > date2.getFullYear()
  return -1 if date1.getMonth() < date2.getMonth()
  return 1 if date1.getMonth() > date2.getMonth()
  return -1 if date1.getDate() < date2.getDate()
  return 1 if date1.getDate() > date2.getDate()
  return 0

# Checks whether date is valid
isDateValid = (date) ->
  if Object.prototype.toString.call(date) isnt '[object Date]'
    return false;    
  return not isNaN(date.getTime())    

# Class constructor
class LightweightDatepicker

  # Define flags that determine month arrow visibility
  canShowPreviousMonth: true
  canShowNextMonth: true

  # Needed for handle IE6-8 bug with input field focus lose
  shouldHide: true

  constructor: (el, settings) ->
    # Saves binded input
    @input = el

    # Input events
    @input.bind 'focus', @show
    @input.bind 'blur', @hide
    @input.bind 'keydown', @_handleKeyDown
    @input.bind 'change', () =>
      @setActiveDate @_parseDate @input.val()
    @input.bind 'click', () =>
      if not $(".#{lw_dp_class}").has(@wrapper).length
        @show()

    # Determines if it's Internet Explorer 7 or older
    @isIE = $.browser.msie and parseInt($.browser.version, 10) <= 8

    # Necessary for prevent binding two or more datepickers to one input
    @input.data lw_dp_data_key, @

    # Saves settings
    # Manually assigning values for better file size optimization
    @settings =
      startDate: settings['startDate']
      endDate: settings['endDate']
      dowNames: settings['dowNames']
      monthNames: settings['monthNames']
      firstDayOfTheWeekIndex: settings['firstDayOfTheWeekIndex']
      autoFillToday: settings['autoFillToday']
      alwaysVisible: settings['alwaysVisible']
      autoHideAfterClick: settings['autoHideAfterClick']
      parseDate: settings['parseDate']
      formatDate: settings['formatDate']
      onChange: settings['onChange']

    if @settings.autoFillToday then @activeDate = new Date
    @todayDate = new Date
    @currentDate = new Date
    # @currentDate = new Date 2021, 1, 1 # February 2021 takes 4 rows
    # @currentDate = new Date 2012, 0, 1 # January 2012 takes 6 rows

    @_createDatepicker()
    if @settings.alwaysVisible
      @wrapper.insertAfter @input
    else
      @wrapper.appendTo document.body

    # We will manage margin programmatically for correct datepicker placement
    @margin = parseInt @wrapper.css('margin-top'), 10
    @wrapper.css 'margin', 0

    @_bindEvents()

    if @settings.alwaysVisible then @updatePosition()
    @updateInput()
    @_updateMonth()
    @hide()

  # Creates necessary markup
  _createDatepicker: ->
    @wrapper = $ "<div class=#{lw_dp_class}/>"
    @toolbar = $("<div class=#{lw_dp_toolbar_class}/>").appendTo @wrapper
    @previous = $("<div class=#{lw_dp_previous_class}>◄</div>").appendTo @toolbar
    @next = $("<div class=#{lw_dp_next_class}>►</div>").appendTo @toolbar
    @month = $("<div class=#{lw_dp_month_class}/>").appendTo @toolbar
    @_renderDows().appendTo @wrapper
    @days = $('<div/>').appendTo @wrapper

  # Binds events
  _bindEvents: ->
    @wrapper.bind 'mousedown touchstart', (e) =>
      e.preventDefault()
      e.stopPropagation()
      if @isIE then @shouldHide = false

      # Datepicker events
    event = if @isIE then 'mousedown' else 'click touchstart'
    @toolbar.delegate ".#{lw_dp_next_class}", event, @showNextMonth
    @toolbar.delegate ".#{lw_dp_previous_class}", event, @showPreviousMonth
    @days.delegate "li:not(.#{lw_dp_active_day_class})", event, (e) =>
      currentLi = $(e.currentTarget)      
      @setActiveDate @_getDateFromElement currentLi

      if @settings.autoHideAfterClick then @hide()        

      # Calls optional user's onChange function
      if typeof @settings.onChange is 'function'
        @settings.onChange @activeDate, @input

      false

  # Constructs Date object corresponds selected element
  _getDateFromElement: (el) =>
    currentDay = el.text()
    currentYear = @currentDate.getFullYear()
      
    # When user clicks on a day of a neighbour month we need do calculate
    # if it is a previous or a next month. Since we show maximum of 6 days
    # of a neighbour month we can be reasonably sure that if the day inside
    # that cell is less then 10 than its a next month.
    diff = 0
    if el.hasClass(lw_dp_neighbour_month_day_class)
      diff = if currentDay > 10 then -1 else 1
    currentMonth = @currentDate.getMonth() + diff
    
    return new Date currentYear, currentMonth, currentDay

  # Changes value of binded input to active date
  updateInput: ->
    @input.val @_formatDate @activeDate

  # Renders current month
  _updateMonth: =>
    # Updates month name and year
    @month.html @settings.monthNames[@currentDate.getMonth()] + ', ' + @currentDate.getFullYear()

    # Updates dates
    cd = @currentDate

    # Enables or disables selectors of previous and next months
    lastDayOfPreviousMonth = new Date cd.getFullYear(), cd.getMonth(), 0
    if @settings.startDate? and lastDayOfPreviousMonth.getTime() < @settings.startDate.getTime()
      @canShowPreviousMonth = false
      $(@previous).hide()
    else
      @canShowPreviousMonth = true
      $(@previous).show()
    
    firstDayOfNextMonth = new Date cd.getFullYear(), cd.getMonth()+1, 1
    if @settings.endDate? and firstDayOfNextMonth.getTime() > @settings.endDate.getTime()
      @canShowNextMonth = false
      $(@next).hide()
    else
      @canShowNextMonth = true
      $(@next).show()

    firstDayDow = (new Date cd.getFullYear(), cd.getMonth(), 1).getDay()
    lastDowIndex = (@settings.firstDayOfTheWeekIndex + 6) % 7
    
    daysInFirstWeek = (7 - firstDayDow + @settings.firstDayOfTheWeekIndex) % 7
    if daysInFirstWeek is 0 then daysInFirstWeek = 7
    
    daysInPreviousMonth = lastDayOfPreviousMonth.getDate()
    date = new Date cd.getFullYear(), cd.getMonth(), daysInFirstWeek - 6
    
    daysInMonth = (new Date cd.getFullYear(), cd.getMonth() + 1, 0).getDate()
    weeks = Math.ceil (daysInMonth + 7 - daysInFirstWeek) / 7.0

    # Renders a day with all necessary classes
    renderDay = (day) =>
      classes = []
      classAttribute = ''

      liContent = day.getDate()

      # Handles days of previous and next month
      if day.getMonth() isnt cd.getMonth()
        classes.push lw_dp_neighbour_month_day_class
      
      # Handles weekends
      if day.getDay() is 0 or day.getDay() is 6 # weekends
        classes.push lw_dp_weekend_class
      
      # Handles right borders
      if day.getDay() is lastDowIndex
        classes.push lw_dp_week_last_column_class

      # Handles today
      if compareDates(day, @todayDate) is 0
        classes.push lw_dp_today_class
        liContent = """<span>#{liContent}</span>"""

      # Handles active day
      if @activeDate? and compareDates(day, @activeDate) == 0
        classes.push lw_dp_active_day_class

      # Handles date interval borders
      if not @_isDateInsidePeriod date
        classes.push lw_dp_out_of_interval_class
        liContent = ''

      if classes.length
        classAttribute = " class='#{classes.join " "}'"
      
      day.setDate day.getDate() + 1

      """<li#{classAttribute}>#{liContent}</li>"""

    html = ''

    for week in [1..weeks]
      if week is 1 # First week
        html += "<ul class='#{lw_dp_week_class} #{lw_dp_firstweek_class}'>"
      else if week is weeks # Last week
        html += "<ul class='#{lw_dp_week_class} #{lw_dp_lastweek_class}'>"
      else # Common week
        html += "<ul class=#{lw_dp_week_class}>"
      for day in [1..7]
        html += renderDay date
      html += '</ul>'    

    @days.html html

  # Sets active date
  setActiveDate: (date) =>
    # Check if date is valid
    if not isDateValid date
      return false

    # Check if date is inside the permitted period
    if not @_isDateInsidePeriod date
      return false

    # Saves previous active date
    oldDate = @activeDate
    # Sets active date
    @activeDate = date
    # Sets current date
    @setCurrentDate date

    # Updates input's value
    @updateInput()

    # Check if selected day's month differs from the current one
    if oldDate? and (date.getFullYear() is oldDate.getFullYear() and date.getMonth() is oldDate.getMonth())
      @days.find("li.#{lw_dp_active_day_class}").removeClass lw_dp_active_day_class
      activeLi = @days.find("li:not(.#{lw_dp_neighbour_month_day_class})").filter ->
        parseInt($(@).text(), 10) is date.getDate()
      activeLi.addClass lw_dp_active_day_class

  # Sets current date and redraws datepicker
  setCurrentDate: (date) =>
    @currentDate = date
    @_updateMonth()

  # Check if date is inside the permitted period
  _isDateInsidePeriod: (date) =>
    if @settings.startDate? and (compareDates(date, @settings.startDate) is -1)
      return false
    if @settings.endDate? and (compareDates(date, @settings.endDate) is 1)
      return false
    return true
   
  # Parses string to Date object
  _parseDate: (string) ->
    if typeof @settings.parseDate is 'function'
      @settings.parseDate string
    else
      new Date (Date.parse string)

  # Formats date as text
  _formatDate: (date) ->
    if not isDateValid date
      return
    if typeof @settings.formatDate is 'function'
      @settings.formatDate date
    else
      if date?
      # By default in USA format: M/d/yyyy
        (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear()
      else
        ''

  # Renders names of days of the week
  _renderDows: ->
    first = @settings.dowNames[@settings.firstDayOfTheWeekIndex]
    found = false
    html = "<ul class=#{lw_dp_dows_class}>"
    temp = ''
    for name in @settings.dowNames
      if name is first then found = true
      day = "<li>#{name}</li>"
      if found then html += day else temp += day
    html += temp
    html += '</ul>'
    $ html # Creates jQuery object from html code

  # Calculates and sets position of datepicker
  updatePosition: ->
    if @settings.alwaysVisible
      inputOffset = @input.position()
    else
      inputOffset = @input.offset()
    wrapperOuterWidth = @wrapper.outerWidth()
    wrapperOuterHeight = @wrapper.outerHeight()

    # Horizontal position
    left = inputOffset.left
    if $('body').width() > left + wrapperOuterWidth
      @wrapper.css 'left': left
    else
      if inputOffset.left > wrapperOuterWidth + @margin
        @wrapper.css 'left': $('body').width() - wrapperOuterWidth + @margin
      else
        @wrapper.css 'left': left

    # Vertical position
    @wrapper.removeClass 'lw-dp-opposite-vertical'
    top = inputOffset.top + @input.outerHeight() + @margin
    if $(document).height() > top + wrapperOuterHeight
      @wrapper.css 'top': top
    else
      if inputOffset.top > wrapperOuterHeight + @margin
        @wrapper.css 'top': inputOffset.top - wrapperOuterHeight - @margin
        @wrapper.addClass 'lw-dp-opposite-vertical'
      else
        @wrapper.css 'top': top

  # Hides daypicker
  hide: =>
    if not @settings.alwaysVisible and @shouldHide
      @wrapper.detach()
    if not @shouldHide
      @input?.focus()
    @shouldHide = true

  # Shows daypicker
  show: =>
    if not @settings.alwaysVisible
      @wrapper.appendTo document.body
    @updatePosition()
    @_updateMonth()

  # Shows previous month
  showPreviousMonth: =>
    @setCurrentDate new Date(@currentDate.getFullYear(), @currentDate.getMonth()-1, @currentDate.getDate())

  # Shows next month
  showNextMonth: =>
    @setCurrentDate new Date(@currentDate.getFullYear(), @currentDate.getMonth()+1, @currentDate.getDate())

 # Handles keyboard-navigation
  _handleKeyDown: (e) =>
    keyCode = e.keyCode
    handled = true
    switch keyCode
      when 27 # Esc
        # @hide()
        @input.blur()
      when 33 # PgUp
        # Selects the same day of the previous month
        newDate = new Date @activeDate.getFullYear(), @activeDate.getMonth()-1, @activeDate.getDate()
        # If the previous month is shorter, selects its last day
        while newDate.getMonth() is @activeDate.getMonth()
          newDate.setDate newDate.getDate() - 1
        @setActiveDate newDate
      when 34 # PgDown
        # Selects the same day of next month
        newDate = new Date(@activeDate.getFullYear(), @activeDate.getMonth()+1, @activeDate.getDate())
        # If the next month is shorter, selects its last day
        while newDate.getMonth() is @activeDate.getMonth() + 2
          newDate.setDate newDate.getDate() - 1
        @setActiveDate newDate
      when 38 # Up
        # Selects previous day
        @setActiveDate new Date(@activeDate.getFullYear(), @activeDate.getMonth(), @activeDate.getDate() - 1)
      when 40 # Down
        # Selects next day
        @setActiveDate new Date(@activeDate.getFullYear(), @activeDate.getMonth(), @activeDate.getDate() + 1)
      else
        handled = false
    return not handled

  # Destroys datepicker
  # destroy: =>    

# Adds plugin object to jQuery
$.fn['lwDatepicker'] = (options) ->
  options = $.extend {}, settings, options

  return @each ->
    $el = $(@)
    # Prevents binding to inappropriate elments
    # and binding more than one datepicker to one element.
    if ($el.is 'input, textarea') and not $el.data lw_dp_data_key
      new LightweightDatepicker $el, options
