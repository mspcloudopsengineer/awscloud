import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import { PRODUCT_TOUR_IDS } from "components/Tour";
import users from "utils/routes/usersRoute";
import BaseMenuItem from "./baseMenuItem";

class UsersMenuItem extends BaseMenuItem {
  route = users;

  messageId = "userManagementTitle";

  dataTestId = "btn_user_management";

  dataProductTourId = PRODUCT_TOUR_IDS.USERS;

  icon = GroupsOutlinedIcon;

  isActive = (currentPath) => currentPath.startsWith(this.route.link);
}

export default new UsersMenuItem();
