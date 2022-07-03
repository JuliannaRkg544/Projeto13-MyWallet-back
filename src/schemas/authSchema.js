import joi from "joi";

const regexEmail = /^(.+)@(.+)$/;

export const schemaName = joi.object({
  name: joi.string().required(),
});

export const schemaEmail = joi.object({
  email: joi.string().pattern(regexEmail).required(),
});
export const schemaPassword = joi.object({
  password: joi.required(),
  passwordConfirmation: joi.ref("password"),
});
