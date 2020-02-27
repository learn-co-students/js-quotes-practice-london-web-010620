const QUOTES_URL = "http://localhost:3000/quotes";
const LIKES_URL = "http://localhost:3000/likes";
const QUOTELIKES_URL = `${QUOTES_URL}?_embed=likes`;
const quoteList = document.querySelector("#quote-list");
const formEl = document.querySelector("#new-quote-form");

//NEW QUOTE
const handleFormSubmit = event => {
  event.preventDefault();
  const quote = event.target.elements.quote;
  const author = event.target.elements.author;

  const newQuote = newQuoteObj(quote.value, author.value);
  API.postQuote(newQuote).then(() => {
    event.target.reset();
  });
};
const newQuoteObj = (quote, author) => {
  return {
    quote,
    author,
    likes: []
  };
};

// INCREASE LIKES
const increaseLikes = likeobj => {
  return API.postLike(likeobj);
};

// DELETE QUOTE
const deleteQuote = (quote, quoteListEl) => {
  API.deleteQuote(quote).then(() => {
    quoteListEl.remove();
  });
};

//RENDER QUOTES
const renderQuotes = quotes => {
  quotes.forEach(quote => renderQuote(quote));
};

const renderQuote = quote => {
  const quoteListEl = document.createElement("li");
  quoteListEl.className = "quote-card";

  const blockquote = document.createElement("blockquote");
  blockquote.className = "blockquote";

  const quoteEl = document.createElement("p");
  quoteEl.className = "mb-0";
  quoteEl.innerText = quote.quote;

  const footerEl = document.createElement("footer");
  footerEl.className = "blockquote-footer";
  footerEl.innerText = quote.author;

  const breakEl = document.createElement("br");

  const likeButtonEl = document.createElement("button");
  likeButtonEl.className = "btn-success";
  likeButtonEl.innerText = "Likes: ";
  likeButtonEl.addEventListener("click", () => {
    const constructLikeObject = () => {
      return {
        quoteId: parseInt(quote.id)
      };
    };
    increaseLikes(constructLikeObject());
    spanEl.innerText++;
  });

  const spanEl = document.createElement("span");
  spanEl.innerText = quote.likes.length;

  const deleteButtonEl = document.createElement("button");
  deleteButtonEl.className = "btn-danger";
  deleteButtonEl.innerHTML = "Delete";
  deleteButtonEl.addEventListener("click", () =>
    deleteQuote(quote, quoteListEl)
  );

  likeButtonEl.append(spanEl);
  blockquote.append(quoteEl, footerEl, breakEl, likeButtonEl, deleteButtonEl);
  quoteListEl.append(blockquote);
  quoteList.append(quoteListEl);
};

//POST NEW FORM / PATCH LIKES / PATCH DELETE
const config = (method, obj) => {
  console.log(obj);
  return {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(obj)
  };
};

const postConfig = quote => {
  return config("POST", quote);
};

const postLikeConfig = likeobj => {
  return config("POST", likeobj);
};

formEl.addEventListener("submit", handleFormSubmit);

//API FETCH
const jsonify = response => response.json();
const API = {
  getQuotes: () => fetch(QUOTELIKES_URL).then(jsonify),
  postQuote: quote =>
    fetch(QUOTES_URL, postConfig(quote))
      .then(jsonify)
      .then(quote => renderQuote(quote)),
  postLike: likeobj => fetch(LIKES_URL, postLikeConfig(likeobj)).then(jsonify),
  deleteQuote: quote =>
    fetch(`${QUOTES_URL}/${quote.id}`, {
      method: "DELETE"
    }).then(jsonify)
};

API.getQuotes().then(quotes => renderQuotes(quotes));
