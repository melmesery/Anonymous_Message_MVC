import messageModel from "../../../../DB/models/Message.model.js";
import userModel from "../../../../DB/models/User.model.js";

export const sendMessage = async (req, res, next) => {
  const { id } = req.params;
  const { message } = req.body;
  if (!(await userModel.findById(id))) {
    req.flash("Message Content", "In-valid Receiver Account");
    return res.redirect(`/user/${id}/profile`);
  }
  await messageModel.create({ message, userId: id });
  req.flash("Message Content", "Thanks For Your Message");
  return res.redirect(`/user/${id}/profile`);
};

export const deleteMessage = async (req, res, next) => {
  const { id } = req.params;
  await messageModel.deleteOne({ _id: id, userId: req.user._id });
  return res.redirect("/user");
};
