var apiKey = "b688b3d7d1b82f8152d871eda6266e16";

$(document).ready(function() {
  $('#weatherLocation').click(function() {
    var city = $('#location').val();
    $('#location').val("");
    $('.showweather').text("The city you have chosen is " + city + ",");
    $.get('http://api.openweathermap.org/data/2.5/weather?q=' + city +'&appid=' + apiKey, function(response {
      $('.showweather').text("The humidity in " + city + " is " + response.main.humidity + "%");
    }).fail(function(error) {
      $('.showweather').text(error.responseJSON.message);
    });
  });
});
