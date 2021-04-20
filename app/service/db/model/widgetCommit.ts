import { DataTypes, Model, Sequelize } from "sequelize";
import WidgetCommitModel from "../../../interface/service/db/model/IWidgetCommit";
import { v4 as uuid } from 'uuid';

class WidgetCommit
  extends Model<
    WidgetCommitModel,
    Pick<
      WidgetCommitModel,
      "name" | "pkg_name" | "pkg_version" | "src" | "creator" | "widget_id"
    >
  >
  implements WidgetCommitModel {
  static HasInited = false;

  id!: string;
  name!: string;
  widget_id!: string;
  commit_id!: string;
  src!: string;
  pkg_name!: string;
  pkg_version!: string;
  creator!: string;
  create_time!: number;
}

export function init(sequelize: Sequelize) {
  if (!WidgetCommit.HasInited) {
    WidgetCommit.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING(100),
          unique: true,
          allowNull: false,
        },
        widget_id: {
          type: DataTypes.STRING(36),
          unique: true,
          allowNull: false,
        },
        commit_id: {
          type: DataTypes.STRING(36),
          unique: true,
          allowNull: false,
          defaultValue: () => uuid(),
        },
        src: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        pkg_name: {
          type: DataTypes.TEXT,
          unique: true,
          allowNull: false,
        },
        pkg_version: {
          type: DataTypes.TEXT,
          unique: true,
          allowNull: false,
        },
        creator: {
          type: DataTypes.STRING(32),
          allowNull: false,
          defaultValue: "test",
        },
      },
      {
        sequelize,
        tableName: "widget_commit"
      }
    );
    WidgetCommit.HasInited = true;
  }
}

export default WidgetCommit;
