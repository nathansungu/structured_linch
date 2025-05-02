const isauthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
      return next();
    }
    return res.status(401).json({ message: 'Unauthorized' });
};
//export the middleware function  
module.exports = {isauthenticated};