const db = require("../conn");
const message = require("../config/message");
const { where } = require("sequelize");

const { book, error } = message;
const Book = db.book;
const User = db.user;

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
      (name ||
        description ||
        no_of_page ||
        author ||
        category ||
        price ||
        released_year) === undefined
    ) {
      return res
        .status(400)
        .json({ success: false, message: error.allFieldRequired });
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
    const { id } = req.user;
    const bookList=await Book.findAll({include: [{ model: User,attributes:['id','name','email']}],attributes:['id','name','description','author','price'],where:{ userId: id}});
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
    const { id } = req.user;
    const _id = req.params.id;
    const bookDetail = await Book.findOne({
      where: { userId: id, id: _id },
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
    const { id } = req.user;
    const _id = req.params.id;
    const {
      name,
      description,
      no_of_page,
      author,
      category,
      price,
      released_year,
    } = req.body;

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
      { where: { userId: id, id: _id } }
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
    const { id } = req.user;
    const _id = req.params.id;

    const deleteBook = await Book.destroy({ where: { userId: id, id: _id } });
    if (!deleteBook) {
      return res.status(404).json({ message: book.bookNotFound });
    }
    return res.status(200).json({ message: book.deleteBook });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { addBook, getAllBook, getOneBook, updateBook, deleteBook };
