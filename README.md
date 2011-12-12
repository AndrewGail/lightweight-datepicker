# Lightweight DatePicker v1.0 (12/12/2011)

Provides themeable and customizable calendar jQuery plugin.

## Prerequisites

Requires [jQuery v1.6+](http://jquery.com/)

### Features

- Provides mouse and keyboard navigation.
- Localizable. You can set days of week, months names and the first day of week.
- Restricting selection of dates outside of a range.
- Supports user's custom functions for parsing and formatting a date.
- Easily customizable look via [scss](http://compass-style.org/).

## Basic usage

- Copy the "js/jquery.lw-datepicker.js" and "css/datepicker.css" files to your project folder.
- Add references to these files in your html-page:

        <link href="css/datepicker.css" rel="stylesheet" type="text/css" />
        <script type="text/javascript" src="js/jquery.lw-datepicker.js"></script>
    
- Make sure you already have any input or textarea you can bind the plugin to:
    
        <input type="text" id="date">
    
- Bind the plugin to the input:
    
        $('#date').lwDatepicker();

- You can pass additional options as an object described in next chapter.

## Options

- `startDate` - (default: `null`) - Date object that prohibits selection of dates before the `startDate`.
- `endDate` - (default: `null`) - Date object that prohibits selection of dates after the `endDate`.
- `dowNames` - (default: `['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']`) - array of names of days of the week starting with Sunday.
- `monthNames` - (default: `['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']`) - array of names of months starting with January.
- `firstDayOfTheWeekIndex` - (default: `1`) - sets first day of the week starting with Sunday (in 0-based index)
- `autoFillToday` - (default: `false`) - Sets whether auto fill empty input with today value.
- `multiple` - (default: `false`) - if 'false', creates one datepicker for all inputs, else - creates dedicated datepicker for each input.
- `alwaysVisible` - (default: `false`) - sets whether datepicker stay visible after input field loses focus.
- `autoHideAfterClick` - (default: `false`) - sets whether datepicker hides after day selection with a mouse.
- `parseDate` - (default: `null`) - holds optional user function for parsing typed date.
- `formatDate` - (default: `null`) - holds optional user function for formatting selected date.
- `onChange` - (default: `null`) - holds optional user function called after active date changed.
- `margin` - (default: `6`) - Defines mininum distance between the datepicker and browser window border.

## License

Copyright (c) 2011 [Maxim Zhukov](mailto:zhkv.mxm@gmail.com)

Dual licensed under the MIT and GPL licenses:
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl.html