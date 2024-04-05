const db = require("../model/index");
const message = require("../config/message");
const { where } = require("sequelize");

const { book, error } = message;
const Book = db.books;
const User = db.users;

const addBook = async (req, res) => {
  try {
    const user = req.user;
    const {
      name,
      description,
      no_of_page,
      author,
      category,
      price,
      released_year,
    } = req.body;

    if (
      (name &&
        description &&
        no_of_page &&
        author &&
        category &&
        price &&
        released_year) === undefined
    ) {
      return res
        .status(400)
        .json({ success: false, message: error.allFeildRequired });
    }
    await Book.create({
      name,
      description,
      no_of_page,
      author,
      category,
      price,
      released_year,
      userId: user.id,
    });
    return res.status(201).json({ success: true, message: book.newBookCreate });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllBook = async (req, res) => {
  try {
    const user = req.user;
    const bookList = await Book.findAll({ where: { userId: user.id } });
    if (!bookList) {
      return res.status(404).json({ message: book.bookNotFound });
    }
    return res.status(200).json({ AllBook: bookList });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getOneBook = async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const bookDetail = await Book.findOne({
      where: { userId: user.id, id: id },
    });
    if (!bookDetail) {
      return res.status(404).json({ message: book.bookNotFound });
    }
    return res.status(200).json({ Book: bookDetail });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const { name, description, no_of_page,author,category,price, released_year} = req.body;

    const updateBook = await Book.update(
      {
        name,
        description,
        no_of_page,
        author,
        category,
        price,
        released_year,
      },
      { where: { userId: user.id, id: id } }
    );

    if (!updateBook) {
      return res.status(404).json({ message: book.bookNotFound });
    }

    return res.status(200).json({ message: book.updateBook });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const user=req.user;
    const id = req.params.id;

    const deleteBook=await Book.destroy({where:{userId:user.id,id}});
    if (!deleteBook) {
      return res.status(404).json({ message:book.bookNotFound });
    }

    return res.status(200).json({ message:book.deleteBook });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { addBook, getAllBook, getOneBook, updateBook,deleteBook };
