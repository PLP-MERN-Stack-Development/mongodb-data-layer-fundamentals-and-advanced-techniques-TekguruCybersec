
//TASK 2: Basic Queries
// Query to find all books in the "fiction" genre
db.books.find({ genre: "Fiction" });

// Query to find books published after the year 2000
db.books.find({ published_year: { $gt: 1980 } });

// Query to find books by a specific author
db.books.find({ author: "George Orwell" });

// Query to find prices of a specific book
db.books.find({ title: "1984" }, { price: 1, _id: 0 });

// Delete a book by title
db.books.deleteOne({ title: "The Great Gatsby" });

//TASK 3: Advanced Queries

//// 1. Find books that are both in stock and published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 } });

// 2. Use projection to return only the title, author, and price fields
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 });

// 3. Implement sorting to display books by price

// 3a. Sort by price in ascending order (lowest to highest)
db.books.find().sort({ price: 1 }); // Ascending order

// 3b. Sort by price in descending order (highest to lowest)
db.books.find().sort({ price: -1 }); // Descending order

//  Use `limit` and `skip` methods to implement pagination (5 books per page)
//  Get the first page (first 5 books)
db.books.find().limit(5);

//  Get the second page (next 5 books, skipping the first 5)
db.books.find().skip(5).limit(5);


// Task 4: Aggregation Queries

// Create an aggregation pipeline to calculate the average price of books by genre
db.books.aggregate([{$group: {_id: "$genres", averagePrice: { $avg: "$price" }} },{ $sort: { averagePrice: -1 } }]);



// Create an aggregation pipeline to count the number of books by each author
db.books.aggregate([{$group: {_id: "$author", bookCount: { $sum: 1 }} },{ $sort: { bookCount: -1 } }]);

// Implement a pipeline that groups books by publication decade and counts them 
db.books.aggregate([
  {
    $group: {
      _id: { $subtract: [ "$publicationYear", { $mod: [ "$publicationYear", 10 ] } ] },
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } },
  {
    $project: {
        _id: 0,
        decade: "$_id",
        count: 1
    }
  }
]);

//Task 5: Indexing

// 1. Create an index on the `title` field for faster searches
db.books.createIndex({ title: 1 });

// 2. Create a compound index on `author` and `publicationYear`
db.books.createIndex({ author: 1, publicationYear: -1 });

// 3. Use the `explain()` method to demonstrate performance improvement
db.books.find({ title: "The Midnight Library" }).explain("executionStats");

// 3b. Explain a query that benefits from the compound index    
db.books.find({ author: "Matt Haig" }).sort({ publicationYear: -1 }).explain("executionStats");
