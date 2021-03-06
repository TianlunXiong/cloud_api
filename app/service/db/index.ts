import { Injectable } from "@vikit/xnestjs";
import { ModelClass, CloudObjectInit, CloudObjectCommitInit } from "./model";
import { Sequelize } from "sequelize";
import config from "config";

const {
  database,
  username,
  password,
  host,
  port,
  dialect,
  logging,
} = config.get("db");

@Injectable
export default class DB {
  static sequelize: Sequelize | null = null;
  static connecting = false;
  static async Init() {
    if (DB.sequelize) return;
    const sequelize = new Sequelize(database, username, password, {
      host,
      port,
      dialect,
      logging,
    });
    DB.connecting = true;
    try {
      CloudObjectInit(sequelize);
      CloudObjectCommitInit(sequelize);
      await sequelize.authenticate().then(() => {
        console.log("成功连接至PostgreSQL服务器");
      });
      await sequelize
        .sync({ logging: false })
        .then(() => console.log("同步数据库模型成功..."));
    } catch (error) {
      console.error("未能连接至服务器:", error);
    }
    DB.connecting = false;
  }
  constructor() {
    if (!DB.connecting) DB.Init();
  }
  async getModel<T extends keyof ModelClass>(type: T): Promise<ModelClass[T]> {
    return await import(`./model/${type}`).then((r) => {
      if (r?.init instanceof Function) r.init();
      return r?.default;
    });
  }
}
