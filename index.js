const express = require('express');
require('dotenv').config();
const database = require("./config/database");
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
database.connect();

const routeAdmin = require("./routes/admin/index.route");
const routeClient = require("./routes/client/index.routes");
const systemConfig = require("./config/system");

const app = express();
const port = process.env.PORT;
app.use(methodOverride('_method'));
// flash
app.use(cookieParser('Maria'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// End flash
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
app.use(express.static(`${__dirname}/public`));
// App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

routeAdmin.index(app);
routeClient.index(app);
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
