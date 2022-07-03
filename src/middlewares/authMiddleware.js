import {
  schemaEmail,
  schemaName,
  schemaPassword,
} from "../schemas/authSchema.js";

export function validateSignup(req, res, next) {
  const { name, email, password, passwordConfirmation } = req.body;

  const validateName = schemaName.validate({ name });
  const validateEmail = schemaEmail.validate({ email });
  const validatePassword = schemaPassword.validate({
    password,
    passwordConfirmation,
  });

  if (validateEmail.error) {
    console.log("erro no email", validateEmail.error.details);
    res.status(422).send("email inválido");
    return;
  }
  if (validatePassword.error) {
    console.log("erro na senha", validatePassword.error.details);
    res.status(422).send("senha inválida");
    return;
  }
  if (validateName.error) {
    console.log("erro no nome", validateName.error.details);
    res.status(422).send("nome inválido");
    return;
  }
  next();
}
