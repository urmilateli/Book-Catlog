const API_URL = 'https://www.googleapis.com/books/v1/volumes?q=';
const DEFAULT_QUERY = 'popular books'; // Default search term

// Function to fetch books from the Google Books API
async function fetchBooks(query) {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '<p>Loading...</p>'; // Show loading message

    try {
        const response = await fetch(`${API_URL}${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        displayBooks(data.items || []); // Display books after fetching
    } catch (error) {
        console.error('Error fetching data:', error);
        bookList.innerHTML = '<p>Error fetching data. Please try again later.</p>'; // Show error message
    }
}

// Function to display books in the book list
function displayBooks(books) {
    const bookList = document.getElementById('bookList');
    const bookDetails = document.getElementById('bookDetails'); // To hide details when a new list is shown
    bookList.innerHTML = '';

    if (books.length === 0) {
        bookList.innerHTML = '<p>No books found.</p>';
        return;
    }

    // Hide book details when showing a new list
    bookDetails.style.display = 'none';

    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');
        const bookInfo = book.volumeInfo;
        bookItem.innerHTML = `
            <img src="${bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150'}" alt="Book Cover">
            <h2>${bookInfo.title}</h2>
            <p><strong>Author:</strong> ${bookInfo.authors ? bookInfo.authors.join(', ') : 'Unknown'}</p>
        `;
        
        // Adding click event listener to show book details
        bookItem.addEventListener('click', () => showBookDetails(book));
        bookList.appendChild(bookItem);
    });
}

// Function to show details of a selected book
function showBookDetails(book) {
    const bookInfo = book.volumeInfo;
    const bookId = book.id;  // Get the book ID

    try {
        // Create a new window or tab with the book details
        const bookWindow = window.open('', '_blank');
        bookWindow.document.write(`
            <html>
            <head>
                <title>${bookInfo.title}</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        margin: 20px;
                        background-color: #f0f8ff;
                        color: #333;
                    }
                    .book-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 20px;
                        max-width: 800px;
                        margin: auto;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 10px;
                        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
                    }
                    img {
                        max-width: 100%;
                        height: auto;
                        border-radius: 10px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    .details {
                        text-align: center;
                    }
                    h2 {
                        margin: 10px 0;
                        font-size: 24px;
                        color: #0073e6;
                    }
                    p {
                        margin: 5px 0;
                        font-size: 16px;
                        color: #555;
                    }
                    .button {
                        display: inline-block;
                        margin-top: 15px;
                        padding: 12px 25px;
                        background-color: #007BFF;
                        color: #fff;
                        text-decoration: none;
                        border-radius: 5px;
                        font-size: 16px;
                        transition: background-color 0.3s ease;
                    }
                    .button:hover {
                        background-color: #0056b3;
                    }
                    .back-button {
                        margin-top: 20px;
                        padding: 10px 15px;
                        background-color: #6c757d;
                        color: #fff;
                        text-decoration: none;
                        border-radius: 5px;
                        font-size: 16px;
                    }
                    .back-button:hover {
                        background-color: #5a6268;
                    }
                    iframe {
                        width: 100%;
                        height: 600px;
                        border: none;
                        border-radius: 10px;
                        box-shadow: 0 4px 8px rgba(0, 5, 0, 0);
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="book-container">
                    <img src="${bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : 'https://via.placeholder.com/200x300'}" alt="Book Cover">
                    <div class="details">
                        <h2>${bookInfo.title}</h2>
                        <p><strong>Author:</strong> ${bookInfo.authors ? bookInfo.authors.join(', ') : 'Unknown'}</p>
                        <p><strong>Published:</strong> ${bookInfo.publishedDate || 'N/A'}</p>
                        <p><strong>Publisher:</strong> ${bookInfo.publisher || 'N/A'}</p>
                        <p><strong>Description:</strong> ${bookInfo.description || 'No description available.'}</p>
                        <a href="#" class="button" onclick="openBook('${bookId}')">Read this book</a>
                        <a href="#" class="back-button" onclick="window.close()">Back</a>
                    </div>
                    <iframe id="bookViewer" style="display:none;"></iframe>
                </div>

                <script>
                    function openBook(bookId) {
                        const viewer = document.getElementById('bookViewer');
                        viewer.style.display = 'block';
                        viewer.src = 'https://books.google.com/books?id=' + bookId + '&printsec=frontcover&output=embed';
                    }
                </script>
            </body>
            </html>
        `);
        bookWindow.document.close();
    } catch (error) {
        alert('Error opening book details. Please try again.');
        console.error('Error:', error);
    }
}

// Load default books on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchBooks(DEFAULT_QUERY);
});

document.getElementById('search').addEventListener('input', (event) => {
    const query = event.target.value;
    if (query.length > 2) {  // Fetch books when the search query is at least 3 characters long
        fetchBooks(query);
    }
});




