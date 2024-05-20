const db = require("../conn");
const message = require("../config/message");
const { Op } = require("sequelize");

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
    let whereCondition = { userId: id };

    const {
      bookId,
      bookName,
      authorName,
      pages_gt,
      pages_lt,
      pages_ne,
      pages_eq,
      rel_year1,
      rel_year2,
      order,
      sort,
    } = req.query;

    let orderType = "ASC";
    let orderCondition = [];
    if (order) {
      if (order === "true") {
        orderType = "ASC";
      }
      if (order === "false") {
        orderType = "DESC";
      }
    }

    if (sort) {
      if (sort == "name") {
        orderCondition = ["name", orderType];
      } else if (sort == "author") {
        orderCondition = ["author", orderType];
      } else if (sort == "relYear") {
        orderCondition = ["released_year", orderType];
      } else if (sort == "price") {
        orderCondition = ["price", orderType];
      } else if (sort == "noOfPage") {
        orderCondition = ["no_of_pages", orderType];
      } else if (sort == "category") {
        orderCondition = ["category", orderType];
      }
    } else {
      orderCondition = ["createdAt", "ASC"];
    }
    if (bookId && bookId.trim()) {
      whereCondition.id = bookId;
    } else if (bookName && bookName.trim() && !authorName) {
      whereCondition.name = bookName;
    } else if (bookName && bookName.trim() && authorName && authorName.trim()) {
      whereCondition.name = bookName;
      whereCondition.author = authorName;
    } else if (pages_gt && !pages_lt) {
      whereCondition.no_of_pages = { [Op.gt]: parseInt(pages_gt) };
    } else if (pages_gt && pages_lt && !pages_ne) {
      whereCondition.no_of_pages = {
        [Op.and]: [
          { [Op.gt]: parseInt(pages_gt) },
          { [Op.lt]: parseInt(pages_lt) },
        ],
      };
    } else if (pages_gt && pages_lt && pages_ne) {
      whereCondition.no_of_pages = {
        [Op.gt]: parseInt(pages_gt),
        [Op.lt]: parseInt(pages_lt),
        [Op.ne]: parseInt(pages_ne),
      };
    } else if (pages_eq) {
      whereCondition.no_of_pages = { [Op.eq]: parseInt(pages_eq) };
    } else if (rel_year1 && rel_year2) {
      whereCondition.released_year = {
        [Op.or]: [
          { [Op.eq]: parseInt(rel_year1) },
          { [Op.eq]: parseInt(rel_year2) },
        ],
      };
    } else {
      whereCondition;
    }

    const { page, limit } = req.query;
    const pageCount = Number(page) || 1;
    const limitDoc = Number(limit) || 5;
    const totalBooks = await Book.count({ where: whereCondition });
    const maxPage =
      totalBooks <= limitDoc ? 1 : Math.ceil(totalBooks / limitDoc);
    if (pageCount > maxPage) {
      return res
        .status(400)
        .json({ message: `There are only ${maxPage} page.` });
    }

    const skip = (pageCount - 1) * limitDoc;
    const bookList = await Book.findAll({
      include: [{ model: User, attributes: ["id", "name", "email"] }],
      where: whereCondition,
      order: [orderCondition],
      offset: skip,
      limit: limitDoc,
    });
    if (bookList.length === 0) {
      return res.status(404).json({ message: book.bookNotFound });
    }
    return res.status(200).json({
      AllBook: bookList,
      totalBooks,
      message: "All Books Fetched Successfully",
    });
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

    const whereCondition = { userId: id };

    if (bookName && !authorName) {
      whereCondition.name = { [Op.like]: `%${bookName}%` };
    } else if (bookName && authorName) {
      whereCondition.name = { [Op.like]: `%${bookName}%` };
      whereCondition.author = { [Op.like]: `%${authorName}%` };
    }
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
      no_of_pages,
      author,
      category,
      price,
      released_year,
    } = req.body;

    const updateBook = await Book.update(
      {
        name,
        description,
        no_of_pages,
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
    // const _id = req.params.id;

    console.log(req.query);

    const { bookId, bookName, bookDesc, authorName, category } = req.query;

    let whereCondition = { userId: id };

    if (bookName && bookName.trim()) {
      whereCondition.name = { [Op.like]: `%${bookName}%` };
    } else if (bookDesc && authorName) {
      whereCondition.description = { [Op.like]: `%${bookDesc}%` };
      whereCondition.author = { [Op.like]: `%${authorName}%` };
    } else if (bookName && category) {
      whereCondition.name = { [Op.like]: `%${bookName}%` };
      whereCondition.category = { [Op.like]: `%${category}%` };
    } else {
      whereCondition.id = bookId;
    }
    console.log(whereCondition);
    const deleteBook = await Book.destroy({ where: whereCondition });
    if (deleteBook) {
      return res.status(404).json({ message: book.bookNotFound });
    }
    return res.status(200).json({ message: book.deleteBook });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { add, getAll, getOne, update, deletee };
