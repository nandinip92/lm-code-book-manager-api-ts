import { Request, Response } from "express";
import * as bookService from "../services/books";

export const getBooks = async (req: Request, res: Response) => {
	const books = await bookService.getBooks();
	res.json(books).status(200);
};

export const getBook = async (req: Request, res: Response) => {
	const bookId = req.params.bookId;
	const book = await bookService.getBook(Number(bookId));

	if (book) {
		res.json(book).status(200);
	} else {
		res.status(404).json("Not found");
	}
};

export const saveBook = async (req: Request, res: Response) => {
	const bookToBeSaved = req.body;
	// try {
	// 	const book = await bookService.saveBook(bookToBeSaved);
	// 	res.status(201).json(book);
	// } catch (error) {
	// 	res.status(400).json({ message: (error as Error).message });
	// }
	try {
		const checkIfBookExists = await bookService.getBook(
			Number(bookToBeSaved.bookId)
		);
		if (checkIfBookExists !== null) {
			throw new Error(
				`Book ${bookToBeSaved.bookId} already exists. BookId must be unique`
			);
		}
		const book = await bookService.saveBook(bookToBeSaved);
		res.status(201).json(book);
	} catch (error) {
		res.status(400).json({ Error: (error as Error).message });
		//res.status(400).json({ error: error as Error });
	}
};

// User Story 4 - Update Book By Id Solution
export const updateBook = async (req: Request, res: Response) => {
	const bookUpdateData = req.body;
	const bookId = Number.parseInt(req.params.bookId);

	const book = await bookService.updateBook(bookId, bookUpdateData);
	res.status(204).json(book);
};

//User Story 5 - Delete Book by Id Solution
export const deleteBook = async (req: Request, res: Response) => {
	const bookId = req.params.bookId;
	try {
		const book = await bookService.deleteBook(Number(bookId));
		if (book === 1) {
			res.status(200).json(`Book ${bookId} deleted successfully...!`);
		} else {
			throw new Error(`Book ${bookId} Not Found`);
		}
	} catch (error) {
		res.status(400).json({ Error: (error as Error).message });
	}
};
