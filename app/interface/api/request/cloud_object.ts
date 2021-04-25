import CloudObjectModel from '../../service/db/model/CloudObject';
import CloudObjectCommitModel from '../../service/db/model/CloudObjectCommit';

export type AddCloudObject = Pick<CloudObjectModel, "name" | "type">;
export type DeleteCloudObject = Pick<CloudObjectModel, "name">;
export type QueryCloudObject = Partial<Pick<CloudObjectModel, "name" | "creator" | "cloud_object_id">>;
export type ReleaseCloudObject = Pick<CloudObjectCommitModel, "name" | "commit_id">
export type AddCloudObjectCommit = Pick<CloudObjectCommitModel, "cloud_object_id" | "name" | "src" | "pkg_name" | "pkg_version" | "creator">
export type QueryCloudObjectCommit = Partial<Pick<CloudObjectCommitModel, "cloud_object_id" | "commit_id" | "name" | "pkg_name" | "creator">>
