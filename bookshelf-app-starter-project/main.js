const STORAGE_KEY = "BOOKSHELF_APPS";
let books = [];
document.addEventListener("DOMContentLoaded", function () {
  loadBooksFromStorage();
  renderBooks();
  setupEventListeners();
  createSearchPreviewContainer();
});

function setupEventListeners() {
  const bookForm = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchBook");
  const bookFormIsComplete = document.getElementById("bookFormIsComplete");
  bookForm.addEventListener("submit", handleAddBook);
  searchForm.addEventListener("submit", handleSearchBook);
  bookFormIsComplete.addEventListener("change", updateSubmitButtonText);
  document
    .getElementById("searchBookTitle")
    .addEventListener("input", handleSearchPreview);
  document.addEventListener("click", function (e) {
    if (!e.target.closest("#searchBook")) {
      hideSearchPreview();
    }
  });
}

function createSearchPreviewContainer() {
  const searchInput = document.getElementById("searchBookTitle");
  const searchContainer = document.createElement("div");
  searchContainer.className = "search-container";
  const parent = searchInput.parentNode;
  parent.insertBefore(searchContainer, searchInput);
  searchContainer.appendChild(searchInput);

  const previewDiv = document.createElement("div");
  previewDiv.id = "searchPreview";
  previewDiv.className = "search-preview";
  previewDiv.style.display = "none";
  searchContainer.appendChild(previewDiv);
}

function handleSearchPreview(e) {
  const searchTerm = e.target.value.toLowerCase().trim();
  const previewDiv = document.getElementById("searchPreview");

  if (searchTerm === "") {
    hideSearchPreview();
    renderBooks();
    return;
  }

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm)
  );

  showSearchPreview(filteredBooks, searchTerm);
  renderBooks(filteredBooks);
}

function showSearchPreview(filteredBooks, searchTerm) {
  const previewDiv = document.getElementById("searchPreview");

  if (filteredBooks.length === 0) {
    previewDiv.innerHTML =
      '<div class="search-no-results">Tidak ada buku yang ditemukan</div>';
  } else {
    const previewHTML = filteredBooks
      .slice(0, 5)
      .map((book) => {
        const titleHighlighted = highlightSearchTerm(book.title, searchTerm);
        const authorHighlighted = highlightSearchTerm(book.author, searchTerm);

        return `
                <div class="search-preview-item" onclick="selectSearchResult('${
                  book.title
                }')">
                    <div class="search-preview-title">${titleHighlighted}</div>
                    <div class="search-preview-meta">oleh ${authorHighlighted} • ${
          book.year
        } • ${book.isComplete ? "Selesai dibaca" : "Belum selesai dibaca"}</div>
                </div>
            `;
      })
      .join("");

    previewDiv.innerHTML = previewHTML;
  }

  previewDiv.style.display = "block";
}
function hideSearchPreview() {
  const previewDiv = document.getElementById("searchPreview");
  if (previewDiv) {
    previewDiv.style.display = "none";
  }
}

function highlightSearchTerm(text, searchTerm) {
  if (!searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.replace(
    regex,
    '<mark style="background-color: #f0e8d6; color: #5a4d3a; padding: 1px 2px; border-radius: 2px; border: 1px solid #e6dfd5;">$1</mark>'
  );
}

function selectSearchResult(title) {
  document.getElementById("searchBookTitle").value = title;
  hideSearchPreview();

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(title.toLowerCase())
  );
  renderBooks(filteredBooks);
}

function generateId() {
  return new Date().getTime();
}

function loadBooksFromStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    books = JSON.parse(data);
  }
}

function saveBooksToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function handleAddBook(e) {
  e.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = parseInt(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const newBook = {
    id: generateId(),
    title: title,
    author: author,
    year: year,
    isComplete: isComplete,
  };

  books.push(newBook);
  saveBooksToStorage();
  renderBooks();
  e.target.reset();
  updateSubmitButtonText();
  showNotification("Buku berhasil ditambahkan!");
}

function handleSearchBook(e) {
  e.preventDefault();
  const searchTerm = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();

  if (searchTerm === "") {
    renderBooks();
    return;
  }

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm)
  );

  renderBooks(filteredBooks);
}
function updateSubmitButtonText() {
  const isComplete = document.getElementById("bookFormIsComplete").checked;
  const submitButton = document.getElementById("bookFormSubmit");
  const span = submitButton.querySelector("span");

  if (isComplete) {
    span.textContent = "Selesai dibaca";
  } else {
    span.textContent = "Belum selesai dibaca";
  }
}

function renderBooks(booksToRender = books) {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");
  clearBookList(incompleteBookList);
  clearBookList(completeBookList);

  booksToRender.forEach((book) => {
    const bookElement = createBookElement(book);

    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
}

function clearBookList(container) {
  const children = Array.from(container.children);
  children.forEach((child) => {
    if (child.nodeType === 1) {
      container.removeChild(child);
    }
  });
}

function createBookElement(book) {
  const bookElement = document.createElement("div");
  bookElement.setAttribute("data-bookid", book.id);
  bookElement.setAttribute("data-testid", "bookItem");
  bookElement.className = "book-item";

  const toggleButtonText = book.isComplete
    ? "Belum selesai dibaca"
    : "Selesai dibaca";

  bookElement.innerHTML = `
        <div class="book-main-content">
            <div class="book-cover">
                <span class="book-icon">📖</span>
            </div>
            <div class="book-info">
                <h3 data-testid="bookItemTitle">${book.title}</h3>
                <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
                <p data-testid="bookItemYear">Tahun: ${book.year}</p>
            </div>
        </div>
        <div class="book-actions">
            <button class="btn" data-testid="bookItemIsCompleteButton" onclick="toggleBookStatus(${book.id})">
                ${toggleButtonText}
            </button>
            <div class="book-actions-bottom-row">
                <button class="btn" data-testid="bookItemEditButton" onclick="editBook(${book.id})">
                    Edit Buku
                </button>
                <button class="btn" data-testid="bookItemDeleteButton" onclick="deleteBook(${book.id})">
                    Hapus Buku
                </button>
            </div>
        </div>
    `;

  return bookElement;
}

function toggleBookStatus(bookId) {
  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex !== -1) {
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    saveBooksToStorage();
    renderBooks();

    const action = books[bookIndex].isComplete
      ? 'dipindahkan ke rak "Selesai dibaca"'
      : 'dipindahkan ke rak "Belum selesai dibaca"';
    showNotification(`Buku "${books[bookIndex].title}" ${action}!`);
  }
}

function deleteBook(bookId) {
  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex !== -1) {
    if (
      confirm(
        `Apakah Anda yakin ingin menghapus buku "${books[bookIndex].title}"?`
      )
    ) {
      const deletedBook = books.splice(bookIndex, 1)[0];
      saveBooksToStorage();
      renderBooks();
      showNotification(`Buku "${deletedBook.title}" berhasil dihapus!`);
    }
  }
}
function editBook(bookId) {
  const book = books.find((book) => book.id === bookId);
  if (!book) return;

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Edit Buku</h3>
                <button class="modal-close" onclick="closeEditModal()">&times;</button>
            </div>
            <form id="editForm" onsubmit="handleEditBook(event, ${bookId})">
                <div class="form-group">
                    <label for="editTitle">Judul</label>
                    <input id="editTitle" type="text" value="${
                      book.title
                    }" required />
                </div>
                <div class="form-group">
                    <label for="editAuthor">Penulis</label>
                    <input id="editAuthor" type="text" value="${
                      book.author
                    }" required />
                </div>
                <div class="form-group">
                    <label for="editYear">Tahun</label>
                    <input id="editYear" type="number" value="${
                      book.year
                    }" required />
                </div>
                <div class="form-group">
                    <label class="checkbox-label">
                        <input id="editIsComplete" type="checkbox" ${
                          book.isComplete ? "checked" : ""
                        } />
                        Selesai dibaca
                    </label>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeEditModal()">Batal</button>
                    <button type="submit" class="btn btn-primary">Simpan Perubahan</button>
                </div>
            </form>
        </div>
    `;

  document.body.appendChild(modal);
  setTimeout(() => {
    document.getElementById("editTitle").focus();
  }, 100);
}

function handleEditBook(e, bookId) {
  e.preventDefault();

  const title = document.getElementById("editTitle").value;
  const author = document.getElementById("editAuthor").value;
  const year = parseInt(document.getElementById("editYear").value);
  const isComplete = document.getElementById("editIsComplete").checked;

  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex !== -1) {
    books[bookIndex] = {
      ...books[bookIndex],
      title: title,
      author: author,
      year: year,
      isComplete: isComplete,
    };

    saveBooksToStorage();
    renderBooks();
    closeEditModal();
    showNotification("Buku berhasil diperbarui!");
  }
}

function closeEditModal() {
  const modal = document.querySelector(".modal");
  if (modal) {
    document.body.removeChild(modal);
  }
}

function showNotification(message) {
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    document.body.removeChild(existingNotification);
  }

  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.classList.add("fade-out");
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }
  }, 3000);
}
