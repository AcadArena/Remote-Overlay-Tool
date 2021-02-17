import React, { createContext } from "react";
import { useDispatch } from "react-redux";
import { setLiveSettings } from "../redux/Actions";
import io from "socket.io-client";

export const wsContext = createContext(null);
// const host = "https://rot-websocket-server.herokuapp.com/";
const host = "localhost:3200";

const WebsocketProvider: React.FC = ({ children }) => {
  let socket: any;
  let ws: any;
  const dispatch = useDispatch();

  // prettier-ignore
  if (!socket) {
    socket = io.connect(`${host}`);
    socket.on("set_live_settings", (settings: any) => dispatch(setLiveSettings(settings)));
    socket.on("message", (message:any) => console.log(message))
    ws = {
      socket,
      setLiveSettings: (settings:any) => socket.emit('set_live_settings', settings)
    }
  }
  return <wsContext.Provider value={ws}>{children}</wsContext.Provider>;
};

export default WebsocketProvider;
