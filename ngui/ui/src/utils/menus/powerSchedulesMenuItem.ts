import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import powerSchedulesRoute from "utils/routes/powerSchedulesRoute";
import BaseMenuItem from "./baseMenuItem";

class PowerSchedulesMenuItem extends BaseMenuItem {
  route = powerSchedulesRoute;

  messageId = "powerSchedulesTitle";

  dataTestId = "btn_power_schedules";

  icon = AccessTimeOutlinedIcon;

  isActive = (currentPath) => currentPath.startsWith(this.route.link);
}

export default new PowerSchedulesMenuItem();
