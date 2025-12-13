require('dotenv').config()
const express = require("express");
const app = express();
const port = process.env.PORT;
const databaseConfig = require("./config/database");
databaseConfig.connectDatabase();

const routesAdminApiVer1 = require('./api/v1/routes/admin/index.route');
const routesClientApiVer1 = require('./api/v1/routes/client/index.route');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// parse application/json
app.use(express.json()); //for json
app.use(express.urlencoded({extended: true})); //for form data

//dùng cors để chia sẻ tài nguyên chéo nhau giữa fe vs be khi code theo hướng api
app.use(cors());

app.use(cookieParser());

routesAdminApiVer1(app);
routesClientApiVer1(app);

app.listen(port, () => {
    console.log(`Lắng nghe port: ${port}`);
});