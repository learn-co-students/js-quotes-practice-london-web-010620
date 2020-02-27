const QUOTES_LIKES_URL = "http://localhost:3000/quotes?_embed=likes";
const QUOTES_URL = "http://localhost:3000/quotes";
const LIKES_URL = "http://localhost:3000/likes";
let quoteUl = document.getElementById("quote-list");

const iterateQuotes = quotes => {
  console.log(quotes);
  quotes.forEach(renderQuotes);
};

const renderQuotes = quote => {
  let listEl = document.createElement("li");
  let blockQuoteEl = document.createElement("blockquote");
  let pEl = document.createElement("p");
  let footerEl = document.createElement("footer");
  let brEl = document.createElement("br");
  let likeButtonEl = document.createElement("button");
  let spanEl = document.createElement("span");
  let deleteButtonEl = document.createElement("button");
  listEl.className = "quote-card";
  blockQuoteEl.className = "blockquote";
  pEl.className = "mb-0";
  pEl.innerText = quote.quote;
  footerEl.className = "blockquote-footer";
  footerEl.innerText = quote.author;
  likeButtonEl.className = "btn-success";
  likeButtonEl.innerText = "Likes:";
  likeButtonEl.addEventListener("click", () => postLike(quote, spanEl));
  spanEl.innerText = quote.likes.length;
  deleteButtonEl.className = "btn-danger";
  deleteButtonEl.innerText = "Delete";
  deleteButtonEl.addEventListener("click", () =>
    deleteQuote(quote, listEl, blockQuoteEl)
  );
  quoteUl.append(listEl, blockQuoteEl);
  blockQuoteEl.append(pEl, footerEl, brEl, likeButtonEl, deleteButtonEl);
  likeButtonEl.append(spanEl);
};

/* <li class='quote-card'>
<blockquote class="blockquote">
  <p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
  <footer class="blockquote-footer">Someone famous</footer>
  <br>
  <button class='btn-success'>Likes: <span>0</span></button>
  <button class='btn-danger'>Delete</button>
</blockquote>
</li> */

const deleteQuote = (quote, listEl, blockQuoteEl) => {
  console.log(quote, listEl);
  return fetch(`${QUOTES_URL}/${quote.id}`, {
    method: "DELETE"
  }).then(listEl.remove(), blockQuoteEl.remove());
};

const formEl = document.getElementById("new-quote-form");
formEl.addEventListener("submit", e => {
  console.log(e.target.elements.author.value);
  e.preventDefault();
  postQuote({
    quote: e.target.elements.quote.value,
    author: e.target.elements.author.value,
    likes: []
  })
    .then(renderQuotes)
    .then(() => e.target.reset());
});

const postQuote = quoteObj => {
  return fetch(QUOTES_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(quoteObj)
  }).then(res => res.json());
};

const postLike = (quote, spanEl) => {
  return fetch(LIKES_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      quoteId: quote.id,
      createdAt: Date.now()
    })
  })
    .then(res => res.json())
    .then(data => {
      spanEl.innerText = parseInt(spanEl.innerText) + 1;
    });
};

const requestBase = fetch(QUOTES_LIKES_URL);
const jsonify = response => response.json();
const renderInfo = infoData => {
  iterateQuotes(infoData);
};

requestBase.then(jsonify).then(renderInfo);
