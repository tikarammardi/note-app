const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
//method override for put request
app.use(methodOverride('_method'));

//connect to mongoose
mongoose
  .connect(`mongodb://localhost/note-dev`, { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.log(error));

//load note MOdel

require('./models/Notes');
const Note = mongoose.model('notes');

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

//note index page

app.get('/notes', (req, res) => {
  Note.find({})
    .sort({ date: 'desc' })
    .then(notes => {
      res.render('notes/index', {
        notes
      });
    });
});

//add note form

app.get('/notes/add', (req, res) => {
  res.render('notes/add');
});

//edit note form
app.get('/notes/edit/:id', (req, res) => {
  Note.findOne({ _id: req.params.id }).then(note => {
    res.render('notes/edit', {
      note
    });
  });
});

//process form

app.post('/notes', (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({ text: 'Title is required' });
  }
  if (!req.body.details) {
    errors.push({ text: 'Details is required ' });
  }

  if (errors.length > 0) {
    res.render('notes/add', {
      errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    };
    new Note(newUser).save().then(note => {
      res.redirect('/notes');
    });
  }
});

//Edit form process

app.put('/notes/:id', (req, res) => {
  Note.findOne({
    _id: req.params.id
  }).then(note => {
    //new values;
    (note.title = req.body.title), (note.details = req.body.details);

    note.save().then(note => {
      res.redirect('/notes');
    });
  });
});

//delete Note
app.delete('/notes/:id', (req, res) => {
  Note.deleteOne({
    _id: req.params.id
  }).then(() => {
    res.redirect('/notes');
  });
});
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running at port:${PORT}`);
});
