// controllers/userController.js
const User = require('../models/user');

// Home page controller
exports.home = (req, res) => {
    console.log('Home page');
  // res.render('home', { title: 'Home Page' });

  res.status(200).send({ message: 'Home page' });
};

// Get user by ID
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.render('user', { user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving user');
  }
};
