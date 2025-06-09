
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');

function middleware(app,express) {
    
    app.use("/", express.static(path.join(__dirname, "/public"), { "extensions": ["html"] }));
    app.use(express.urlencoded());
    app.use(express.json());


    app.use(cookieParser());
    app.use(morgan("combined"));
    app.use(helmet());
   
}

module.exports = middleware;