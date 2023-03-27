import flash from "connect-flash";
import mongoDBStore from "connect-mongodb-session";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../DB/connection.js";
import authRouter from "./modules/Auth/auth.router.js";
import userRouter from "./modules/User/user.router.js";
import messageRouter from "./modules/Message/message.router.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MongoDBStore = mongoDBStore(session);

const initApp = (app, express) => {
  connectDB();
  app.use(express.urlencoded({ extend: false }));
  app.use("/shared", express.static(path.join(__dirname, "./views/shared")));
  app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
  app.set("views", path.join(__dirname, "./views"));
  app.set("view engine", "ejs");

  var store = new MongoDBStore({
    uri: process.env.DATABASE,
    collection: "mySessions",
  });
  store.on("error", function (error) {
    console.log(error);
  });

  app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUnintialized: false,
      cookie: { maxAge: 60000 * 60 * 24 },
      store,
    })
  );
  app.use(flash());
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/message", messageRouter);
};

export default initApp;
