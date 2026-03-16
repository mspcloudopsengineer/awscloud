import { REPORT_EXPORT } from "urls";
import BaseRoute from "./baseRoute";

class ReportExportRoute extends BaseRoute {
  page = "ReportExport";

  link = REPORT_EXPORT;
}

export default new ReportExportRoute();
