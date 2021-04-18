import { Injectable } from '@myfe/oasis';
import { Op } from 'sequelize';
import DB, { ModelInstance } from '../../db';
import {
  AddComponentRequest,
  QueryComponentRequest,
  DeleteComponentRequest,
} from '../../../controller/component/validator';
import { Response } from '../../../types/response';

/**
 * 组件 增删改查
 */
@Injectable
class DB_Component {
  constructor(private db: DB) {}

  async create(params: AddComponentRequest) {
    const { name } = params;
    try {
      const Model = await this.db.getModel('component');
      let duplicated = true;
      try {
        duplicated = await Model.findOne({
          where: {
            component_name: name,
            is_deleted: '0',
          },
        });
      } catch (e) {
        return Response.Error(e);
      }
      if (!duplicated) {
        try {
          const p: Partial<ModelInstance['component']> = {
            creator: 'test',
            component_id: this.db.getUUID(),
            component_name: name,
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

  async retrieve(params: QueryComponentRequest = {}, findOne: boolean = false) {
    try {
      const Model = await this.db.getModel('component');
      try {
        const { component_id, creator, component_name } = params;
        const andCondition: { [key: string]: any }[] = [{ is_deleted: '0' }];
        if (component_id) andCondition.push({ component_id });
        if (creator) andCondition.push({ creator });
        if (component_name) andCondition.push({ component_name });

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

  async updateReleaseId(component_id: string, releaseId: string) {
    try {
      const Model = await this.db.getModel('component');
      try {
        const rsl = await Model.update(
          {
            latest_release_id: releaseId,
          },
          {
            where: {
              component_id,
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

  async delete(params: DeleteComponentRequest) {
    const { name } = params;
    try {
      const Model = await this.db.getModel('component');
      let hasOne = false;
      try {
        hasOne = await Model.findOne({
          where: {
            component_name: name,
          },
        });
      } catch (e) {
        return Response.Error(e);
      }
      if (hasOne) {
        try {
          await Model.update({
            is_deleted: '1',
          }, {
            where: {
              component_name: name
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

export default DB_Component;
