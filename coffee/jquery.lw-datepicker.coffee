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
    dayIndex = 0
    firstDayDow = (new Date(cd.getFullYear(), cd.getMonth(), 1)).getDay()
    adjustedFirstDow = firstDayDow - @firstDowIndex
    if adjustedFirstDow < 0 then adjustedFirstDow = 7 + adjustedFirstDow
    daysInPreviousMonth = (new Date(cd.getFullYear(), cd.getMonth(), 0)).getDate()
    daysInFirstWeek = (7 - firstDayDow + @firstDowIndex) % 7
    if daysInFirstWeek is 0 then daysInFirstWeek = 7
    remainingDays = (new Date(cd.getFullYear(), cd.getMonth() + 1, 0)).getDate()
    remainingDays -= daysInFirstWeek
    startDatePreviousMonth = daysInPreviousMonth - (6 - daysInFirstWeek)

    renderDay = (day)->
      classes = []
      classAttribute = ''
      dow = (dayIndex + firstDayDow) % 7
      if dow is 0 or dow is 6 # weekends
        classes.push 'lw-dp-weekend'
      if ((dayIndex + adjustedFirstDow) % 7) is 6
        classes.push 'lw-dp-week-last-column'
      if classes.length
        classAttribute = " class='#{classes.join " "}'"
      dayIndex++
      """<li#{classAttribute}>#{day}</li>"""
    
    html = '<ul class="lw-dp-week lw-dp-firstweek">'
    if startDatePreviousMonth <= daysInPreviousMonth
      for day in [startDatePreviousMonth..daysInPreviousMonth]
        html += """<li class="lw-dp-neighbour-month-day">#{day}</li>"""
    for day in [1..daysInFirstWeek]
      html += renderDay day
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
    
#   <ul class="lw-dp-week lw-dp-firstweek">
#     <li class="lw-dp-neighbour-month-day">31</li>
#     <li>1</li>
#     <li>2</li>
#     <li>3</li>
#     <li>4</li>
#     <li class="lw-dp-weekend">5</li>
#     <li class="lw-dp-weekend lw-dp-week-last-column">6</li>
#   </ul>
#   <ul class="lw-dp-week">
#     <li>7</li>
#     <li>8</li>
#     <li>9</li>
#     <li class="lw-dp-today"><span>10</span></li>
#     <li>11</li>
#     <li class="lw-dp-weekend">12</li>
#     <li class="lw-dp-weekend lw-dp-week-last-column">13</li>
#   </ul>
#   <ul class="lw-dp-week">
#     <li>14</li><li class="lw-dp-active-day">15</li>
#     <li>16</li>
#     <li>17</li>
#     <li>18</li>
#     <li class="lw-dp-weekend">19</li>
#     <li class="lw-dp-weekend lw-dp-week-last-column">20</li>
#   </ul>
#   <ul class="lw-dp-week">
#     <li>21</li>
#     <li>22</li>
#     <li>23</li>
#     <li>24</li>
#     <li>25</li>
#     <li class="lw-dp-weekend">26</li><li class="lw-dp-weekend lw-dp-week-last-column">27</li>
#   </ul>
#   <ul class="lw-dp-week lw-dp-lastweek">
#     <li >28</li>
#     <li >29</li>
#     <li >30</li>
#     <li class="lw-dp-neighbour-month-day">1</li>
#     <li class="lw-dp-neighbour-month-day">2</li>
#     <li class="lw-dp-neighbour-month-day lw-dp-weekend">3</li>
#     <li class="lw-dp-neighbour-month-day lw-dp-weekend lw-dp-week-last-column">4</li>
#   </ul>

