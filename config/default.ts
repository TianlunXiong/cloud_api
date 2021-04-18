export default {
  port: 8080,
  db: {
    database: "test_1",
    username: "tainlx",
    password: "1313567",
    host: "128.1.32.105",
    port: 55433,
    dialect: "postgres",
    logging: false,
  },
  txcos: {
    SECRET_ID: "AKIDjX8VTCnrmzwgBQhsDSpxpVvZy94jQ6vT",
    SECRET_KEY: "pPimai4HExrXx8KPEnCXgYGhuvhDUWIn",
    Bucket: "tainlx-1254430332",
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
              "qcs::cos:ap-guangzhou:uid/1254430332:tainlx-1254430332/*",
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
              "qcs::cos:ap-guangzhou:uid/1254430332:tainlx-1254430332/*",
            ],
          },
        ],
      },
    },
  },
};