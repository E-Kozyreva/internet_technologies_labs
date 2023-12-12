const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var MongoClient = require('mongodb').MongoClient;
var books;
var user;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

MongoClient.connect('mongodb://localhost:27017/',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err, database) => {
    if (err) {
      return console.log(err);
    }

    books = database.db('database').collection('books');
    user = database.db('database').collection('user', (err, res) => {
      res.estimatedDocumentCount((err, count) => {
        if (count == 0) {
          database.db('database').createCollection('user');
        }
      })
    });

    app.listen(3000, function () {
      console.log(`Here we go http://localhost:3000`);
    });
  });

app.get('/', (req, res) => {
  books.find({}).toArray((err, items) => {
    res.render('../views/pages/main.ejs', {
      books: items
    });
  });
});

app.post('/', (req, res) => {
  user.estimatedDocumentCount((err, count) => {
    if (count != 0) {
      res.send({ 'error': 'return book first!' });
    } else {
      books.findOneAndUpdate({ 'id': req.body.book_id }, { $inc: { 'count': -1 } }, (err, book) => {
        if (book.value.count == 0) {
          books.findOneAndUpdate({ 'id': book.value.id }, { $set: { 'count': 0 } });
          res.redirect('/');
        } else {
          book.value.count = 1;

          var date = new Date();
          date.setFullYear(date.getFullYear(), date.getMonth() + 1, date.getDate() + 20);
          date = date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear();

          user.insertOne({ ...book.value, 'date': date });
          res.redirect('/');
        }
      });
    }
  });
});

app.get('/user', (req, res) => {
  user.find({}).toArray((err, items) => {
    res.render('../views/pages/user.ejs', {
      books: items
    });
  });
});

app.post('/user', (req, res) => {
  books.findOneAndUpdate({ 'id' : req.body.book_id }, { $inc: { 'count' : 1 }});
  user.deleteOne({ 'id' : req.body.book_id});
  res.redirect('/user');
});

app.get('/addBook', (req, res) => {
  res.render('../views/pages/addBook.ejs');
});

app.post('/addBook', (req, res) => {

  var book = {'id': req.body.id,
              'authors' : req.body.authors,
              'editioncode' : req.body.editioncode,
              'edition' : req.body.edition,
              'name': req.body.name,
              count: Number(req.body.count) };

  books.insertOne(book, err => {
    if (err) {
      res.send({ 'error': 'An error has occurred' });
    } else {
      res.redirect('/');
    }
  });
});
