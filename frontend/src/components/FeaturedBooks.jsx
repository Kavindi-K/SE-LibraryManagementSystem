import React from "react";
import "./FeaturedBooks.css";

function FeaturedBooks() {
  return (
    <section id="books" className="featured-books">
      <h2>Featured Books</h2>
      <div className="book-list">
        <div className="book-card">
          <img src="/book.png" alt="Book One" />
          <p>Book One</p>
        </div>
        <div className="book-card">
          <img src="/book2.png" alt="Book Two" />
          <p>Book Two</p>
        </div>
        <div className="book-card">
          <img src="/book3.png" alt="Book Three" />
          <p>Book Three</p>
        </div>
      </div>
    </section>
  );
}

export default FeaturedBooks;
