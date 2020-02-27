const API_URL = "http://localhost:3000";
const QUOTES_URL = `${API_URL}/quotes`;
const LIKES_URL = `${API_URL}/likes`;
const QUOTES_WITH_LIKES_URL = `${API_URL}/quotes?_embed=likes`;
const quotesList = document.getElementById("quote-list");

//render each quote
const renderQuote = quote => {
  const newQuote = document.createElement("li");
  newQuote.className = "quote-card";

  const blockQuote = document.createElement("blockquote");
  blockQuote.className = "blockquote";

  const quoteContent = document.createElement("p");
  quoteContent.innerText = quote.quote;
  blockQuote.append(quoteContent);

  const quoteFooter = document.createElement("footer");
  quoteFooter.className = "blockquote-footer";
  quoteFooter.innerText = quote.author;
  blockQuote.append(quoteFooter);

  const likeSpan = document.createElement("span");
  likeSpan.innerText = quote.likes.length;

  const likeButton = document.createElement("button");
  likeButton.innerText = "Likes: ";
  likeButton.className = "btn-success";
  likeButton.addEventListener("click", () => addLikes(quote, likeSpan));

  likeButton.append(likeSpan);
  blockQuote.append(likeButton);

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Delete";
  deleteButton.className = "btn-danger";
  deleteButton.addEventListener("click", () => deleteQuote(quote, newQuote));
  blockQuote.append(deleteButton);

  newQuote.append(blockQuote);
  quotesList.append(newQuote);
};
//iterate through each quote calling render on each of them
const renderQuotes = quotes => {
  quotes.forEach(quote => renderQuote(quote));
};

//add quote
const formEl = document.getElementById("new-quote-form");

const postQuote = quote => {
  return fetch(QUOTES_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(quote)
  }).then(res => res.json());
};

formEl.addEventListener("submit", event => {
  event.preventDefault();
  postQuote({
    quote: event.target.elements.quote.value,
    author: event.target.elements.author.value,
    likes: []
  })
    .then(renderQuote)
    .then(() => event.target.reset());
});

//delete quote
const deleteQuote = (quote, quoteItem) => {
  fetch(`${QUOTES_URL}/${quote.id}`, {
    method: "DELETE"
  }).then(() => {
    quoteItem.remove();
  });
};

//add likes

const addLikes = (quote, span) => {
  fetch(`${LIKES_URL}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({ quoteId: quote.id })
  })
    .then(res => res.json())
    .then(data => {
      span.innerText = parseInt(span.innerText) + 1;
    });
};

//fetch quotes with likes
const getQuotesData = () => {
  fetch(QUOTES_WITH_LIKES_URL)
    .then(resp => resp.json())
    .then(quotes => renderQuotes(quotes));
};

document.addEventListener("click", getQuotesData());
