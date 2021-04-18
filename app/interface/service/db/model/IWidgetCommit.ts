export default interface IWidgetModel {
    id: string,
    name: string,
    type: number,
    widget_id: string,
    commit_id: string,
    src: string,
    pkg_name: string,
    pkg_version: string,
    creator: string,
    create_time?: number
}