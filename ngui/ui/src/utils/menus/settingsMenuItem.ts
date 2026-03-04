import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import settings from "utils/routes/settingsRoute";
import BaseMenuItem from "./baseMenuItem";

class SettingsMenuItem extends BaseMenuItem {
  route = settings;

  messageId = "settings";

  dataTestId = "btn_settings";

  icon = SettingsOutlinedIcon;
}

export default new SettingsMenuItem();
