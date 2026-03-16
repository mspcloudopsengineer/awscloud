import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import advancedFilters from "utils/routes/advancedFiltersRoute";
import BaseMenuItem from "./baseMenuItem";

class AdvancedFiltersMenuItem extends BaseMenuItem {
  route = advancedFilters;

  messageId = "advancedFilters";

  dataTestId = "btn_advanced_filters";

  icon = TuneOutlinedIcon;
}

export default new AdvancedFiltersMenuItem();
