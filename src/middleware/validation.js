import joi from "joi";

const dataMethods = ["body", "query", "params", "headers", "file"];

export const generalFields = {
  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
    .required(),
  cPassword: joi.string().required(),
  email: joi
    .string()
    .email({ maxDomainSegments: 3, tlds: { allow: ["com", "net"] } })
    .required(),
  age: joi.number().integer().min(16).max(100).required(),
  id: joi.string().min(24).max(24).required(),
};

const validation = (schema, R_URL) => {
  return (req, res, next) => {
    const validationErr = [];
    dataMethods.forEach((key) => {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });
        if (validationResult.error) {
          for (const detail of validationResult.error.details) {
            validationErr.push(detail.path[0]);
          }
        }
      }
    });
    if (validationErr.length) {
      req.flash("Validation Error", validationErr);
      req.flash("oldData", { ...req.body, ...req.params, ...req.query });
      return res.redirect(R_URL);
    } else {
      return next();
    }
  };
};

export default validation;
