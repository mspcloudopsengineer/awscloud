import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import resourceLifecycle from "utils/routes/resourceLifecycleRoute";
import BaseMenuItem from "./baseMenuItem";

class ResourceLifecycleMenuItem extends BaseMenuItem {
  route = resourceLifecycle;

  messageId = "resourceLifecycleTitle";

  dataTestId = "btn_resource_lifecycle";

  icon = AutorenewOutlinedIcon;

  isActive = (currentPath) => currentPath.startsWith(this.route.link);
}

export default new ResourceLifecycleMenuItem();
