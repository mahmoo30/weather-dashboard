$(document).ready(function() {
  // Search Button Feature
  $("#search-button").on("click", function() {
      // Gets User Input
      var searchTerm = $("#search-value").val();
      // console.log('searchTerm', searchTerm);
      $("#search-value").val("");
      weatherFunction(searchTerm);
      weatherForecast(searchTerm);
  });

  function clear() {
      localStorage.clear();
      location.reload();
      return;
  }
  // Clear Button
  let clearBtn = $('#clearBtn');
  clearBtn.on('click', clear);

  // Pulls Previous Searches from Local Storage
  var history = JSON.parse(localStorage.getItem("history")) || [];

  // Sets History Array Search to Correct Length
  if (history.length > 0) {
      weatherFunction(history[history.length - 1]);
  }
  // Makes a Row for Each User Input
  for (var i = 0; i < history.length; i++) {
      createRow(history[i]);
  }

  // Lists User Inputs in the Same Order they are Inputed
  function createRow(text) {
      var listItem = $("<li>").addClass("list-group-item").text(text);
      $(".history").append(listItem);
  }

  // Listener for Click Function on the List of Previous Inputs
  $(".history").on("click", "li", function() {
      weatherFunction($(this).text());
      weatherForecast($(this).text());
  });

  // Current Weather
  function weatherFunction(searchTerm) {

      var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + searchTerm + "&appid=f81f1b242f6730335672f5cde4b6ea7a";
      fetch(requestUrl)
          .then(function(response) {
              return response.json();
          })
          .then(function(data) {
              // console.log(requestUrl);
              // console.log(data);
              // console.log('data.name', data.name);

              // If Index of Search Value Does Not Exist, User is Alerted
              if (data.name === undefined) {
                  alert('Not A Valid Input, Please Try Again');
              }

              if (history.indexOf(searchTerm) === -1 && data.name !== undefined) {
                  // Stores User Input to History Array
                  history.push(searchTerm);
                  // Displays Items Stores in Local Storage
                  localStorage.setItem("history", JSON.stringify(history));
                  createRow(searchTerm);
              }
              // Clears Old Content
              $("#today").empty();;

              var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")"); // Date
              var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png"); // Image
              var card = $("<div>").addClass("card");
              var cardBody = $("<div>").addClass("card-body");
              var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + "MPH"); // Wind Speed
              var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%"); // Humidity

              // Converts Temperature from Kelvin to Fahrenheit
              var kelvin = data.main.temp;
              const celsius = kelvin - 273;
              let fahrenheit = Math.floor(celsius * (9 / 5) + 32);

              var temp = $("<p>").addClass("card-text").text("Temperature: " + fahrenheit + "°F"); // Temperature
              // console.log(data.wind.speed);

              // Merge all Variables and Display
              title.append(img);
              cardBody.append(title, temp, humid, wind);
              card.append(cardBody);
              $("#today").append(card);
              //console.log(data);
          });
  }

  // Weather Forecast
  function weatherForecast(searchTerm) {

      var forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + searchTerm + "&appid=f81f1b242f6730335672f5cde4b6ea7a&units=imperial";
      fetch(forecastUrl)
          .then(function(response) {
              return response.json();
          })
          .then(function(data) {
              // console.log(forecastUrl);
              $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");

              // Forloop to Create a New Card for the Next 5 Days by Pulling Data from User Input
              for (var i = 0; i <= data.list.length; i++) {
                  console.log(data.list[i].dt_txt);
                  if (data.list[i].dt_txt.indexOf("00:00:00") !== -1) { // Based on 12AM Each Day

                      var titleFive = $("<h3>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString()); // Date
                      var imgFive = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png"); // Image
                      var colFive = $("<div>").addClass("col-md-2.5 mt-2 ms-2");
                      var cardFive = $("<div>").addClass("card bg-secondary text-white text-center");
                      var cardBodyFive = $("<div>").addClass("card-body p-2");
                      // console.log(data.list[i]);
                      var humidFive = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%"); // Humidity
                      var tempFive = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + "°F"); // Temperature
                      var windFive = $("<p>").addClass("card-text").text("Wind Speed: " + data.list[i].wind.speed + "MPH"); // Wind Speed

                      // Merge all Variables and Display
                      colFive.append(cardFive.append(cardBodyFive.append(titleFive, imgFive, tempFive, humidFive, windFive)));
                      $("#forecast .row").append(colFive);
                  }
              }
          });
  }

});