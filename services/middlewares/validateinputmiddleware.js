//validate registration data
const validateRegister = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    next();
  };
  
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    next();
  }

module.exports = {
    validateRegister,
    validateLogin
}