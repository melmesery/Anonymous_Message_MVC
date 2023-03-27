import userModel from "../../../../DB/models/User.model.js";
import {
  generateToken,
  verifyToken,
} from "../../../utils/GenerateAndVerifyToken.js";
import { compare, hash } from "../../../utils/HashAndCompare.js";
import sendEmail from "../../../utils/sendEmail.js";

export const displaySignUp = (req, res) => {
  res.render("signup", {
    PageTitle: "Sign Up",
    cssLink: "/shared/css/signup.css",
    emailErr: req.flash("emailErr")[0],
    oldData: req.flash("oldData")[0],
    validationErr: req.flash("Validation Error"),
    endSession: req.session.destroy(),
  });
};

export const signUp = async (req, res, next) => {
  const { userName, email, password } = req.body;
  const User = await userModel.findOne({ email });
  if (User) {
    req.flash("emailErr", "Email Exists");
    req.flash("oldData", req.body);
    return res.redirect("/auth");
  }
  const token = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN_SIGNATURE,
    expiresIn: 60 * 5,
  });
  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
  const refreshToken = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN_SIGNATURE,
    expiresIn: 60 * 60 * 24 * 30,
  });
  const refreshLink = `${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${refreshToken}`;
  const html = `<a href="${link}">Click Here To Confirm Email</a> 
  <br/> 
  <br/> 
  <a href="${refreshLink}">Request New Email</a>`;
  if (!(await sendEmail({ to: email, subject: "Confirm Email", html }))) {
    req.flash("emailErr", "Rejected Email");
    req.flash("oldData", req.body);
    return res.redirect("/auth");
  }
  const hashPassword = hash({ plainText: password });
  const createUser = await userModel.create({
    userName,
    email,
    password: hashPassword,
  });
  return res.status(201).redirect("/auth/login");
};

export const confirmEmail = async (req, res, next) => {
  const { token } = req.params;
  const { email } = verifyToken({
    token,
    signature: process.env.EMAIL_TOKEN_SIGNATURE,
  });
  const User = await userModel.updateOne({ email }, { confirmEmail: true });
  return User.modifiedCount
    ? res.status(200).redirect("https://www.facebook.com")
    : res.status(404).send("Account Not Registered");
};

export const newConfirmEmail = async (req, res, next) => {
  const { token } = req.params;
  const { email } = verifyToken({
    token,
    signature: process.env.EMAIL_TOKEN_SIGNATURE,
  });
  const newToken = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN_SIGNATURE,
    expiresIn: 60 * 2,
  });
  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}`;
  const refreshLink = `${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${token}`;
  const html = `<a href="${link}">Click Here To Confirm Email</a> 
  <br/> 
  <br/> 
  <a href="${refreshLink}">Request New Email</a>`;
  if (!(await sendEmail({ to: email, subject: "Confirm Email", html }))) {
    return next(new Error("Rejected Email", { cause: 400 }));
  }
  return res.status(200).send("Please, Check Your Email");
};

export const displayLogin = (req, res) => {
  res.render("login", {
    PageTitle: "Login",
    cssLink: "/shared/css/signup.css",
    emailErr: req.flash("emailErr")[0],
    oldData: req.flash("oldData")[0],
    validationErr: req.flash("Validation Error"),
    endSession: req.session.destroy(),
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const User = await userModel.findOne({ email });
  if (!User) {
    req.flash("emailErr", "Email Not Exist");
    req.flash("oldData", req.body);
    return res.redirect("/auth/login");
  }
  if (!User.confirmEmail) {
    req.flash("emailErr", "Please Confirm Your Email");
    req.flash("oldData", req.body);
    return res.redirect("/auth/login");
  }
  const match = compare({ plainText: password, hashValue: User.password });
  if (!match) {
    req.flash("emailErr", "In-valid Password");
    req.flash("oldData", req.body);
    return res.redirect("/auth/login");
  }
  req.session.user = {
    id: User._id,
    role: User.role,
  };
  User.status = "online";
  await User.save();
  return res.redirect("/user");
};
