var Weather = require('./../js/weather.js').weatherModule;
var apiKey = require('./../.env').apiKey;
var apiKey = "b688b3d7d1b82f8152d871eda6266e16";

$(document).ready(function() {
  var currentWeatherObject = new weather();
  $('#weatherLocation').click(function() {
    var city = $('#location').val();
    $('#location').val("");
    currentWeatherObject.getWeather(city);
    });
  });
