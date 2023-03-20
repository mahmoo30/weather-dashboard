$(document).ready(function() {
  //search button feature
  $("#search-button").on("click", function() {
      //get value in input search-value.
      var searchTerm = $("#search-value").val();
      //empty input field.
      console.log('searchTerm', searchTerm);
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

  //pull previous searches from local storage
  var history = JSON.parse(localStorage.getItem("history")) || [];

  //sets history array search to correct length
  if (history.length > 0) {
      weatherFunction(history[history.length - 1]);
  }
  //makes a row for each element in history array(searchTerms)
  for (var i = 0; i < history.length; i++) {
      createRow(history[i]);
  }

  //puts the searched cities underneath the previous searched city 
  function createRow(text) {
      var listItem = $("<li>").addClass("list-group-item").text(text);
      $(".history").append(listItem);
  }

  //listener for list item on click function
  $(".history").on("click", "li", function() {
      weatherFunction($(this).text());
      weatherForecast($(this).text());
  });

  function weatherFunction(searchTerm) {

      var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + searchTerm + "&appid=f81f1b242f6730335672f5cde4b6ea7a";
      fetch(requestUrl)
          .then(function(response) {
              // In order to use the data, it must first be parsed. Use .json() when the
              // API response format is JSON.
              return response.json();
          })
          .then(function(data) {
              console.log(requestUrl);
              console.log(data);
              console.log('data.name', data.name);
              
              //if index of search value does not exist
              if (data.name === undefined) {
                  alert('Not A Valid Input, Please Try Again');
              }

              if (history.indexOf(searchTerm) === -1 && data.name !== undefined) {
                  //push searchValue to history array
                  history.push(searchTerm);
                  //places item pushed into local storage
                  localStorage.setItem("history", JSON.stringify(history));
                      createRow(searchTerm);
              }
              // clears out old content
              $("#today").empty();;

              var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
              var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
              var card = $("<div>").addClass("card");
              var cardBody = $("<div>").addClass("card-body");
              var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + "MPH");
              var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");

              var kelvin = data.main.temp;
              const celsius = kelvin - 273;
              let fahrenheit = Math.floor(celsius * (9 / 5) + 32);

              var temp = $("<p>").addClass("card-text").text("Temperature: " + fahrenheit + "°F");
              //console.log(data.wind.speed);

              // merge and add to page
              title.append(img);
              cardBody.append(title, temp, humid, wind);
              card.append(cardBody);
              $("#today").append(card);
              //console.log(data);
          });
  }

  // function weatherForecast(searchTerm) 
  function weatherForecast(searchTerm) {

      var forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + searchTerm + "&appid=f81f1b242f6730335672f5cde4b6ea7a&units=imperial";
      fetch(forecastUrl)
          .then(function(response) {
              // In order to use the data, it must first be parsed. Use .json() when the
              // API response format is JSON.
              return response.json();
          })
          .then(function(data) {
              //console.log(forecastUrl);
              $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");

              //loop to create a new card for the NEXT 5 days pull data image from search
              for (var i = 7; i <= data.list.length; i+=8) {
                console.log(data.list[i].dt_txt);
                  if (data.list[i].dt_txt.indexOf("06:00:00") !== -1) { // based on 6am each day

                      var titleFive = $("<h3>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                      var imgFive = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
                      var colFive = $("<div>").addClass("col-md-2.5 mt-2 ms-2");
                      var cardFive = $("<div>").addClass("card bg-secondary text-white text-center");
                      var cardBodyFive = $("<div>").addClass("card-body p-2");
                      // console.log(data.list[i]);
                      var humidFive = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
                      var tempFive = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + "°F");
                      var windFive = $("<p>").addClass("card-text").text("Wind Speed: " + data.list[i].wind.speed + "MPH");

                      //merge together and put on page
                      colFive.append(cardFive.append(cardBodyFive.append(titleFive, imgFive, tempFive, humidFive, windFive)));
                      //append card to column, body to card, and other elements to body
                      $("#forecast .row").append(colFive);
                  }
              }
          });
  }

});