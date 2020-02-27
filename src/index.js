const QUOTES_URL = 'http://localhost:3000/quotes';
const LIKES_URL = 'http://localhost:3000/likes';
const QUOTES_LIKES_URL = 'http://localhost:3000/quotes?_embed=likes';

const quoteListEl = document.getElementById('quote-list');
const formEl = document.querySelector('form');

// api get,post,patch
const API = {
	getQuotesLikes: () => fetch(QUOTES_LIKES_URL).then((response) => response.json()),
	// post quote
	postQuote: (quote) =>
		fetch(QUOTES_URL, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(quote)
		}).then((response) => response.json()),
	deleteQuote: (quote) =>
		fetch(`${QUOTES_URL}/${quote.id}`, {
			method: 'DELETE'
		}).then((res) => res.json()),
	postLike: (quote, likeSpan) => {
		return fetch(`${LIKES_URL}`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				quoteId: quote.id
			})
		})
			.then((response) => response.json())
			.then((likeSpan.innerText = parseInt(likeSpan.innerText) + 1));
	}
};
// like function

// delete function
const deleteQuote = (quote, liEl) => {
	API.deleteQuote(quote).then(() => {
		liEl.remove();
	});
};
// render quotes
const renderQuotesLikes = (quoteslikes) => {
	quoteslikes.forEach((quoteandlike) => renderQuoteandLike(quoteandlike));
};
// render quote and like
const renderQuoteandLike = (quoteandlike) => {
	//li element
	const liEl = document.createElement('li');
	liEl.className = 'quote-card';
	// blockquote element
	const blockquoteEl = document.createElement('blockquote');
	blockquoteEl.className = 'blockquote';
	// create p
	const pEl = document.createElement('p');
	pEl.className = 'mb-0';
	pEl.innerText = quoteandlike.quote;
	// create footer
	const footerEl = document.createElement('footer');
	footerEl.className = 'blockquote-footer';
	footerEl.innerText = quoteandlike.author;
	// create like button
	const likeBtnEl = document.createElement('button');
	likeBtnEl.className = 'btn-success';
	likeBtnEl.innerText = 'Likes  ';
	// like evenet listener
	likeBtnEl.addEventListener('click', () => API.postLike(quoteandlike, likeSpan));
	// span element
	const likeSpan = document.createElement('span');
	likeSpan.innerText = quoteandlike.likes ? quoteandlike.likes.length : 0;
	likeBtnEl.appendChild(likeSpan);
	//create delete button
	const deleteBtnEl = document.createElement('button');
	deleteBtnEl.className = 'btn-danger';
	deleteBtnEl.innerText = 'Delete';
	// delete event listener
	deleteBtnEl.addEventListener('click', (e) => deleteQuote(quoteandlike, liEl));
	//append elements
	liEl.append(blockquoteEl);
	blockquoteEl.append(pEl, footerEl, likeBtnEl, deleteBtnEl);
	quoteListEl.append(liEl);
};
// send quote data
const handleFormSubmit = (event) => {
	event.preventDefault();

	const quote = {
		quote: event.target.elements.quote.value,
		author: event.target.elements.author.value
	};
	API.postQuote(quote).then((savedQuote) => renderQuoteandLike(savedQuote));
};
// event listeners for form
formEl.addEventListener('submit', handleFormSubmit);

API.getQuotesLikes().then((quoteslikes) => renderQuotesLikes(quoteslikes));
