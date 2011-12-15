###!
 * Lightweight DatePicker - jQuery Plugin
 * Provides themeable and customizable date picker
 *
 * © 2011 Maxim Zhukov (zhkv.mxm@gmail.com)
 * 
 * Version: 1.0+
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
LW_DP_CLASS = 'lw-dp'
LW_DP_ACTIVE_DAY_CLASS = 'lw-dp-active-day'
LW_DP_DOWS_CLASS = 'lw-dp-dows'
LW_DP_DOWS_LAST_COLUMN_CLASS = 'lw-dp-dows-last-column'
LW_DP_FIRSTWEEK_CLASS = 'lw-dp-firstweek'
LW_DP_HIDDEN_CLASS = 'lw-dp-hidden'
LW_DP_LASTWEEK_CLASS = 'lw-dp-lastweek'
LW_DP_MONTH_CLASS = 'lw-dp-month'
LW_DP_NEIGHBOUR_MONTH_DAY_CLASS = 'lw-dp-neighbour-month-day'
LW_DP_NEXT_CLASS = 'lw-dp-next'
LW_DP_OUT_OF_INTERVAL_CLASS = 'lw-dp-out-of-interval'
LW_DP_PREVIOUS_CLASS = 'lw-dp-previous'
LW_DP_TODAY_CLASS = 'lw-dp-today'
LW_DP_TOOLBAR_CLASS = 'lw-dp-toolbar'
LW_DP_WEEK_CLASS = 'lw-dp-week'
LW_DP_WEEK_LAST_COLUMN_CLASS = 'lw-dp-week-last-column'
LW_DP_WEEKEND_CLASS = 'lw-dp-weekend'

# Other constants
LW_DP_DATA_KEY = 'lw-datepicker'

# Checks whether two dates are equal to each other
checkEqualDates = (date1, date2) ->
  return false if date1.getFullYear() isnt date2.getFullYear()
  return false if date1.getMonth() isnt date2.getMonth() 
  date1.getDate() is date2.getDate()

# Class constructor
class LightweightDatepicker

  input: null
  activeDate: null
  canSelectPreviousMonth: true
  canSelectNextMonth: true

  # Needed for handle IE6-8 bug with input field focus lose
  shouldHide: true

  constructor: (el, settings) ->
    # Saves binded input
    @input = el

    # Input events
    @input.bind 'focus', @show
    @input.bind 'blur', @hide
    @input.bind 'keydown', @handleKeyDown
    @input.bind 'change', @onChange

    # Determines if it's Internet Explorer 7 or older
    @isIE = $.browser.msie and parseInt($.browser.version) <= 8

    # Necessary for prevent binding two or more datepickers to one input
    @input.data LW_DP_DATA_KEY, true

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

    @activeDate = new Date
    @todayDate = new Date
    @currentDate = new Date
    # @currentDate = new Date 2021, 1, 1 # February 2021 takes 4 rows
    # @currentDate = new Date 2012, 0, 1 # January 2012 takes 6 rows

    @createDatepicker()
    @wrapper.appendTo document.body

    # We will manage margin programmatically for correct datepicker placement
    @margin = parseInt @wrapper.css('margin-top'), 10
    @wrapper.css 'margin', 0

    @bindEvents()

    if @settings.alwaysVisible then @updatePosition()
    @updateInput()
    @updateMonth()
    @hide()

  # Creates necessary markup
  createDatepicker: ->
    @wrapper = $ "<div class=#{LW_DP_CLASS}/>"
    @toolbar = $("<div class=#{LW_DP_TOOLBAR_CLASS}/>").appendTo @wrapper
    @previous = $("<div class=#{LW_DP_PREVIOUS_CLASS}>◄</div>").appendTo @toolbar
    @next = $("<div class=#{LW_DP_NEXT_CLASS}>►</div>").appendTo @toolbar
    @month = $("<div class=#{LW_DP_MONTH_CLASS}/>").appendTo @toolbar
    @renderDows().appendTo @wrapper
    @days = $('<div/>').appendTo @wrapper

  # Binds events
  bindEvents: ->
    @wrapper.bind 'mousedown', (e) =>
      e.preventDefault()
      e.stopPropagation()
      if @isIE then @shouldHide = false

    # Datepicker events
    event = if @isIE then 'mousedown' else 'click'
    @wrapper.delegate ".#{LW_DP_NEXT_CLASS}", event, @onNextClick
    @wrapper.delegate ".#{LW_DP_PREVIOUS_CLASS}", event, @onPreviousClick
    $(@days).delegate "li:not(.#{LW_DP_ACTIVE_DAY_CLASS})", event, (e) =>
      currentLi = $(e.currentTarget)
      @selectDay currentLi

  # Changes value of binded input to active date
  updateInput: ->
    @input.val @formatDate @activeDate

  # Renders month
  updateMonth: (diff = 0) =>
    @currentDate.setMonth @currentDate.getMonth() + diff
    
    # Updates month name and year
    @month.html @settings.monthNames[@currentDate.getMonth()] + ', ' + @currentDate.getFullYear()

    # Updates dates
    cd = @currentDate

    # Enables or disables selectors of previous and next months
    lastDayOfPreviousMonth = new Date cd.getFullYear(), cd.getMonth(), 0
    if @settings.startDate? and lastDayOfPreviousMonth.getTime() < @settings.startDate.getTime()
      @canSelectPreviousMonth = false
      $(@previous).hide()
    else
      @canSelectPreviousMonth = true
      $(@previous).show()
    
    firstDayOfNextMonth = new Date cd.getFullYear(), cd.getMonth()+1, 1
    if @settings.endDate? and firstDayOfNextMonth.getTime() > @settings.endDate.getTime()
      @canSelectNextMonth = false
      $(@next).hide()
    else
      @canSelectNextMonth = true
      $(@next).show()

    firstDayDow = (new Date cd.getFullYear(), cd.getMonth(), 1).getDay()
    lastDowIndex = (@settings.firstDayOfTheWeekIndex + 6) % 7
    
    daysInFirstWeek = (7 - firstDayDow + @settings.firstDayOfTheWeekIndex) % 7
    if daysInFirstWeek is 0 then daysInFirstWeek = 7
    
    daysInPreviousMonth = lastDayOfPreviousMonth.getDate()
    date = new Date cd.getFullYear(), cd.getMonth(), daysInFirstWeek - 6
    
    daysInMonth = (new Date cd.getFullYear(), cd.getMonth() + 1, 0).getDate()
    weeks = Math.ceil (daysInMonth + 7 - daysInFirstWeek) / 7.0

    # Renders day with all necessary classes
    renderDay = (day) =>
      classes = []
      classAttribute = ''

      liContent = day.getDate()

      # Handles days of previous and next month
      if day.getMonth() isnt cd.getMonth()
        classes.push LW_DP_NEIGHBOUR_MONTH_DAY_CLASS
      
      # Handles weekends
      if day.getDay() is 0 or day.getDay() is 6 # weekends
        classes.push LW_DP_WEEKEND_CLASS
      
      # Handles right borders
      if day.getDay() is lastDowIndex
        classes.push LW_DP_WEEK_LAST_COLUMN_CLASS

      # Handles today
      if checkEqualDates day, @todayDate
        classes.push LW_DP_TODAY_CLASS
        liContent = """<span>#{liContent}</span>"""

      # Handles active day
      if @activeDate? and checkEqualDates day, @activeDate
        classes.push LW_DP_ACTIVE_DAY_CLASS

      # Handles date interval borders
      if @settings.startDate and day.getTime() <= @settings.startDate.getTime()
        classes.push LW_DP_OUT_OF_INTERVAL_CLASS
        liContent = ''
      if @settings.endDate and day.getTime() >= @settings.endDate.getTime()
        classes.push LW_DP_OUT_OF_INTERVAL_CLASS
        liContent = ''

      if classes.length
        classAttribute = " class='#{classes.join " "}'"
      
      day.setDate day.getDate() + 1

      """<li#{classAttribute}>#{liContent}</li>"""

    html = ''

    for week in [1..weeks]
      if week is 1 # First week
        html += "<ul class='#{LW_DP_WEEK_CLASS} #{LW_DP_FIRSTWEEK_CLASS}'>"
      else if week is weeks # Last week
        html += "<ul class='#{LW_DP_WEEK_CLASS} #{LW_DP_LASTWEEK_CLASS}'>"
      else # Common week
        html += "<ul class=#{LW_DP_WEEK_CLASS}>"
      for day in [1..7]
        html += renderDay date
      html += '</ul>'    

    @days.html html

  # Changes active day
  selectDay: (currentLi, fromEvent = true) ->
    year = @currentDate.getFullYear()
    month = @currentDate.getMonth()
    day = parseInt currentLi.text()
    diff = 0

    # When user clicks on a day of a neighbour month we need do calculate
    # if it is a previous or a next month. Since we show maximum of 6 days
    # of a neighbour month we can be reasonably sure that if the day inside
    # that cell is less then 10 than its a next month.
    if currentLi.hasClass(LW_DP_NEIGHBOUR_MONTH_DAY_CLASS)
      diff = if day > 10 then -1 else 1

    selectedDate = new Date year, month + diff, day
      
    if not @settings.startDate? or selectedDate.getTime() >= @settings.startDate.getTime()
      if not @settings.endDate? or selectedDate.getTime() <= @settings.endDate.getTime()
        currentLi.parent().parent().find('li').removeClass LW_DP_ACTIVE_DAY_CLASS
        currentLi.addClass LW_DP_ACTIVE_DAY_CLASS
        @activeDate = selectedDate
        if diff isnt 0 then @updateMonth diff  

    @updateInput()

    if @settings.autoHideAfterClick and fromEvent
      @input?.blur()

    if typeof @settings.onChange is 'function'
      @settings.onChange @activeDate  

 
  # Parses string to Date object
  parseDate: (string) ->
    if typeof @settings.parseDate is 'function'
      @settings.parseDate string
    else
      new Date (Date.parse string)

  # Formats date as text
  formatDate: (date) ->
    if typeof @settings.formatDate is 'function'
      @settings.formatDate date
    else
      if date?
      # By default in USA format: M/d/yyyy
        (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear()
      else
        ''

  # Shows next month
  onNextClick: =>
    @updateMonth 1

  # Shows previous month
  onPreviousClick: =>
    @updateMonth -1

  # Renders names of days of the week
  renderDows: ->
    first = @settings.dowNames[@settings.firstDayOfTheWeekIndex]
    found = false
    html = "<ul class=#{LW_DP_DOWS_CLASS}>"
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
    inputOffset = @input.offset()    
    wrapperOuterWidth = @wrapper.outerWidth()
    wrapperOuterHeight = @wrapper.outerHeight()

    # Horizontal position
    left = inputOffset.left
    if $('body').width() > left + wrapperOuterWidth
      @wrapper.css 'left': left
    else
      if inputOffset.left > wrapperOuterWidth + @margin
        @wrapper.css 'left': inputOffset.left - wrapperOuterWidth - @margin
      else
        @wrapper.css 'left': left

    # Vertical position
    top = inputOffset.top + @input.outerHeight() + @margin
    if $(document).height() > top + wrapperOuterHeight
      @wrapper.css 'top': top
    else
      if inputOffset.top > wrapperOuterHeight + @margin
        @wrapper.css 'top': inputOffset.top - wrapperOuterHeight - @margin
      else
        @wrapper.css 'top': top

  # Called after active date changes
  onChange: ->
    @updateMonth()
    @updateInput()

  # Hides day picker
  hide: =>
    if not @settings.alwaysVisible and @shouldHide
      @wrapper.remove()
    if not @shouldHide
      @input?.focus()
    @shouldHide = true

  # Shows day picker
  show: =>
    @wrapper.appendTo document.body
    @bindEvents()
    @updatePosition()
    @updateMonth()
  
  # Selects the same day in changed month
  changeMonth: ->
    if @activeDate?
      activeIndex = @activeDate.getDate() - 1
      activeDate = new Date @activeDate.getTime()
      activeDate.setMonth @currentDate.getMonth()
      activeDate.setFullYear @currentDate.getFullYear()
      days = $(@days).find "li:not(.#{LW_DP_NEIGHBOUR_MONTH_DAY_CLASS})"
      if days.length <= activeIndex
        @selectDay days.last(), false
      else if @settings.endDate? and activeDate.getTime() > @settings.endDate.getTime()
        @selectDay days.eq(@settings.endDate.getDate() - 2), false
      else if @settings.startDate? and activeDate.getTime() < @settings.startDate.getTime()
        @selectDay days.eq(@settings.startDate.getDate()), false
      else
        @selectDay days.eq(activeIndex), false

  # Selects previous or next day
  changeDay: (action) ->
    direction = if action is 'prev' then 'last' else 'first'
    if @activeDate?
      $current = $(@days).find("li.#{LW_DP_ACTIVE_DAY_CLASS}")
      $el = $current[action]()
      if not $el.length 
        $el = $current.parent()[action]().children()[direction]()
    else
      $el = $(@days).find("li.#{LW_DP_TODAY_CLASS}")
    @selectDay $el, false

  # Handles keyboard-navigation
  handleKeyDown: (e) =>
    keyCode = e.keyCode
    handled = true
    switch keyCode
      when 27 # Esc
        # @hide()
        @input.blur()
      when 33 # PgUp
        if @canSelectPreviousMonth
          @onPreviousClick()
          @changeMonth()
      when 34 # PgDown
        if @canSelectNextMonth
          @onNextClick()
          @changeMonth()
      when 38 # Up
        @changeDay 'prev'
      when 40 # Down
        @changeDay 'next'
      else
        handled = false
    return not handled

# Adds plugin object to jQuery
$.fn['lwDatepicker'] = (options) ->
  options = $.extend settings, options

  return @each ->
    $el = $(@)
    # Prevents binding to inappropriate elments
    # and binding more than one datepicker to one element.
    if ($el.is 'input, textarea') and not $el.data LW_DP_DATA_KEY
      new LightweightDatepicker $el, options