const API_URL = 'http://localhost:3000/api/books';

window.addEventListener('DOMContentLoaded', loadBooks);

const titleInput = document.getElementById('titleInput');
const authorInput = document.getElementById('authorInput');

if (titleInput) {
    titleInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            authorInput.focus();
        }
    });
}

if (authorInput) {
    authorInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addBook();
    });
}

async function loadBooks() {
    try {
        const response = await fetch(API_URL);
        const books = await response.json();
        renderBooks(books);
        updateStats(books);
    } catch (error) {
        console.error('Błąd podczas ładowania książek:', error);
    }
}

function updateStats(books) {
    const total = books.length;
    const read = books.filter(b => b.read).length;
    const toRead = total - read;
    
    document.getElementById('totalBooks').textContent = total;
    document.getElementById('readBooks').textContent = read;
    document.getElementById('toReadBooks').textContent = toRead;
}

function renderBooks(books) {
    const bookList = document.getElementById('bookList');
    
    if (books.length === 0) {
        bookList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📖</div>
                <div class="empty-state-text">
                    Twoja lista jest pusta.<br>
                    Dodaj pierwszą książkę do przeczytania!
                </div>
            </div>
        `;
        return;
    }
    
    bookList.innerHTML = books.map(book => `
        <div class="book-item ${book.read ? 'read' : ''}">
            <input type="checkbox" 
                   class="book-checkbox" 
                   ${book.read ? 'checked' : ''} 
                   onchange="toggleBook(${book.id}, ${!book.read})">
            <div class="book-icon">${book.read ? '✅' : '📕'}</div>
            <div class="book-info">
                <div class="book-title">${book.title}</div>
                <div class="book-author">${book.author || 'Nieznany autor'}</div>
            </div>
            <button class="delete-btn" onclick="deleteBook(${book.id})">Usuń</button>
        </div>
    `).join('');
}

async function addBook() {
    const titleInput = document.getElementById('titleInput');
    const authorInput = document.getElementById('authorInput');
    
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    
    if (!title) {
        alert('Podaj tytuł książki!');
        return;
    }
    
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author })
        });
        
        titleInput.value = '';
        authorInput.value = '';
        titleInput.focus();
        loadBooks();
    } catch (error) {
        console.error('Błąd podczas dodawania książki:', error);
    }
}

async function toggleBook(id, read) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ read })
        });
        
        loadBooks();
    } catch (error) {
        console.error('Błąd podczas aktualizacji książki:', error);
    }
}

async function deleteBook(id) {
    if (!confirm('Czy na pewno chcesz usunąć tę książkę?')) return;
    
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        loadBooks();
    } catch (error) {
        console.error('Błąd podczas usuwania książki:', error);
    }
}