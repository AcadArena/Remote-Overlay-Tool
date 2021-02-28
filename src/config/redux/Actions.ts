import { WebsocketUser } from "../types/types";

type Payload = any | boolean;
export interface Action {
  type: string;
  payload: Payload;
}

export const types = {
  LIVE_SET_SETTINGS: "setLiveSettings",
  SET_WEBSOCKET_USERS: "setWebsocketUsers",
  SET_WEBSOCKET_STATE: "setWebsocketState",
};

export const setLiveSettings = (settings: any): Action => ({
  type: types.LIVE_SET_SETTINGS,
  payload: settings,
});

export const setWebsocketUsers = (users: WebsocketUser[]) => ({
  type: types.SET_WEBSOCKET_USERS,
  payload: users,
});

export const setWebsocketState = (state: boolean) => ({
  type: types.SET_WEBSOCKET_STATE,
  payload: state,
});
