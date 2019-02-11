// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Require moment to parse the date:
let moment = require('moment');

// Regex to check date format:
let UTC_regex = /\d\d\d\d-\d\d-\d\d/;

app.get('/api/timestamp/:date_string', function(request, response) {
  let date_str = request.params.date_string;
  let res = {};
  
  // Check if the string is in the format YYYY-MM-DD:
  if(UTC_regex.test(date_str)) {
    let check_date = moment.utc(date_str);
    // Check if the string is a valid UTC date:
    if(check_date.isValid()) {
      let date = new Date(date_str)
      res = {
        "unix": date.getTime(),
        "utc" : date.toUTCString()
      };
    }
    else
      res = {"error": "Invalid Date"}
  }
  else {
    // Check if the string is a valid number:
    if(isNaN(date_str)) {
      res = {"error": "Invalid Date"}
    }
    // Parse the string to integer, date is in milliseconds:
    else {
      let date = new Date(parseInt(date_str));
      res = {
        "unix": date.getTime(),
        "utc" : date.toUTCString()
      };
    }
  }
  // Send the response:
  response.json(res);
});

// For new dates:
app.get('/api/timestamp', function(request, response) {
  let date = new Date();
  response.json({
    "unix": date.getTime(),
    "utc": date.toUTCString()
  });
});

// listen for requests:
var listener = app.listen(process.env.PORT);