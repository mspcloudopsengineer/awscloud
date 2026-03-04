import TravelExploreOutlinedIcon from "@mui/icons-material/TravelExploreOutlined";
import expensesMap from "utils/routes/expensesMapRoute";
import BaseMenuItem from "./baseMenuItem";

class ExpensesMapMenuItem extends BaseMenuItem {
  route = expensesMap;

  messageId = "costMapTitle";

  dataTestId = "btn_cost_map";

  icon = TravelExploreOutlinedIcon;
}

export default new ExpensesMapMenuItem();
