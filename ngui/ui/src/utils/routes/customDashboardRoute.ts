import { CUSTOM_DASHBOARD } from "urls";
import BaseRoute from "./baseRoute";

class CustomDashboardRoute extends BaseRoute {
  page = "CustomDashboard";

  link = CUSTOM_DASHBOARD;
}

export default new CustomDashboardRoute();
