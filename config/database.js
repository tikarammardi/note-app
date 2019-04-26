if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI:
      'mongodb://tikarammardi:5Y44xyRkHP2JKpj@ds147946.mlab.com:47946/note-prod'
  };
} else {
  module.exports = {
    mongoURI: 'mongodb://localhost/note-dev'
  };
}
