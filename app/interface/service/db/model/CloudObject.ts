export default interface CloudObjectModel {
  id: string;
  cloud_object_id: string;
  name: string;
  type: string;
  current_commit_id: string;
  status: string;
  creator: string;
  create_time?: number;
  update_time?: number;
}
