const Joi = require("joi");

module.exports.changeInforSchema = Joi.object({
  email: Joi.string().email().required(),
  fullName: Joi.string().required(),
  phone: Joi.string().pattern(/^0[0-9]{9}$/),
  address: Joi.string().allow("", null),
  birthday: Joi.string().allow("", null),
  avatar: Joi.string().allow("", null)
});