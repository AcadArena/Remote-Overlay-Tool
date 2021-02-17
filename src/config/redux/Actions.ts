interface Payload {
  [key: string]: any;
}

export interface Action {
  type: string;
  payload: Payload;
}

export const types = {
  LIVE_SET_SETTINGS: "setLiveSettings",
};

export const setLiveSettings = (settings: any): Action => ({
  type: types.LIVE_SET_SETTINGS,
  payload: settings,
});
