import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import realtimeCostMonitor from "utils/routes/realtimeCostMonitorRoute";
import BaseMenuItem from "./baseMenuItem";

class RealtimeCostMonitorMenuItem extends BaseMenuItem {
  route = realtimeCostMonitor;

  messageId = "realtimeCostMonitor";

  dataTestId = "btn_realtime_cost_monitor";

  icon = MonitorHeartOutlinedIcon;
}

export default new RealtimeCostMonitorMenuItem();
