import { Injectable } from "@vikit/xnestjs";
import WebSocket from "ws";
import config from "config";
import { URL } from 'url';

const PORT: number = config.get("ws_port");

@Injectable
export default class WSP {
  static inited = false;
  static ws_conn: { [user: string]: WebSocket } = {};
  static ws_server = new WebSocket.Server({ port: PORT });
  static ShowAllWs() {
    const r = Object.keys(WSP.ws_conn);
    return r;
  }
  static taskPool: any = {}
  static async fetchPath(ws: WebSocket, path: string) {
    return await new Promise((res, rej) => {
      ws.send(JSON.stringify({ path }))
      let r;
      WSP.taskPool[path] = {
        status: new Promise((res1) => {
          r = res1
        }).then((d) => {
          res(d)
        }),
        res: r
      }
    })
  }

  constructor() {
    if (WSP.inited === false) {
      const wss = WSP.ws_server;
      const ws_conn = WSP.ws_conn;

      wss.on("connection", (ws, req) => {
        if (req.url) {
          const query = new URL(`http://${req.headers.host}${req.url}`).searchParams;
          const user = query.get('user');
          if (user) {
            ws_conn[user] = ws;

            ws.once('close', () => {
              delete ws_conn[user]
              WSP.ShowAllWs()
            })
            ws.on('message', (d) => {
              const { path, body } = JSON.parse(d.toString());
              const task = WSP.taskPool[path]
              if (task && task.res) {
                task.res(body)
                delete WSP.taskPool[path];
              }
            })
          }
        }
        WSP.ShowAllWs()
      });
      wss.on('listening', () => {
        console.log(`websocket server is listening at ${PORT}`)
      })
      WSP.inited = true;
    }
  }
}
