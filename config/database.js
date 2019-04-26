if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI:
      'mongodb://tikarammardi:5Y44xyRkHP2JKpj@ds147746.mlab.com:47746/note-prod'
  };
} else {
  module.exports = {
    mongoURI: 'mongodb://localhost/note-dev'
  };
}
