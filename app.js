const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

//load routes
const notes = require('./routes/notes');
const users = require('./routes/users');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
//method override for put request
app.use(methodOverride('_method'));

//session middleware
app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  })
);

app.use(flash());

//global variables

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');

  next();
});

//connect to mongoose
mongoose
  .connect(`mongodb://localhost/note-dev`, { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.log(error));

app.use(express.static(path.join(__dirname, 'public')));
//Handlebars Middleware
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

//This is Index Route
app.get('/', (req, res) => {
  const title = 'Title';
  res.render('index', {
    title
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

//use routes
app.use('/notes', notes);
app.use('/users', users);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running at port:${PORT}`);
});
