import { DataTypes, Model, Sequelize } from "sequelize";
import CloudObjectCommitModel from "../../../interface/service/db/model/CloudObjectCommit";
import { v4 as uuid } from 'uuid';

class CloudObjectCommit
  extends Model<
    CloudObjectCommitModel,
    Pick<
      CloudObjectCommitModel,
      "name" | "pkg_name" | "pkg_version" | "creator" | "cloud_object_id"
    >
  >
  implements CloudObjectCommitModel {
  static HasInited = false;

  id!: string;
  name!: string;
  cloud_object_id!: string;
  commit_id!: string;
  src!: string;
  pkg_name!: string;
  pkg_version!: string;
  creator!: string;
  create_time!: number;
}

export function init(sequelize: Sequelize) {
  if (!CloudObjectCommit.HasInited) {
    CloudObjectCommit.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        cloud_object_id: {
          type: DataTypes.STRING(36),
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
          defaultValue: ''
        },
        pkg_name: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        pkg_version: {
          type: DataTypes.TEXT,
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
        tableName: "cloud_object_commit"
      }
    );
    CloudObjectCommit.HasInited = true;
  }
}

export default CloudObjectCommit;
