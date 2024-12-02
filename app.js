const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const orderSelect = document.getElementById("orderSelect");
const bookList = document.getElementById("bookList");

const categorySelect = document.getElementById("categorySelect");
const freeCheckbox = document.getElementById("freeCheckbox");
const paidCheckbox = document.getElementById("paidCheckbox");
const fullCheckbox = document.getElementById("fullCheckbox");
const partialCheckbox = document.getElementById("partialCheckbox");

const API_URL = "https://www.googleapis.com/books/v1/volumes?q=";

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

searchBtn.addEventListener("click", async () => {
    let query = searchInput.value.trim();

    if (query === "") {
        alert("Please enter a book title or author.");
        return;
    }

    const orderBy = orderSelect.value;

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

    let url = `${API_URL}${fullQuery}&orderBy=${orderBy}&maxResults=20`;

    if (filter) {
        url += `&filter=${filter}`;
    }

    // For debugging: Log the final URL
    console.log("Request URL:", url);

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.items) {
            displayBooks(data.items);
        } else {
            bookList.innerHTML = "<p>No books found.</p>";
        }
    } catch (error) {
        console.error("Fetch error:", error);
        bookList.innerHTML = "<p>Error fetching data.</p>";
    }
});

function displayBooks(books) {
    bookList.innerHTML = ""; // Clear previous results

    books.forEach(book => {
        const bookInfo = book.volumeInfo;
        const saleInfo = book.saleInfo;

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
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const orderSelect = document.getElementById("orderSelect");
const bookList = document.getElementById("bookList");

const categorySelect = document.getElementById("categorySelect");
const freeCheckbox = document.getElementById("freeCheckbox");
const paidCheckbox = document.getElementById("paidCheckbox");
const fullCheckbox = document.getElementById("fullCheckbox");
const partialCheckbox = document.getElementById("partialCheckbox");

const API_URL = "https://www.googleapis.com/books/v1/volumes?q=";

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

searchBtn.addEventListener("click", async () => {
    let query = searchInput.value.trim();

    if (query === "") {
        alert("Please enter a book title or author.");
        return;
    }

    const orderBy = orderSelect.value;

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

    let url = `${API_URL}${fullQuery}&orderBy=${orderBy}&maxResults=20`;

    if (filter) {
        url += `&filter=${filter}`;
    }

    // For debugging: Log the final URL
    console.log("Request URL:", url);

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.items) {
            displayBooks(data.items);
        } else {
            bookList.innerHTML = "<p>No books found.</p>";
        }
    } catch (error) {
        console.error("Fetch error:", error);
        bookList.innerHTML = "<p>Error fetching data.</p>";
    }
});

function displayBooks(books) {
    bookList.innerHTML = ""; // Clear previous results

    books.forEach(book => {
        const bookInfo = book.volumeInfo;
        const saleInfo = book.saleInfo;

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