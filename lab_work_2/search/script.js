document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.getElementById("searchForm");
    const searchResultsContainer = document.getElementById("searchResults");
    const usersFilePath = "../user/shelf.json";

    // Загрузка данных из JSON-файла
    let libraryData = [];
    fetch("../books/library.json")
        .then(response => response.json())
        .then(data => {
            libraryData = data;
        });

    // Обработчик формы поиска
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const searchTerm = searchForm.elements.searchInput.value.toLowerCase();
        const searchResults = searchBooks(searchTerm);
        displaySearchResults(searchResults);
    });

    // Функция поиска книг
    function searchBooks(term) {
        term = term.toLowerCase();
        return libraryData.filter(book =>
            book.title.toLowerCase().includes(term) ||
            book.authors.some(author => author.toLowerCase().includes(term)) ||
            book.ISBN.includes(term)
        );
    }

    // Функция отображения результатов поиска
    function displaySearchResults(results) {
        searchResultsContainer.innerHTML = "";

        if (results.length === 0) {
            searchResultsContainer.innerHTML = "<p>No books found :(</p>";
            return;
        }

        const table = document.createElement("table");
        const headerRow = table.insertRow(0);
        const headers = ["Name", "Authors", "ISBN", "Count", "Shelf"];

        
        for (let i = 0; i < headers.length; i++) {
            const headerCell = headerRow.insertCell(i);
            headerCell.textContent = headers[i];
        }        

        for (let i = 0; i < results.length; i++) {
            const row = table.insertRow(i + 1);
            const book = results[i];
        
            const titleCell = row.insertCell(0);
            titleCell.textContent = book.title;
        
            const authorsCell = row.insertCell(1);
            authorsCell.textContent = book.authors.join(", ");
        
            const isbnCell = row.insertCell(2);
            isbnCell.textContent = book.ISBN;
        
            const availableCopiesCell = row.insertCell(3);
            availableCopiesCell.textContent = book.availableCopies;
        
            const actionsCell = row.insertCell(4);
            const addButton = document.createElement("button");
            addButton.textContent = "Add";
            addButton.className = "addToShelf";
            addButton.addEventListener("click", function() { 

            });
            actionsCell.appendChild(addButton);
        }        

        searchResultsContainer.appendChild(table);
    }
});