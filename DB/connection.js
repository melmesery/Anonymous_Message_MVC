import mongoose from "mongoose";

const connectDB = async () => {
  return await mongoose
    .connect(process.env.DATABASE)
    .then((result) => console.log("DB Connected Successfully"))
    .catch((error) => console.log("Fail To Connect DB", error));
};

export default connectDB;
