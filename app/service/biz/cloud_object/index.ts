import { Injectable } from '@vikit/xnestjs';
import { Op } from 'sequelize';
import DB from '../../db';
import Utils from '../../utils';
import {
  AddCloudObject,
  QueryCloudObject,
  DeleteCloudObject,
  ReleaseCloudObject
} from '../../../interface/api/request/cloud_object';

const Response = Utils.Response;

/**
 * 组件 增删改查(CRUD)
 */
@Injectable
class Biz_Cloud_Object {
  constructor(private db: DB) {}

  async create(params: AddCloudObject) {
    const { name, type } = params;
    try {
      const Model = await this.db.getModel('cloudObject');
      const duplicated = await Model.findOne({
        where: {
          name
        },
      });
      if (!duplicated) {
        try {
          const p: AddCloudObject = {
            name,
            type
          };
          await Model.create(p);
        } catch (e) {
          return Response.Error(e);
        }
        return Response.Success('组件创建成功');
      } else {
        return Response.NotSuccess('组件名称重复');
      }
    } catch (e) {
      return Response.Error(e);
    }
  }

  async retrieve(params: QueryCloudObject = {}, findOne: boolean = false) {
    try {
      const Model = await this.db.getModel('cloudObject');
      try {
        const { name, creator, cloud_object_id } = params;
        const andCondition: { [key: string]: any }[] = [];
        if (cloud_object_id) andCondition.push({ cloud_object_id });
        if (creator) andCondition.push({ creator });
        if (name) andCondition.push({ name });

        const whereCondition = andCondition.length ? {
          [Op.and]: andCondition,
        } : undefined;

        const rsl = await Model[findOne ? 'findOne' : 'findAll']({
          where: whereCondition,
          attributes: {
            exclude: ['id', 'is_deleted']
          }
        });
        return Response.Success(rsl);
      } catch (e) {
        return Response.Error(e);
      }
    } catch (e) {
      return Response.Error(e);
    }
  }

  async updateReleaseId(params: ReleaseCloudObject) {
    try {
      const Model = await this.db.getModel('cloudObject');
      try {
        const rsl = await Model.update(
          {
            current_commit_id: params.commit_id,
          },
          {
            where: {
              name: params.name,
            },
          },
        );
        return Response.Success(rsl);
      } catch (e) {
        console.log(e);
        return Response.Error(e);
      }
    } catch (e) {
      return Response.Error(e);
    }
  }

  async delete(params: DeleteCloudObject) {
    const { name } = params;
    try {
      const Model = await this.db.getModel('cloudObject');
      let hasOne = null;
      try {
        hasOne = await Model.findOne({
          where: {
            name,
          },
        });
      } catch (e) {
        return Response.Error(e);
      }
      if (hasOne) {
        try {
          await Model.update({
            status: '1',
          }, {
            where: {
              name
            }
          })
        } catch (e) {
          return Response.Error(e);
        }
        return Response.Success('组件删除成功');
      } else {
        return Response.NotSuccess('组件不存在');
      }
    } catch (e) {
      return Response.Error(e);
    }
  }
}

export default Biz_Cloud_Object;
