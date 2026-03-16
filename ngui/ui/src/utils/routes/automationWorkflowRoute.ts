import { AUTOMATION_WORKFLOW } from "urls";
import BaseRoute from "./baseRoute";

class AutomationWorkflowRoute extends BaseRoute {
  page = "AutomationWorkflow";

  link = AUTOMATION_WORKFLOW;
}

export default new AutomationWorkflowRoute();
