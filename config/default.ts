import { join } from 'path';

const PWD = process.cwd();

export default {
  port: 8080,
  ws_port: 8082,
  apiType: join(PWD, './app/interface/api/index.ts'),
  db: {
    database: "cloud_test",
    username: "postgres",
    password: "1313567",
    host: "192.168.1.11",
    port: 55433,
    dialect: "postgres",
    logging: false,
  },
  txcos: {
    SECRET_ID: "AKIDjX8VTCnrmzwgBQhsDSpxpVvZy94jQ6vT",
    SECRET_KEY: "pPimai4HExrXx8KPEnCXgYGhuvhDUWIn",
    Bucket: "cloud-zip-1254430332",
    Region: "ap-guangzhou",

    durationSeconds: 1800,
    policies: {
      GetObject: {
        version: "2.0",
        statement: [
          {
            effect: "allow",
            action: ["name/cos:GetObject"],
            resource: [
              "qcs::cos:ap-guangzhou:uid/1254430332:cloud-zip-1254430332/*",
            ],
          },
        ],
      },
      PutObject: {
        version: "2.0",
        statement: [
          {
            effect: "allow",
            action: ["name/cos:PutObject"],
            resource: [
              "qcs::cos:ap-guangzhou:uid/1254430332:cloud-zip-1254430332/*",
            ],
          },
        ],
      },
    },
  },
};