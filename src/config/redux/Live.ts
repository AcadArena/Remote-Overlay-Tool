import { Live } from "../types/types";
import { types, Action } from "./Actions";

const live: Live = {};

const LiveReducers = (state = live, action: Action) => {
  switch (action.type) {
    case types.LIVE_SET_SETTINGS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default LiveReducers;
