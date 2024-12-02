const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const orderSelect = document.getElementById("orderSelect");
const bookList = document.getElementById("bookList");

const categorySelect = document.getElementById("categorySelect");
const freeCheckbox = document.getElementById("freeCheckbox");
const paidCheckbox = document.getElementById("paidCheckbox");
const fullCheckbox = document.getElementById("fullCheckbox");
const partialCheckbox = document.getElementById("partialCheckbox");

const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const pageInfo = document.getElementById("pageInfo");
const pagination = document.getElementById("pagination");

const API_URL = "https://www.googleapis.com/books/v1/volumes?q=";

let currentPage = 1;
let totalPages = 1;

// Comprehensive categories list
const categories = [
    "Art",
    "Biography & Autobiography",
    "Business & Economics",
    "Computers",
    "Cooking",
    "Education",
    "Fiction",
    "Health & Fitness",
    "History",
    "Humor",
    "Literary Collections",
    "Mathematics",
    "Medical",
    "Music",
    "Philosophy",
    "Poetry",
    "Psychology",
    "Religion",
    "Science",
    "Self-Help",
    "Technology & Engineering",
    "Travel",
    // Add more categories as needed
];

// Populate category select options
categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
});

// Initialize Choices.js on the categorySelect element
const choices = new Choices('#categorySelect', {
    removeItemButton: true,
    searchPlaceholderValue: 'Search categories...',
});

searchBtn.addEventListener("click", () => {
    currentPage = 1;
    searchBooks();
});

prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        searchBooks();
    }
});

nextPageBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;
        searchBooks();
    }
});

async function searchBooks() {
    const query = searchInput.value.trim();
    const orderBy = orderSelect.value;

    if (query === "") {
        alert("Please enter a book title or author.");
        return;
    }

    // Get selected categories
    const selectedCategories = choices.getValue(true).map(value => `subject:"${value}"`);

    // Build category part of query
    let categoryQuery = "";
    if (selectedCategories.length > 0) {
        categoryQuery = `+(${selectedCategories.join(" OR ")})`;
    }

    // Encode the search term and categories separately
    const encodedQuery = encodeURIComponent(query);
    let fullQuery = `${encodedQuery}`;

    if (categoryQuery) {
        fullQuery += categoryQuery; // Do not encode the '+' and the rest
    }

    // Build filter parameters
    let filter = "";
    if (freeCheckbox.checked) {
        filter = freeCheckbox.value;
    } else if (paidCheckbox.checked) {
        filter = paidCheckbox.value;
    } else if (fullCheckbox.checked) {
        filter = fullCheckbox.value;
    } else if (partialCheckbox.checked) {
        filter = partialCheckbox.value;
    }
    // Note: The 'filter' parameter accepts only one value.

    let url = `${API_URL}${fullQuery}&maxResults=10&startIndex=${(currentPage - 1) * 10}`;

    if (filter) {
        url += `&filter=${filter}`;
    }

    // For debugging: Log the final URL
    console.log("Request URL:", url);

    try {
        const response = await fetch(url);
        const data = await response.json();

        // For debugging: Log the API response
        console.log("API Response:", data);

        if (data.items) {
            let books = data.items;
            totalPages = Math.ceil(data.totalItems / 10);

            // Sort by price if selected
            if (orderBy === "price-asc") {
                books.sort((a, b) => {
                    const priceA = a.saleInfo.retailPrice ? a.saleInfo.retailPrice.amount : Infinity;
                    const priceB = b.saleInfo.retailPrice ? b.saleInfo.retailPrice.amount : Infinity;
                    return priceA - priceB;
                });
            } else if (orderBy === "price-desc") {
                books.sort((a, b) => {
                    const priceA = a.saleInfo.retailPrice ? a.saleInfo.retailPrice.amount : -Infinity;
                    const priceB = b.saleInfo.retailPrice ? b.saleInfo.retailPrice.amount : -Infinity;
                    return priceB - priceA;
                });
            }

            displayBooks(books);
            updatePagination();
        } else {
            bookList.innerHTML = "<p>No books found.</p>";
            updatePagination();
        }
    } catch (error) {
        console.error("Fetch error:", error);
        bookList.innerHTML = "<p>Error fetching data.</p>";
        updatePagination();
    }
}

function displayBooks(books) {
    bookList.innerHTML = ""; // Clear previous results

    books.forEach(book => {
        const bookInfo = book.volumeInfo;
        const saleInfo = book.saleInfo;

        // For debugging: Log book sale information
        console.log("Book Sale Info:", saleInfo);

        const bookElement = document.createElement("div");
        bookElement.classList.add("book");

        const bookImage = bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : "https://via.placeholder.com/128x192";
        const bookTitle = bookInfo.title || "No title available";
        const bookAuthor = bookInfo.authors ? bookInfo.authors.join(", ") : "Unknown author";
        const bookCategories = bookInfo.categories ? bookInfo.categories.join(", ") : "No category";
        const bookPrice = saleInfo && saleInfo.saleability === "FOR_SALE" && saleInfo.retailPrice ? `${saleInfo.retailPrice.currencyCode} ${saleInfo.retailPrice.amount}` : "Not for sale";
        const previewLink = bookInfo.previewLink || "#";

        bookElement.innerHTML = `
            <img src="${bookImage}" alt="${bookTitle}">
            <div class="book-details">
                <h3>${bookTitle}</h3>
                <p>by ${bookAuthor}</p>
                <p>Categories: ${bookCategories}</p>
                <p>Price: ${bookPrice}</p>
                <a href="${previewLink}" target="_blank">Preview</a>
            </div>
        `;
        bookList.appendChild(bookElement);
    });
}

function updatePagination() {
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
    pagination.style.display = totalPages > 1 ? "flex" : "none"; // Show pagination controls only if there are multiple pages
}