import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import reportExport from "utils/routes/reportExportRoute";
import BaseMenuItem from "./baseMenuItem";

class ReportExportMenuItem extends BaseMenuItem {
  route = reportExport;

  messageId = "reportExport";

  dataTestId = "btn_report_export";

  icon = DescriptionOutlinedIcon;
}

export default new ReportExportMenuItem();
