const { verifyToken } = require("../utility/token");
const message = require("../config/message");
const db = require("../conn");
const User = db.user;

const { error } = message;
const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(404).json({
        success: false,
        message: error.tokenNotGenreted, // correct speling mistake
      });
    }

    const decodeToken = verifyToken(token);

    if (!decodeToken) {
      return res.status(401).json({ message: error.userUnauthorize });
    }

    const user = await User.findByPk(decodeToken.id , { attributes: { exclude: ['password'] }});

    if (!user) {
      return res.status(404).json({ message: error.userNotfound });
    }
    req.user = user;

    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = verifyUser;
