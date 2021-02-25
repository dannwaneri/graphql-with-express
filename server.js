const express = require("express");
const { graphqlHTTP: expressGraphQl } = require("express-graphql");
const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
} = require("graphql");

const books = require("./books");
const authors = require("./authors");

const app = express();

const AuthorType = new GraphQLObjectType({
	name: "Author",
	description: "This represents a particular author that writes a book.",
	fields: () => ({
		id: {
			type: new GraphQLNonNull(GraphQLInt),
		},
		name: {
			type: new GraphQLNonNull(GraphQLString),
		},
		books: {
			type: new GraphQLList(BookType),
			description: "The books that belond to a particular author",
			resolve: (author) => books.filter((book) => book.authorId === author.id),
		},
	}),
});

const BookType = new GraphQLObjectType({
	name: "Book",
	description: "This represents a particular book.",
	fields: () => ({
		isbn: {
			type: new GraphQLNonNull(GraphQLString),
			description: "The book's unique identifier.",
		},
		title: { type: new GraphQLNonNull(GraphQLString) },
		subtitle: { type: new GraphQLNonNull(GraphQLString) },
		authorId: { type: new GraphQLNonNull(GraphQLInt) },
		published: { type: new GraphQLNonNull(GraphQLString) },
		publisher: { type: new GraphQLNonNull(GraphQLString) },
		pages: { type: new GraphQLNonNull(GraphQLInt) },
		description: { type: new GraphQLNonNull(GraphQLString) },
		website: { type: new GraphQLNonNull(GraphQLString) },
		author: {
			type: AuthorType,
			description: "The author of a particular book.",
			resolve: (book) => authors.find((author) => author.id === book.authorId),
		},
	}),
});

const RootQueryType = new GraphQLObjectType({
	name: "Query",
	description: "Root query",
	fields: () => ({
		authors: {
			type: new GraphQLList(AuthorType),
			description: "This represents the list of all authors.",
			resolve: () => authors,
		},
		books: {
			type: new GraphQLList(BookType),
			description: "This represents the list of all books.",
			resolve: () => books,
		},
		book: {
			type: BookType,
			description: "This represents a single book with a specified isbn.",
			args: {
				isbn: { type: GraphQLString },
			},
			resolve: (parent, args) => books.find((book) => book.isbn === args.isbn),
		},
		author: {
			type: AuthorType,
			description: "This represents a single author with a specifed id.",
			args: {
				id: { type: GraphQLInt },
			},
			resolve: (parent, args) =>
				authors.find((author) => author.id === args.id),
		},
	}),
});

const schema = new GraphQLSchema({
	query: RootQueryType,
});

app.use(
	"/graphql",
	expressGraphQl({
		schema,
		graphiql: true,
	})
);

app.listen(5000, () => console.log("Server running..."));
