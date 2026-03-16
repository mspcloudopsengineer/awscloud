import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import automationWorkflow from "utils/routes/automationWorkflowRoute";
import BaseMenuItem from "./baseMenuItem";

class AutomationWorkflowMenuItem extends BaseMenuItem {
  route = automationWorkflow;

  messageId = "automationWorkflow";

  dataTestId = "btn_automation_workflow";

  icon = AccountTreeOutlinedIcon;
}

export default new AutomationWorkflowMenuItem();
