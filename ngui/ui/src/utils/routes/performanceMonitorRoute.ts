import { PERFORMANCE_MONITOR } from "urls";
import BaseRoute from "./baseRoute";

class PerformanceMonitorRoute extends BaseRoute {
  page = "PerformanceMonitor";

  link = PERFORMANCE_MONITOR;
}

export default new PerformanceMonitorRoute();
