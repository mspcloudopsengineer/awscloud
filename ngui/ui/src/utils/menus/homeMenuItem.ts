import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import { PRODUCT_TOUR_IDS } from "components/Tour";
import home from "utils/routes/homeRoute";
import BaseMenuItem from "./baseMenuItem";

class HomeMenuItem extends BaseMenuItem {
  route = home;

  messageId = "home";

  dataTestId = "btn_home";

  dataProductTourId = PRODUCT_TOUR_IDS.HOME;

  icon = DashboardOutlinedIcon;
}

export default new HomeMenuItem();
