import { LANGUAGE_SETTINGS } from "urls";
import BaseRoute from "./baseRoute";

class LanguageSettingsRoute extends BaseRoute {
  page = "LanguageSettings";

  link = LANGUAGE_SETTINGS;
}

export default new LanguageSettingsRoute();
