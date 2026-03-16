import { ADVANCED_FILTERS } from "urls";
import BaseRoute from "./baseRoute";

class AdvancedFiltersRoute extends BaseRoute {
  page = "AdvancedFilters";

  link = ADVANCED_FILTERS;
}

export default new AdvancedFiltersRoute();
