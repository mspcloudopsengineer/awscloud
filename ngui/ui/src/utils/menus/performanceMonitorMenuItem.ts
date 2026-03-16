import BuildCircleOutlinedIcon from "@mui/icons-material/BuildCircleOutlined";
import performanceMonitor from "utils/routes/performanceMonitorRoute";
import BaseMenuItem from "./baseMenuItem";

class PerformanceMonitorMenuItem extends BaseMenuItem {
  route = performanceMonitor;

  messageId = "performanceMonitor";

  dataTestId = "btn_performance_monitor";

  icon = BuildCircleOutlinedIcon;
}

export default new PerformanceMonitorMenuItem();
