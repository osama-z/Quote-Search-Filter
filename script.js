const searchInput = document.getElementById('search-input');
const quotesList = document.getElementById('quotes-list');
const errorMessage = document.getElementById('error-message');
const loadingIndicator = document.getElementById('loading');
const resultCount = document.getElementById('result-count');

let allQuotes = [];
const API_URL = 'https://dummyjson.com/quotes';

async function fetchQuotes() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error!`);
        }
        const data = await response.json();
        allQuotes = data.quotes;
        
        loadingIndicator.hidden = true;
        
        displayQuotes(allQuotes);
        updateResultCount(allQuotes.length);    // update the result count
        
    } catch (error) {
        console.error('Error fetching quotes:', error);

        loadingIndicator.hidden = true;
        errorMessage.hidden = false; // Show error message
    }
}
/**
  @param {Array<{text: string , author: string}>} quotes - Array of quote objects to display
 */

function displayQuotes(quotes) {
    quotesList.innerHTML = '';  //clear <ul> in html
    
    const searchTerm = searchInput.value.trim().toLowerCase(); // get search term  for highlighting
    
    if (quotes.length === 0) {
        const noResults = document.createElement('li');
        noResults.textContent = 'No quotes match your search.';
        noResults.style.textAlign = 'center';
        noResults.style.padding = '20px';
        noResults.style.color = '#666';
        quotesList.appendChild(noResults);
        return;
    }
    
    quotes.forEach(quote => {
        const quoteItem = document.createElement('li');
        
        const quoteText = document.createElement('p');
        quoteText.className = 'quote-text';
        
        if (searchTerm && quote.quote.toLowerCase().includes(searchTerm)) {   // add highlight if search term is present
            const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi'); // user input wont break or make errors (misuse of regex)
            quoteText.innerHTML = quote.quote.replace(regex, '<span class="highlight">$1</span>');
        } else {
            quoteText.textContent = quote.quote;
        }
        const quoteAuthor = document.createElement('p');
        quoteAuthor.className = 'quote-author';
        quoteAuthor.textContent = `— ${quote.author}`;
        
        quoteItem.appendChild(quoteText);
        quoteItem.appendChild(quoteAuthor);
        quotesList.appendChild(quoteItem);
    });
}

/**
 * @param {string} string 
 * @return {string} 
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function filterQuotes() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
        displayQuotes(allQuotes);
        updateResultCount(allQuotes.length);
        return;
    }
    const filteredQuotes = allQuotes.filter(quote => 
        quote.quote?.toLowerCase().includes(searchTerm)
    );
    displayQuotes(filteredQuotes);
    updateResultCount(filteredQuotes.length);
}

/**
 * @param {number} count - number of quotes found
 */
function updateResultCount(count) {
    const total = allQuotes.length;
    if (searchInput.value.trim() === '') {
        resultCount.textContent = `Showing all ${total} quotes`;
    } else {
        resultCount.textContent = `Found ${count} of ${total} quotes`;
    }
}
searchInput.addEventListener('input', filterQuotes);
document.addEventListener('DOMContentLoaded', fetchQuotes);