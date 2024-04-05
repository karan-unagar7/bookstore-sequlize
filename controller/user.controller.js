const db = require("../model/index");
const message = require("../config/message");

const { user, error } = message;
const User = db.users;

const { generateToken } = require("../utility/token");

const signUp = async (req, res) => {
  try {
    const { name, email, password, gender } = req.body;

    if ((name && email && password && gender) === undefined) {
      return res
        .status(400)
        .json({ success: false, message: error.allFeildRequired });
    }

    const userDeatil = await User.findOne({ where: { email } });
    if (userDeatil) {
      return res
        .status(409)
        .json({ success: false, message: error.userAlreadyExicts });
    }

    const newUser = await User.create({ name, email, password, gender });

    return res.status(201).json({ success: true, message: user.signUp });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if ((email && password) === undefined) {
      return res
        .status(400)
        .json({ success: false, message: error.allFeildRequired });
    }
    const userDetail = await User.findOne({ where: { email } });
    if (!userDetail) {
      return res
        .status(404)
        .json({ success: false, message: error.userNotfound });
    }

    const matchPass = await userDetail.checkPassword(password);

    if (!matchPass) {
      return res
        .status(401)
        .json({ success: false, message: error.wrongPassword });
    }

    const token = generateToken({ id: userDetail.id });
    return res
      .status(200)
      .json({ success: true, Token: token, message: user.signIn });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { signUp, signIn, getUser };
