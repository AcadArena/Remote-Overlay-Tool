import { types, Action } from "./Actions";

export interface Live {
  [key: string]: any;
}
const live = {};

const LiveReducers = (state = live, action: Action) => {
  switch (action.type) {
    case types.LIVE_SET_SETTINGS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default LiveReducers;
