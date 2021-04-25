import CloudObject, { init as CloudObjectInit } from "./cloudObject";
import CloudObjectCommit, { init as CloudObjectCommitInit } from "./coudObjectCommit";

export {
  CloudObjectInit,
  CloudObjectCommitInit,
}


export type ModelClass = {
  cloudObject: typeof CloudObject;
  cloudObjectCommit: typeof CloudObjectCommit;
};

export type ModelInstance = {
  cloudObject: CloudObject;
  cloudObjectCommit: CloudObjectCommit,
}
