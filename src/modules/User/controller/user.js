import messageModel from "../../../../DB/models/Message.model.js";
import userModel from "../../../../DB/models/User.model.js";

export const profile = async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  const messages = await messageModel.find({ userId: user._id });
  user.shareLink = `${req.protocol}://${req.headers.host}/user/${user._id}/profile`;
  return res.render("profile", {
    PageTitle: "Profile",
    cssLink: "/shared/css/signup.css",
    user,
    messages,
  });
};

export const shareProfile = async (req, res, next) => {
  const user = await userModel.findById(req.params.id);
  return res.render("message", {
    PageTitle: "Message",
    cssLink: "/shared/css/signup.css",
    MessageContent: req.flash("Message Content")[0],
    user,
  });
};

export const profilePic = async (req, res, next) => {
  await userModel.updateOne(
    { _id: req.user._id },
    { profilePic: req.file?.dest },
    { new: true }
  );
  return res.redirect("/auth/login");
};

export const logout = async (req, res, next) => {
  const user = await userModel.updateOne(
    { _id: req.user._id },
    { status: "offline" }
  );
  req.session.destroy();
  return res.redirect("/auth/login");
};
