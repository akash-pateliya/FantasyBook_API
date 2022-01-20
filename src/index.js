var express = require("express");
var bodyParser = require("body-parser");
var routes = require("../routes/routes");
const requestLogger = require("./logger/request.logger");
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

routes(app);
const PORT = process.env.PORT || 8080;

var server = app.listen(PORT, function () {
    console.log("app running on port.", server.address().port);
});