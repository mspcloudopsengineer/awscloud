import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import anomalies from "utils/routes/anomaliesRoute";
import BaseMenuItem from "./baseMenuItem";

class AnomaliesMenuItem extends BaseMenuItem {
  route = anomalies;

  messageId = "anomalyDetectionTitle";

  dataTestId = "btn_anomalies";

  icon = NotificationsActiveOutlinedIcon;

  isActive = (currentPath) => currentPath.startsWith(this.route.link);
}

export default new AnomaliesMenuItem();
