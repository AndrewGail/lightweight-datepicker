# References jQuery
$ = jQuery

dowNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

settings = 
  multiple: false
  firstDayOfTheWeek: 'mon'
  dateFormat: 'yyyy.mm.dd'
  autoSwitchToNeighbourMonth: true
  startDate: new Date 2000, 0, 1
  endDate: new Date 2030, 31, 1
  # startDate: new Date 2011, 9, 15
  # endDate: new Date 2011, 11, 15

checkEqualDates = (date1, date2) ->
  return false if date1.getFullYear() isnt date2.getFullYear()
  return false if date1.getMonth() isnt date2.getMonth() 
  date1.getDate() is date2.getDate()

class LightweightDatepicker

  activeDate: new Date 2011, 10, 8

  constructor: (settings) ->
    @settings = settings

    @currentDate = new Date
    # @currentDate = new Date 2021, 1, 1 # February 2021 takes 4 rows
    # @currentDate = new Date 2012, 0, 1 # January 2012 takes 6 rows
    @todayDate = new Date

    first = @settings.firstDayOfTheWeek.toLowerCase()
    @firstDowIndex = 0
    for name in dowNames
      if name is first then break
      @firstDowIndex++

    @wrapper = $ '<div class="lw-dp"/>'
    @toolbar = $('<div class="lw-dp-toolbar"/>').appendTo @wrapper
    @previous = $('<div class="lw-dp-previous">◄</div>').appendTo @toolbar
    @next = $('<div class="lw-dp-next">►</div>').appendTo @toolbar
    @month = $('<div class="lw-dp-month"/>').appendTo @toolbar
    @renderDows().appendTo @wrapper
    @days = $('<div />').appendTo @wrapper
    
    @next.bind 'click', => @onNextClick()
    @previous.bind 'click', => @onPreviousClick()
    @updateMonth()

    @wrapper.bind 'mousedown', -> false

    # Events binding
    $(@days).delegate 'li:not(.lw-dp-active-day)', 'click', (e) =>
      currentLi = $(e.currentTarget)

      year = @currentDate.getFullYear()
      month = @currentDate.getMonth()
      day = parseInt currentLi.text()
      diff = 0

      if currentLi.hasClass('lw-dp-neighbour-month-day')
        diff = if day > 10 then -1 else 1

      selectedDate = new Date year, month + diff, day
        
      if selectedDate.getTime() >= @settings.startDate.getTime()
        if selectedDate.getTime() <= @settings.endDate.getTime()
          currentLi.parent().parent().find('li').removeClass 'lw-dp-active-day'
          currentLi.addClass 'lw-dp-active-day'
          @activeDate = selectedDate
          if @settings.autoSwitchToNeighbourMonth and diff isnt 0 then @updateMonth diff
      
      false # prevent loosing focus from input

    @wrapper.appendTo document.body

  onNextClick: ->
    @updateMonth 1

  onPreviousClick: ->
    @updateMonth -1

  updateMonth: (diff = 0) ->
    @currentDate.setMonth @currentDate.getMonth() + diff
    
    # Updating month name and year
    @month.html monthNames[@currentDate.getMonth()] + ', ' + @currentDate.getFullYear()

    # Updating dates
    cd = @currentDate

    # Enabling or disabling selectors of previous and next months
    lastDayOfPreviousMonth = new Date cd.getFullYear(), cd.getMonth(), 0
    if lastDayOfPreviousMonth.getTime() < @settings.startDate.getTime()
      $(@previous).hide()
    else $(@previous).show()
    firstDayOfNextMonth = new Date cd.getFullYear(), cd.getMonth()+1, 1
    if firstDayOfNextMonth.getTime() > @settings.endDate.getTime()
      $(@next).hide()
    else $(@next).show()

    firstDayDow = (new Date cd.getFullYear(), cd.getMonth(), 1).getDay()
    lastDowIndex = (@firstDowIndex + 6) % 7
    
    daysInFirstWeek = (7 - firstDayDow + @firstDowIndex) % 7
    if daysInFirstWeek is 0 then daysInFirstWeek = 7
    
    daysInPreviousMonth = lastDayOfPreviousMonth.getDate()
    date = new Date cd.getFullYear(), cd.getMonth(), daysInFirstWeek - 6
    
    daysInMonth = (new Date cd.getFullYear(), cd.getMonth() + 1, 0).getDate()
    weeks = Math.ceil (daysInMonth + 7 - daysInFirstWeek) / 7.0

    renderDay = (day) =>
      classes = []
      classAttribute = ''

      liContent = day.getDate()

      # Handles days of previous and next month
      if day.getMonth() isnt cd.getMonth()
        classes.push 'lw-dp-neighbour-month-day'
      
      # Handles weekends
      if day.getDay() is 0 or day.getDay() is 6 # weekends
        classes.push 'lw-dp-weekend'
      
      # Handles right borders
      if day.getDay() is lastDowIndex
        classes.push 'lw-dp-week-last-column'

      # Handles today
      if checkEqualDates day, @todayDate
        classes.push 'lw-dp-today'
        liContent = """<span>#{liContent}</span>"""

      # Handles active day
      if @activeDate? and checkEqualDates day, @activeDate
        classes.push 'lw-dp-active-day'

      # Handles date interval borders
      if day.getTime() <= @settings.startDate.getTime()
        classes.push 'lw-dp-out-of-interval'
        liContent = ''
      if day.getTime() >= @settings.endDate.getTime()
        classes.push 'lw-dp-out-of-interval'
        liContent = ''

      if classes.length
        classAttribute = " class='#{classes.join " "}'"
      
      day.setDate day.getDate() + 1

      """<li#{classAttribute}>#{liContent}</li>"""

    html = ''

    for week in [1..weeks]
      if week is 1
        html += '<ul class="lw-dp-week lw-dp-firstweek">'
      else if week is weeks
        html += '<ul class="lw-dp-week lw-dp-lastweek">'
      else # Common week
        html += '<ul class="lw-dp-week">'
      for day in [1..7]
        html += renderDay date
      html += '</ul>'    

    @days.html html

  renderDows: ->
    first = @settings.firstDayOfTheWeek.toLowerCase()
    found = false
    html = '<ul class="lw-dp-dows">'
    temp = ''
    for name in dowNames
      if name is first then found = true
      day = "<li>#{name}</li>"
      if found then html += day else temp += day
    html += temp
    html += '</ul>'
    $ html # Creates jQuery object from html code

# Adds plugin object to jQuery
$.fn.lwDatepicker = (options) ->
  options = $.extend settings, options
  picker = new LightweightDatepicker options

  # _Insert magic here._
  return @each ->
