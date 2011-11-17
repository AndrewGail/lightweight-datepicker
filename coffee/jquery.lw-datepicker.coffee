# References jQuery
$ = jQuery

dowNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

settings = 
  multiple: false
  firstDayOfTheWeek: 'mon'
  dateFormat: 'yyyy.mm.dd'

class LightweightDatepicker

  activeDate: null

  constructor: (settings) ->
    @settings = settings

    @currentDate = new Date
    # @currentDate = new Date(2021, 1, 1) # February 2021 takes 4 rows
    # @currentDate = new Date(2012, 0, 1) # January 2012 takes 6 rows
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

    # Events binding
    $(@days).delegate 'li:not(.lw-dp-active-day)', 'click', ->
      $(@).parent().parent().find('li').removeClass 'lw-dp-active-day'
      $(@).addClass "lw-dp-active-day"

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
    today = cd.getDate() + 16
    activeDay = today
    # activeDay = @activeDate.getDate() - 4
    
    firstDayDow = (new Date(cd.getFullYear(), cd.getMonth(), 1)).getDay()
    adjustedFirstDow = firstDayDow - @firstDowIndex
    if adjustedFirstDow < 0 then adjustedFirstDow = 7 + adjustedFirstDow
    
    daysInFirstWeek = (7 - firstDayDow + @firstDowIndex) % 7
    if daysInFirstWeek is 0 then daysInFirstWeek = 7
    
    daysInPreviousMonth = (new Date(cd.getFullYear(), cd.getMonth(), 0)).getDate()
    startDatePreviousMonth = daysInPreviousMonth - (6 - daysInFirstWeek)
    
    daysInMonth = (new Date(cd.getFullYear(), cd.getMonth() + 1, 0)).getDate()
    remainingDays = daysInMonth
    
    # Day counter
    dayIndex = daysInFirstWeek - 7

    # Renders a day
    renderDay = (day) ->
      classes = []
      classAttribute = ''

      if day <= 0 then day = daysInPreviousMonth + day
      liContent = day

      # Handles days of next month
      if dayIndex < 0 or dayIndex >= daysInMonth
        classes.push 'lw-dp-neighbour-month-day'
      
      # Handles weekends  
      dow = (dayIndex + firstDayDow) % 7
      if dow < 0 then dow = 7 + dow
      if dow is 0 or dow is 6 # weekends
        classes.push 'lw-dp-weekend'
      
      # Handles right borders
      if ((dayIndex + adjustedFirstDow) % 7) is 6
        classes.push 'lw-dp-week-last-column'

      # Handles today
      if dayIndex + 1 is today and 
        classes.push 'lw-dp-today'
        liContent = """<span>#{day}</span>"""

      # Handles active day
      if dayIndex + 1 is activeDay
        classes.push 'lw-dp-active-day'

      if classes.length
        classAttribute = " class='#{classes.join " "}'"
      
      if ++dayIndex >= 0 then remainingDays--

      """<li#{classAttribute}>#{liContent}</li>"""
    
    html = ''
    # Renders a week
    while remainingDays > 0
      if remainingDays is daysInMonth  # First week
        html += '<ul class="lw-dp-week lw-dp-firstweek">'
      else if remainingDays <= 7 # Last week
        html += '<ul class="lw-dp-week lw-dp-lastweek">'
      else # Common week
        html += '<ul class="lw-dp-week">'
      for day in [dayIndex+1..dayIndex+7]
        adjustedDay = if day > daysInMonth then day - daysInMonth else day
        html += renderDay adjustedDay
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
