import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import taggingPolicies from "utils/routes/taggingPoliciesRoute";
import BaseMenuItem from "./baseMenuItem";

class TaggingPoliciesMenuItem extends BaseMenuItem {
  route = taggingPolicies;

  messageId = "tagging";

  dataTestId = "btn_tagging_policies";

  icon = LabelOutlinedIcon;

  isActive = (currentPath) => currentPath.startsWith(this.route.link);
}

export default new TaggingPoliciesMenuItem();
