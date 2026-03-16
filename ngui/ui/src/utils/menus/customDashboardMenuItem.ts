import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import customDashboard from "utils/routes/customDashboardRoute";
import BaseMenuItem from "./baseMenuItem";

class CustomDashboardMenuItem extends BaseMenuItem {
  route = customDashboard;

  messageId = "customDashboard";

  dataTestId = "btn_custom_dashboard";

  icon = DashboardOutlinedIcon;
}

export default new CustomDashboardMenuItem();
