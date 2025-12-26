const { changeInforSchema } = require("../schemas/user.schema");

module.exports.validateInfor = (req, res, next) => {
  const { error } = changeInforSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }
  next();
};

