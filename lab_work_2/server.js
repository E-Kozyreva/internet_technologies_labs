const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const MongoClient = require('mongodb').MongoClient;

// Переименованные переменные
let booksCollection;
let userCollection;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('pages'));
app.set('view engine', 'ejs');

// Используем сессии и middleware для flash-сообщений
app.use(session({
  secret: 'ваш_секретный_ключ',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

MongoClient.connect('mongodb://localhost:27017/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err, database) => {
  if (err) {
    return console.log(err);
  }

  // Инициализируем коллекции
  booksCollection = database.db('database').collection('books');
  userCollection = database.db('database').collection('user', (err, res) => {
    res.estimatedDocumentCount((err, count) => {
      if (count == 0) {
        database.db('database').createCollection('user');
      }
    });
  });

  // Запускаем сервер
  app.listen(3000, function () {
    console.log(`Сервер запущен по адресу http://localhost:3000`);
  });
});

// Обрабатываем GET-запрос для главной страницы
app.get('/', (req, res) => {
  booksCollection.find({}).toArray((err, items) => {
    res.render('F:/university/internet_technologies_labs/lab_work_2/pages/main.ejs', {
      books: items,
      messages: req.flash('error') // Передаем flash-сообщения в шаблон
    });
  });
});

// Обрабатываем POST-запрос для главной страницы (взятие книги в аренду)
app.post('/', (req, res) => {
  userCollection.estimatedDocumentCount((err, count) => {
    if (count != 0) {
      req.flash('error', 'Пожалуйста, верните книгу перед тем, как взять новую :)');
      res.redirect('/');
    } else {
      booksCollection.findOneAndUpdate({ 'id': req.body.book_id }, { $inc: { 'count': -1 } }, (err, book) => {
        if (book.value.count == 0) {
          booksCollection.findOneAndUpdate({ 'id': book.value.id }, { $set: { 'count': 0 } });
          res.redirect('/');
        } else {
          book.value.count = 1;
          const date = new Date();
          date.setFullYear(date.getFullYear(), date.getMonth() + 1, date.getDate() + 20);
          const formattedDate = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
          userCollection.insertOne({ ...book.value, 'date': formattedDate });
          res.redirect('/');
        }
      });
    }
  });
});

// Обрабатываем GET-запрос для страницы пользователя
app.get('/user', (req, res) => {
  userCollection.find({}).toArray((err, items) => {
    res.render('F:/university/internet_technologies_labs/lab_work_2/pages/user.ejs', {
      books: items
    });
  });
});

// Обрабатываем POST-запрос для страницы пользователя (возвращение книги)
app.post('/user', (req, res) => {
  booksCollection.findOneAndUpdate({ 'id': req.body.book_id }, { $inc: { 'count': 1 } });
  userCollection.deleteOne({ 'id': req.body.book_id });
  res.redirect('/user');
});

// Обрабатываем GET-запрос для страницы добавления книги
app.get('/addBook', (req, res) => {
  res.render('F:/university/internet_technologies_labs/lab_work_2/pages/add_book.ejs');
});

// Обрабатываем POST-запрос для страницы добавления книги
app.post('/addBook', (req, res) => {
  const book = {
    'id': req.body.id,
    'authors': req.body.authors,
    'editioncode': req.body.editioncode,
    'edition': req.body.edition,
    'name': req.body.name,
    count: Number(req.body.count)
  };

  booksCollection.insertOne(book, err => {
    if (err) {
      res.send({ 'error': 'Произошла ошибка' });
    } else {
      res.redirect('/');
    }
  });
});
