import WidgetModel, { init as WidgetModelInit } from "./widget";
import WidgetCommitModel, { init as WidgetCommitModelInit } from "./widgetCommit";

export type ModelClass = {
  widget: typeof WidgetModel;
  widgetCommit: typeof WidgetCommitModel;
};

export type ModelInstance = {
  widget: WidgetModel;
  widgetCommit: WidgetCommitModel,
}

export {
  WidgetModelInit,
  WidgetCommitModelInit,
}
