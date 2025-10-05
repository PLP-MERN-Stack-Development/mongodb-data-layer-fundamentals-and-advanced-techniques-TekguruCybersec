Advanced MongoDB Queries for a Book CollectionThis document provides a comprehensive guide to the MongoDB queries written in the queries.js file. 

It covers basic queries, projections, sorting, pagination, advanced aggregation pipelines, and indexing for a sample books collection.Sample Data StructureAll queries are based on a books collection with documents structured like this:{
  "_id": "ObjectId(...)",
  "title": "The Midnight Library",
  "author": "Matt Haig",
  "publicationYear": 2020,
  "genres": ["Fantasy", "Contemporary"],
  "inStock": true,
  "price": 15.99
}
Task 1: Basic QueriesFind books in stock and published after 2010This query finds all books that meet two conditions: they are currently inStock and their publicationYear is greater than 2010.db.books.find({
  inStock: true,
  publicationYear: { $gt: 2010 }
});
Task 2: ProjectionsReturn only specific fields (title, author, price)Projection is used to limit the fields returned in a query's results. This query returns only the title, author, and price for all books, while excluding the default _id field.db.books.find({}, {
  _id: 0,
  title: 1,
  author: 1,
  price: 1
});
Task 3: SortingDisplay books by price (ascending and descending)Ascending Order: Sorts books from the lowest price to the highest.db.books.find().sort({ price: 1 });
Descending Order: Sorts books from the highest price to the lowest.db.books.find().sort({ price: -1 });
Task 4: PaginationImplement pagination with limit and skipPagination is essential for displaying large datasets in smaller chunks. These queries retrieve 5 books per page.Get Page 1: Retrieves the first 5 books.db.books.find().sort({ title: 1 }).limit(5);
Get Page 2: skip(5) bypasses the first 5 books, and limit(5) retrieves the next 5.db.books.find().sort({ title: 1 }).skip(5).limit(5);
Task 5: Aggregation PipelineAggregation pipelines allow for multi-stage data processing to perform complex analysis.Calculate the average price of books by genreThis pipeline calculates the average book price for each genre.$unwind: Creates a separate document for each genre in a book's genres array.$group: Groups the documents by genre and calculates the average price.$sort: Sorts the genres by their average price.db.books.aggregate([
  { $unwind: "$genres" },
  {
    $group: {
      _id: "$genres",
      averagePrice: { $avg: "$price" }
    }
  },
  { $sort: { averagePrice: -1 } }
]);
Find the author with the most booksThis pipeline identifies the author who has written the most books in the collection.$group: Groups by author and counts their books.$sort: Sorts authors by book count in descending order.$limit: Returns only the top author.db.books.aggregate([
  {
    $group: {
      _id: "$author",
      bookCount: { $sum: 1 }
    }
  },
  { $sort: { bookCount: -1 } },
  { $limit: 1 }
]);
Group books by publication decade and count themThis pipeline counts how many books were published in each decade.$group: Groups books by decade, which is calculated mathematically from the publicationYear.$sort: Orders the results chronologically by decade.$project: Renames the _id field to decade for clarity.db.books.aggregate([
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
Task 6: IndexingIndexes improve query performance by allowing MongoDB to find documents more efficiently.Create a single-field index on titleThis index speeds up searches that filter by book title.db.books.createIndex({ title: 1 });
Create a compound index on author and publicationYearThis index supports queries that filter by author and then sort by publicationYear. The order of fields is important.db.books.createIndex({ author: 1, publicationYear: -1 });
Analyze query performance with explain()The explain("executionStats") method shows the query plan and performance statistics. Before indexing, a query performs a slow COLLSCAN (collection scan). After indexing, it performs a much faster IXSCAN (index scan).Using the title index:db.books.find({ title: "The Midnight Library" }).explain("executionStats");
Using the compound author and publicationYear index:db.books.find({ author: "Matt Haig" }).sort({ publicationYear: -1 }).explain("executionStats");
