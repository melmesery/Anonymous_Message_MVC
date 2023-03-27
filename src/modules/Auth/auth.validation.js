import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const signup = {
  body: joi.object({
    userName: joi.string().min(2).max(25).required(),
    email: generalFields.email,
    password: generalFields.password,
    cPassword: generalFields.password.valid(joi.ref("password")),
  }),
};

export const login = {
  body: joi.object({
    email: generalFields.email,
    password: generalFields.password,
  }),
};
