export default interface CloudObjectCommitModel {
  id: string;
  name: string;
  cloud_object_id: string;
  commit_id: string;
  src: string;
  pkg_name: string;
  pkg_version: string;
  creator: string;
  create_time?: number;
}