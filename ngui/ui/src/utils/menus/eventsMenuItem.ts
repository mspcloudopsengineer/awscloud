import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import events from "utils/routes/eventsRoute";
import BaseMenuItem from "./baseMenuItem";

class EventsMenuItem extends BaseMenuItem {
  route = events;

  messageId = "events";

  dataTestId = "btn_events";

  icon = HistoryOutlinedIcon;
}

export default new EventsMenuItem();
