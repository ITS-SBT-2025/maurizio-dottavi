const express = require('express')
const app = express();
const path = require('path');

const router = require("./routes");


const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');

app.use("/", express.static(path.join(__dirname, "/public"), { "extensions": ["html"] }));
app.use(express.json());
app.use(express.urlencoded());

app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet());
router.init(app);




app.listen(3000);