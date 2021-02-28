import { Live } from "../types/types";
import { types, Action } from "./Actions";

const live: Live = { websocket_users: [], room: "" };

const LiveReducers = (state = live, action: Action) => {
  switch (action.type) {
    case types.LIVE_SET_SETTINGS:
      return { ...state, ...action.payload };
    case types.SET_WEBSOCKET_USERS:
      return { ...state, websocket_users: action.payload };
    case types.SET_WEBSOCKET_STATE:
      return { ...state, websocket_state: action.payload };
    default:
      return state;
  }
};

export default LiveReducers;
