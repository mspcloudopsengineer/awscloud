import { COST_PREDICTION } from "urls";
import BaseRoute from "./baseRoute";

class CostPredictionRoute extends BaseRoute {
  page = "CostPrediction";

  link = COST_PREDICTION;
}

export default new CostPredictionRoute();
