import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import costPrediction from "utils/routes/costPredictionRoute";
import BaseMenuItem from "./baseMenuItem";

class CostPredictionMenuItem extends BaseMenuItem {
  route = costPrediction;

  messageId = "costPrediction";

  dataTestId = "btn_cost_prediction";

  icon = TrendingUpOutlinedIcon;
}

export default new CostPredictionMenuItem();
