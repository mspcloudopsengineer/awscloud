import { USER_GUIDE } from "urls";
import BaseRoute from "./baseRoute";

class UserGuideRoute extends BaseRoute {
  page = "UserGuidePage";

  link = USER_GUIDE;
}

export default new UserGuideRoute();
