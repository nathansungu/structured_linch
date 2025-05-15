const { default: Customerror } = require("../errors/customerror");

const errorHandler = (err, req, res, next) => {
  if (err instanceof Customerror){
    res.status(err.status).json({message:err.message})
    return
  }
  if (err instanceof SequelizeUniqueConstraintError ){
    if (name == "") {
      
    } else {
      
    }
  }
    console.error(err.stack);
    res.status(500).json({ message: 'Oops, somethings went off.' });
  };
  