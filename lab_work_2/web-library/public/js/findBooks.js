function findBooks(name) {
  name = name.toLowerCase();
  var books = Array.from(document.getElementById('album').children);
  
  if (name != '') {
    var res = books.filter(book =>
      !book.getAttribute('id').toLowerCase().match(name) ||
      !book.getAttribute('authors').toLowerCase().match(name) ||
      !book.getAttribute('editioncode').toLowerCase().match(name) ||
      !book.getAttribute('edition').toLowerCase().match(name) ||
      !book.getAttribute('name').toLowerCase().match(name)
    );
    res.map(book => {
      var card = document.getElementById(book.getAttribute('id'));
      card.setAttribute("hidden", "true");
    });
    res = books.filter(book =>
      book.getAttribute('id').toLowerCase().match(name) ||
      book.getAttribute('authors').toLowerCase().match(name) ||
      book.getAttribute('editioncode').toLowerCase().match(name) ||
      book.getAttribute('edition').toLowerCase().match(name) ||
      book.getAttribute('name').toLowerCase().match(name)
    );
    res.map(book => {
      var card = document.getElementById(book.getAttribute('id'));
      card.removeAttribute("hidden");
    });
  } else {
    books.map(card => card.removeAttribute("hidden"));
  }
}
