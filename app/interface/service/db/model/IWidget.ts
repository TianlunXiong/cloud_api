export default interface IWidgetModel {
  id: string;
  widget_id: string;
  name: string;
  type: number;
  current_commit_id: string;
  status: string;
  creator: string;
  create_time?: number;
  update_time?: number;
}
