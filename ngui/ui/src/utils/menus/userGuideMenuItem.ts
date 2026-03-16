import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import userGuide from "utils/routes/userGuideRoute";
import BaseMenuItem from "./baseMenuItem";

class UserGuideMenuItem extends BaseMenuItem {
  route = userGuide;

  messageId = "userGuide";

  dataTestId = "btn_user_guide";

  icon = HelpOutlineOutlinedIcon;
}

export default new UserGuideMenuItem();
