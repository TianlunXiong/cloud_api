import { DataTypes, Model, Sequelize } from 'sequelize';
import CloudObjectModel from '../../../interface/service/db/model/CloudObject';
import { v4 as uuid } from 'uuid';
export default class CloudObject
  extends Model<CloudObjectModel, Pick<CloudObjectModel, 'name' | 'type'>>
  implements CloudObjectModel
{
  static HasInited = false;
  
  public id!: string;
  public cloud_object_id!: string;
  public name!: string;
  public type!: string;
  public current_commit_id!: string;
  public status!: string;
  public creator!: string;
  public create_time!: number;
  public update_time!: number;
}
export function init(sequelize: Sequelize) {
  if (!CloudObject.HasInited) {
    CloudObject.init(
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
          comment: '云组件名称'
        },
        cloud_object_id: {
          type: DataTypes.STRING(36),
          unique: true,
          allowNull: false,
          defaultValue: () => uuid(),
        },
        type: {
          type: DataTypes.STRING(32),
          allowNull: false,
          defaultValue: '0'
        },
        current_commit_id: {
          type: DataTypes.STRING(36),
          allowNull: true,
        },
        status: {
          type: DataTypes.STRING(32),
          allowNull: false,
          defaultValue: 0,
        },
        creator: {
          type: DataTypes.STRING(32),
          allowNull: false,
          defaultValue: 'test'
        },
      },
      {
        sequelize,
        tableName: 'cloud_object',
      },
    );
    CloudObject.HasInited = true;
  }
}