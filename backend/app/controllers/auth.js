const User = require('../models/Users');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { getToken } = require('../../utils');

const register = async (req, res, next) => {
  try {
    let payload = req.body;
    let user = new User(payload);

    await user.save();
    return res.json({
      status: true,
      message: 'User successfully Register',
      data: user,
    });
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const localStrategy = async (email, password, done) => {
  try {
    let user = await User.findOne({ email }).select(
      '-__v -createdAt -updatedAt -cart_items -token',
    );
    if (!user) return done();
    if (bcrypt.compareSync(password, user.password)) {
      ({ password, ...userWithoutPassword } = user.toJSON());
      return done(null, userWithoutPassword);
    }
  } catch (err) {
    done(err, null);
  }

  done();
};

const login = (req, res, next) => {
  passport.authenticate('local', async function (err, user) {
    if (err) return next(err);
    if (!user)
      return res.json({error: 1, message: 'Email or password incorrect'});
    let signed = jwt.sign(user, config.secretKey);
    await User.findByIdAndUpdate(user._id, {token: signed});

    res.json({
      message: 'Login Successfully',
      user,
      token: signed,
    });
  })(req, res, next);
};

const logout = async (req, res, next) => {
  let token = getToken(req);

  let user = await User.findOneAndUpdate(
    { token: { $in: [token] } },
    { $pull: { token: token } },
    { useFindAndModify: false },
  );

  if (!token || !user) {
    res.json({
      error: 1,
      message: 'No User Found!!!',
    });
    return;
  }

  return res.json({
    error: 0,
    message: 'Logout berhasil',
  });
};

const me = (req, res, next) => {
  if (!req.user) {
    res.status(401),
      res.json({
        err: 1,
        message: `You're not login or token expired`,
      });
  }
  res.json(req.user);
};

module.exports = {
  register,
  localStrategy,
  login,
  logout,
  me,
};
