import { REALTIME_COST_MONITOR } from "urls";
import BaseRoute from "./baseRoute";

class RealtimeCostMonitorRoute extends BaseRoute {
  page = "RealtimeCostMonitor";

  link = REALTIME_COST_MONITOR;
}

export default new RealtimeCostMonitorRoute();
