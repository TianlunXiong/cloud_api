import IWidget from '../../service/db/model/IWidget';
import IWidgetCommit from '../../service/db/model/IWidgetCommit';

export type AddWidget = Pick<IWidget, "name">;
export type DeleteWidget = Pick<IWidget, "name">;
export type QueryWidget = Partial<Pick<IWidget, "name" | "creator" | "widget_id">>;
export type AddWidgetCommit = Pick<IWidgetCommit, "widget_id" | "name" | "src" | "pkg_name" | "pkg_version" | "creator">
export type QueryWidgetCommit = Pick<IWidgetCommit, "widget_id" | "name" | "pkg_name" | "creator">
