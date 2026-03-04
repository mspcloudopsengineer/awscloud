import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import mlDatasetsRoute from "utils/routes/mlDatasetsRoute";
import BaseMenuItem from "./baseMenuItem";

class MlDatasetsMenuItem extends BaseMenuItem {
  route = mlDatasetsRoute;

  messageId = "datasets";

  dataTestId = "btn_ml_datasets";

  icon = TableChartOutlinedIcon;

  isActive = (currentPath) => currentPath.startsWith(this.route.link);
}

export default new MlDatasetsMenuItem();
