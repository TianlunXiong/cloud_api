import { Injectable } from '@vikit/xnestjs';
import superagent from 'superagent';
import { URL } from 'url';

const COS = require('cos-nodejs-sdk-v5');
const COS_STS = require('qcloud-cos-sts');
const SECRET_ID = 'AKIDjX8VTCnrmzwgBQhsDSpxpVvZy94jQ6vT';
const SECRET_KEY = 'pPimai4HExrXx8KPEnCXgYGhuvhDUWIn';


var policy = {
  "version": "2.0",
  "statement": [
    {
      "action": [
        "name/cos:GetBucket"
      ],
      "effect": "allow",
      "resource": [
        "qcs::cos:ap-guangzhou:uid/1254430332:tainlx-1254430332/test/"
      ]
    }
  ]
};
COS_STS.getCredential({
  secretId: SECRET_ID,
  secretKey: SECRET_KEY,
  policy: policy,
  durationSeconds: 1800,
}, function (err: any, credentials: any) {
  console.log(err || credentials);
  var cos = new COS({
    getAuthorization: function (options: any, callback: any) {
        // 异步获取临时密钥
        callback({
          TmpSecretId: credentials.credentials.tmpSecretId,        // 临时密钥的 tmpSecretId
          TmpSecretKey: credentials.credentials.tmpSecretKey,      // 临时密钥的 tmpSecretKey
          XCosSecurityToken: credentials.credentials.sessionToken, // 临时密钥的 sessionToken
          ExpiredTime: credentials.expiredTime,               // 临时密钥失效时间戳，是申请临时密钥时，时间戳加 durationSeconds
      });
    }
  });
  cos.getBucket(
    {
      Bucket: "tainlx-1254430332" /* 必须 */,
      Region: "ap-guangzhou" /* 必须 */,
      Prefix: 'test/',
    },
    function (err: any, data: any) {
      console.log(err || data.Contents);
    }
  );
});


const cos = new COS({
  secretId: SECRET_ID,
  secretKey: SECRET_KEY,
  env: 'test',
})

type UploadParams = {
  file: string,
  dir?: string,
  name?: string,
}

// @Injectable
// class MyCOS {
//   public cos = cos;

//   async upload(params: UploadParams) {
//     return await cos.upload(params).done();
//   }

//   async getSignedURL(originalUrl: string) {
//     const url = new URL(originalUrl)
//     const body = await superagent
//       .post(CREDENTIAL_URL)
//       .send({ secretId: SECRET_ID, secretKey: SECRET_KEY })
//       .then(({ body }) => {
//         return body;
//       });
//     const { data: credit } = body;

//     const signedURL = await new Promise<string>((resolve) => {
//       const txcos = new TX_COS({
//         getAuthorization: function (options: any, callback: any) {
//           callback({
//             TmpSecretId: credit.credentials.tmpSecretId,
//             TmpSecretKey: credit.credentials.tmpSecretKey,
//             XCosSecurityToken: credit.credentials.sessionToken,
//             ExpiredTime: credit.expiredTime
//           });
//         }
//       })
  
//       const key = url.pathname;
  
//       txcos.getObjectUrl({
//         Bucket: credit.bucket,
//         Region: 'ap-beijing',
//         Key: key,
//         Sign: true,
//         Expires: 3600, // 单位秒
//       }, (err: any, data: any) => {
//         if (err) {
//           return;
//         }
//         resolve(data.Url);
//         return;
//       })
//     })
//     return signedURL;
//   }
// }

// export default MyCOS;