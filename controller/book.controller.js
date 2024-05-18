const db = require("../conn");
const message = require("../config/message");
const { where, Op } = require("sequelize");

const { book, error } = message;
const Book = db.book;
const User = db.user;

const add = async (req, res) => {
  try {
    const user = req.user;
    const {
      name,
      description,
      no_of_pages,
      author,
      category,
      price,
      released_year,
    } = req.body;

    if (
      (name ||
        description ||
        no_of_pages ||
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
      no_of_pages,
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

const getAll = async (req, res) => {
  try {
    const { id } = req.user;
    // const { page, limit } = req.query;
    // const pageCount = Number(page) || 1;
    // const limitDoc = Number(limit) || 5;
    // const totalBooks = await Book.count({ where: { userId: id } });
    // const maxPage =
    //   totalBooks <= limitDoc ? 1 : Math.ceil(totalBooks / limitDoc);

    // if (pageCount > maxPage) {
    //   return res
    //     .status(400)
    //     .json({ message: `There are only ${maxPage} page.` });
    // }

    // const skip = (pageCount - 1) * limitDoc;
    const bookList = await Book.findAll({
      include: [{ model: User, attributes: ["id", "name", "email"] }],
      where: { userId: id },
      // offset: skip,
      // limit: limitDoc,
    });
    if (!bookList) {
      return res.status(404).json({ message: book.bookNotFound });
    }
    return res.status(200).json({ AllBook: bookList });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// const getOne = async (req, res) => {
//   try {
//     const { id } = req.user;
//     const _id = req.params.id;

//     const bookDetail = await Book.findOne({
//       where: { userId: id, id: _id },
//     });
//     if (!bookDetail) {
//       return res.status(404).json({ message: book.bookNotFound });
//     }
//     return res.status(200).json({ Book: bookDetail });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

const getOne = async (req, res) => {
  try {
    const { id } = req.user;
    const { bookName, authorName } = req.query;

    const whereCondition = {userId:id};

    if (bookName && !authorName) {
      whereCondition.name = { [Op.like]: `%${bookName}%` };
    }
    else if (bookName && authorName) {
      whereCondition.name = { [Op.like]: `%${bookName}%` };
      whereCondition.author = { [Op.like]: `%${authorName}%` };
    }

    console.log(whereCondition);
    const bookDetail = await Book.findOne({
      where: whereCondition,
    });
    if (!bookDetail) {
      return res.status(404).json({ message: book.bookNotFound });
    }
    return res.status(200).json({ Book: bookDetail });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
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

const deletee = async (req, res) => {
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

module.exports = { add, getAll, getOne, update, deletee };
