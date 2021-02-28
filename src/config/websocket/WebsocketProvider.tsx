import React, { createContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setLiveSettings,
  setWebsocketState,
  setWebsocketUsers,
} from "../redux/Actions";
import io from "socket.io-client";
import { ReduxState, WebsocketUser } from "../types/types";
import { store } from "../..";

export interface WebsocketProps {
  socket?: any;
  setLiveSettings: (settings: any) => void;
  joinRoom: (room: string, user?: string) => void;
}

export const wsContext = createContext<WebsocketProps>({
  setLiveSettings: () => {},
  joinRoom: () => {},
});
let host: string = "";
const hostCloud: string = "https://rot-websocket-server.herokuapp.com/";
const hostLocal: string = "localhost:3200";

if (window.location.hostname === "localhost") {
  host = hostLocal;
} else {
  host = hostCloud;
}

let socket: any = io
  .connect(`${host}`)
  .on("connect", () => {
    store.dispatch(setWebsocketState(true));
  })
  .on("set_live_settings", (settings: any) =>
    store.dispatch(setLiveSettings(settings))
  )
  .on("usersUpdate", (users: WebsocketUser[]) =>
    store.dispatch(setWebsocketUsers(users))
  )
  .on("disconnect", () => {
    store.dispatch(setWebsocketState(false));
  })
  .on("connection_error", () => {
    store.dispatch(setWebsocketState(false));
  });

const WebsocketProvider: React.FC = ({ children }) => {
  const dispatch = useDispatch();
  let ws: WebsocketProps = {
    setLiveSettings: () => {},
    joinRoom: () => {},
  };
  const { room: ClientRoom } = useSelector((state: ReduxState) => state.live);
  ws = {
    socket,
    setLiveSettings: (settings: any) =>
      socket.emit("set_live_settings", { data: settings, room: ClientRoom }),
    joinRoom: (room, user?) => {
      dispatch(setLiveSettings({ room }));
      socket.emit("join_room", { room, username: user ?? "controller" });
    },
  };
  return <wsContext.Provider value={ws}>{children}</wsContext.Provider>;
};

export default WebsocketProvider;
