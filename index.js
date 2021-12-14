// Book Class : Represents a Book
class Book {
    constructor(title, author, id, dateTime){
        this.title = title;
        this.author = author;
        this.id = id;
        this.dateTime = dateTime;
    }

}

// UI Class: Handle UI Tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));  
    }

    static addBookToList(book) {
        const list = document.getElementById("book-list");

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.id}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">Delete</a></td>
            <td>${book.dateTime}</td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.getElementById('book-form');
        container.insertBefore(div, form);

        //notification will disappear in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 2000);

    }
    //function to clear the entry fields after a book was added
    static clearFields(){
        document.getElementById("title").value = '';
        document.getElementById("author").value = '';
        document.getElementById("id").value = '';

    }

}

//Store Class: Handles Storage

class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(id){
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.id === id){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }

}



// Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);
// Add a Books
document.getElementById("book-form").addEventListener('submit', (e) => {
   // prevent submit
    e.preventDefault();

    //extract form data
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const id = document.getElementById("id").value;
    let rawDate = Date();
    let dateTime = rawDate.slice(0, 24); 

    //validate
    if(title === "" || author === "" || id === ""){
        UI.showAlert("please fill all the fields!", "danger");
    } else {
        //create new book
        const book = new Book(title, author, id, dateTime);

        //add book to ui
        UI.addBookToList(book);

        //add book to store
        Store.addBook(book);
        
        //show success message
        UI.showAlert('book added', 'success');

        //clear fields
        UI.clearFields();
    }

   
});
//Event: Remove a Book
document.getElementById("book-list").addEventListener('click', (e) => {
   //remove book from ui
    UI.deleteBook(e.target);
    //remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    //show success message
   UI.showAlert('book removed', 'success');
});