// import * as signalR from "@microsoft/signalr";
// import { useSelector } from "react-redux";
// export const ConnectionS = () => {
//   const user = useSelector((state) => state.auth);
//   console.log("signal");
//   const protocol = new signalR.JsonHubProtocol();
//   const transport = signalR.HttpTransportType.WebSockets;

//   const options = {
//     transport,
//     logMessageContent: true,
//     logger: signalR.LogLevel.Trace,
//     accessTokenFactory: () => user?.token,
//   };

//   const newConnection = new signalR.HubConnectionBuilder()
//     .withUrl(
//       process.env.REACT_APP_API_HOST + "chathub",
//       options /*{ jwtBearer: token }*/
//     )
//     .withHubProtocol(protocol)
//     .withAutomaticReconnect()
//     .build();

//   return newConnection;
// };
