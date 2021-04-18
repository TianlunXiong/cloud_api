import { DataTypes, Model, Sequelize } from 'sequelize';
import WidgetCommitModel from '../../../interface/service/db/model/IWidgetCommit';

class WidgetCommit extends Model<WidgetCommitModel> {
  static HasInited = false;
}

export function init(sequelize: Sequelize) {
  if (!WidgetCommit.HasInited) {
    WidgetCommit.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
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
        },
        type: {
          type: DataTypes.SMALLINT,
          allowNull: false,
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
          defaultValue: ''
        }
      },
      {
        sequelize,
        tableName: 'component_commit',
        timestamps: false,
        paranoid: true,
        createdAt: 'add_time',
        updatedAt: 'update_time',
      },
    );
    WidgetCommit.HasInited = true;
  }
}


export default WidgetCommit;