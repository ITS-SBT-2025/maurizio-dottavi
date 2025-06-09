require('dotenv').config();


console.log ("DB_Password is " + process.env.DB_PASSWORD);

const express = require('express');
const app = express();

const middleware = require("./main/middleware");
const routes = require("./routes/main-router");



middleware(app, express);
routes(app);

app.listen(3000);
console.log ("Server is running on port 3000");