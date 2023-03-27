import userModel from "../../DB/models/User.model.js";

export const roles = {
  Admin: "Admin",
  User: "User",
  Hr: "Hr",
};

export const auth = (accessRoles = []) => {
  return async (req, res, next) => {
    try {
      if (!req?.session?.user?.id) {
        req.flash("emailErr", "In Valid Session");
        return res.redirect("/auth/login");
      }
      const user = await userModel
        .findById(req.session.user.id)
        .select("userName email role image");
      if (!user) {
        req.flash("emailErr", "Not Registered Account");
        return res.redirect("/auth/");
      }
      if (!accessRoles.includes(user.role)) {
        req.flash("emailErr", "Not Authorized Account");
        return res.redirect("/auth/login");
      }
      req.user = user;
      return next();
    } catch (error) {
      return res.json({
        message: "Catch Error",
        error: error?.message,
        stack: error.stack,
      });
    }
  };
};

export default auth;
