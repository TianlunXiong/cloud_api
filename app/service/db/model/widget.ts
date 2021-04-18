import { DataTypes, Model, Sequelize } from 'sequelize';
import WidgetModel from '../../../interface/service/db/model/IWidget';

export default class Widget extends Model<WidgetModel> {
  static HasInited = false;
}
export function init(sequelize: Sequelize) {
  if (!Widget.HasInited) {
    Widget.init(
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
        type: {
          type: DataTypes.SMALLINT,
          allowNull: false,
        },
        current_commit_id: {
          type: DataTypes.STRING(36),
          allowNull: true,
        },
        status: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
        },
        creator: {
          type: DataTypes.STRING(32),
          allowNull: false,
          defaultValue: ''
        }
      },
      {
        sequelize,
        tableName: 'component',
        timestamps: false,
      },
    );
    Widget.HasInited = true;
  }
}