import { Injectable } from '@vikit/xnestjs';
import COS from 'cos-nodejs-sdk-v5';
import config from 'config';

const STS = require('qcloud-cos-sts');
const COS_CONFIG: any = config.get('txcos');
@Injectable
export default class Cos {
  async getCredential(type = "GetObject") {
    return await new Promise<{
      sessionToken: string;
      tmpSecretId: string;
      tmpSecretKey: string;
    }>((resolve, reject) => {
      STS.getCredential(
        {
          secretId: COS_CONFIG.SECRET_ID,
          secretKey: COS_CONFIG.SECRET_KEY,
          policy: COS_CONFIG.policies[type],
          durationSeconds: 1800,
        },
        function (err: any, credentials: any) {
          if (err) {
            reject(err);
          }
          resolve(credentials);
        }
      );
    });
  }
}

