const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const methodOverRide = require('method-override');
const flash = require('connect-flash');
const passport = require('passport');
require('dotenv').config();

//Initialization
const app = express();
require('./database');
require('./config/passport');

//Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view-engine', '.hbs');


//Middlewares
app.use(express.urlencoded({ extended: false }));

//Sirve para revisar input ocultos (Necesario para el funcionamiento del método PUT)
app.use(methodOverRide('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true,
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//Routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

//Static files
app.use(express.static(path.join(__dirname, 'public')));


//Server listening
app.listen(app.get('port'), () => {
    console.log(`Server on port ` + app.get('port'));
})