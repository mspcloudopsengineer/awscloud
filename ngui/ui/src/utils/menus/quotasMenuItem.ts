import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import quotas from "utils/routes/quotasRoute";
import BaseMenuItem from "./baseMenuItem";

class QuotasMenuItem extends BaseMenuItem {
  route = quotas;

  messageId = "quotasAndBudgetsTitle";

  dataTestId = "btn_quotas_and_budgets";

  isActive = (currentPath) => currentPath.startsWith(this.route.link);

  icon = SavingsOutlinedIcon;
}

export default new QuotasMenuItem();
