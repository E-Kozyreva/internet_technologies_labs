// Подключение пакетов
const express = require("express");
const path = require("path");
const fs = require("fs");
const books = require("./data/books.json");
const userBooks = require("./data/user_books.json");

// объявление констант
const allBooks = JSON.parse(JSON.stringify(books));
const app = express();

// объявление переменных
let yourBooks = JSON.parse(JSON.stringify(userBooks));
let filterBooks = allBooks;

app.set('view engine', 'ejs');
// Будет смотреть файлы сразу в этой папке, которую мы прописали
app.set('views', path.resolve(__dirname, 'ejs'));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Позволяет парсить json, который будет появляться у нас в запросах
app.use(express.json())
// Для распознования форм
app.use(express.urlencoded({ extended: false }))


app.get('/your_books', (req, res) => {
    res.render('user_books', {
        'userBooks': yourBooks
    })
});


// имеет значение какой последовательностью их передавать: сначала req, потом res!
app.get('/', (req, res) => {
    res.render('index', {
        'books': filterBooks
    });
});

app.post('/book_return', (req, res) => {
    console.log(req.body.codeISBN);
    let numberNeedBook = -1
    let i = 0
    yourBooks.forEach( (currentBook) => {
        if (currentBook.codeISBN === req.body.codeISBN) {
            numberNeedBook = i;
        }
        i++;
    });
    console.log(userBooks);
    yourBooks.splice(numberNeedBook,1);
    console.log(userBooks);
    allBooks.forEach( (currentBook) => {
        if (req.body.codeISBN === currentBook.codeISBN) {
            needBook = currentBook;
            // console.log(currentBook.number);
            currentBook.number += 1;
            // console.log(currentBook.number);
        }
    });
    fs.writeFileSync("./data/books.json", JSON.stringify(allBooks));
    fs.writeFileSync("./data/user_books.json", JSON.stringify(yourBooks));
    res.render('user_books', {
        'userBooks': yourBooks
    });
});

app.post('/add_book', (req, res) => {
    console.log(req.body.codeISBN);
    let bookExist = false;
    yourBooks.forEach( (currentBook) => {
        if (currentBook.codeISBN === req.body.codeISBN) {
            res.render('action', {'result': 'Ошибка', 'action': false});
            bookExist = true;
        }
    });
    if (!bookExist) {
        let needBook = undefined;
        allBooks.forEach( (currentBook) => {
            if (req.body.codeISBN === currentBook.codeISBN) {
                needBook = currentBook;
                // console.log(currentBook.number);
                currentBook.number -= 1;
                // console.log(currentBook.number);
            }
        });
        fs.writeFileSync("./data/books.json", JSON.stringify(allBooks));
        console.log(needBook);
        currentDate = new Date();
        endDate = new Date();
        endDate.setDate(currentDate.getDate() + 20);
        bookData = {
            "codeISBN": needBook.codeISBN,
            "authors": needBook.authors,
            "codePublisher": needBook.codePublisher,
            "publishing": needBook.publishing,
            "name": needBook.name,
            "startTime": currentDate.toLocaleDateString(),
            "endTime": endDate.toLocaleDateString()
        };
        yourBooks.push(bookData);
        fs.writeFileSync("./data/user_books.json", JSON.stringify(yourBooks));
        // Добавить данную книгу в наш массив + туда добавить дату взятия книги и дату сдачи
        res.render('action', {'result': 'Успех', 'action': true});
    }
});

app.post("/search", (req, res) => {
    // param - это опция, по которой искать книги
    console.log(req.body);
    const param = req.body.param;
    console.log(param);
    // // query - непосредственно строка, которая будет сопоставляться с названием книги, авторами и т.д. ( в зависимости от param )
    const query = req.body.query;
    console.log(query);
    // фильтруем массив данных
    filterBooks = allBooks.filter((book) => {
        // Эти значения должны быть уникальными
        if (req.body.param === 'codeISBN' || req.body.param === 'codePublisher') {
            return book[req.body.param] === req.body.query;
        } else {
            return book[req.body.param].toLowerCase().includes((req.body.query).toLowerCase());
        }
    });
    // Если в вводе было пусто, то выведем всё
    if (req.body.query === '') {
        filterBooks = allBooks;
    }
    // редиректимся на главную страницу
    res.redirect('/');
})

app.listen(3000, () => {
    console.log('Server has been started on port 3000');
});