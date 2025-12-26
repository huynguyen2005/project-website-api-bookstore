const Joi = require("joi");

module.exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

module.exports.registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  password_confirm: Joi.string().valid(Joi.ref("password")).required(),
  fullName: Joi.string().required()
});

module.exports.changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).invalid(Joi.ref("oldPassword")).required()
});


module.exports.forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

module.exports.resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});