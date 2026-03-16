import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import advancedCharts from "utils/routes/advancedChartsRoute";
import BaseMenuItem from "./baseMenuItem";

class AdvancedChartsMenuItem extends BaseMenuItem {
  route = advancedCharts;

  messageId = "advancedCharts";

  dataTestId = "btn_advanced_charts";

  icon = InsightsOutlinedIcon;
}

export default new AdvancedChartsMenuItem();
