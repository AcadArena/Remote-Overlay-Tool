import React, { createContext } from "react";
import { useDispatch } from "react-redux";
import { setLiveSettings } from "../redux/Actions";
import io from "socket.io-client";

export interface WebsocketProps {
  socket?: SocketIOClientStatic;
  setLiveSettings: (settings: any) => void;
}

export const wsContext = createContext<WebsocketProps>({
  setLiveSettings: () => {},
});
let host: string = "";
const hostCloud: string = "https://rot-websocket-server.herokuapp.com/";
const hostLocal: string = "localhost:3200";

if (window.location.hostname === "localhost") {
  host = hostLocal;
} else {
  host = hostCloud;
}

const WebsocketProvider: React.FC = ({ children }) => {
  let socket: any;
  let ws: WebsocketProps = { setLiveSettings: () => {} };
  const dispatch = useDispatch();

  // prettier-ignore
  if (!socket) {
    socket = io.connect(`${host}`);
    socket.on("set_live_settings", (settings: any) => dispatch(setLiveSettings(settings)));
    ws = {
      socket,
      setLiveSettings: (settings:any) => socket.emit("set_live_settings", settings)
    }
  }
  return <wsContext.Provider value={ws}>{children}</wsContext.Provider>;
};

export default WebsocketProvider;
