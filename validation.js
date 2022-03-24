//validation
import Joi from '@hapi/joi';

//register validation
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string()
    .min(6)
    .required(),
    email: Joi.string()
    .min(6)
    .required()
    .email(),
    password: Joi.string()
    .min(6)
    .required(),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string()
    .min(6)
    .required()
    .email(),
    password: Joi.string()
    .min(6)
    .required(),
  });
  return schema.validate(data);
};

const transferValidation = (data) => {
  const schema = Joi.object({
    transferTo: Joi.string()
    .min(6)
    .required()
    .email(),
    transferAmt: Joi.string()
    .required(),
  });
  return schema.validate(data);
};


const _registerValidation = registerValidation;
export { _registerValidation as registerValidation };
const _loginValidation = loginValidation;
export { _loginValidation as loginValidation };
const _transferValidation = transferValidation;
export { _transferValidation as transferValidation };