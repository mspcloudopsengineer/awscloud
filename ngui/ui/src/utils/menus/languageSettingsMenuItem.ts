import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import languageSettings from "utils/routes/languageSettingsRoute";
import BaseMenuItem from "./baseMenuItem";

class LanguageSettingsMenuItem extends BaseMenuItem {
  route = languageSettings;

  messageId = "languageSettings";

  dataTestId = "btn_language_settings";

  icon = SettingsOutlinedIcon;
}

export default new LanguageSettingsMenuItem();
