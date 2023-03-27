import { roles } from "../../middleware/auth.middleware.js";

export const endPoint = {
  profile: [roles.Admin, roles.User],
};
