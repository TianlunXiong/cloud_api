import { Injectable } from '@vikit/xnestjs';
import { Op } from 'sequelize';
import DB from '../../db';
import Utils from '../../utils';
import {
  AddWidget,
  QueryWidget,
  DeleteWidget,
} from '../../../interface/api/request/widget';

const Response = Utils.Response;

/**
 * 组件 增删改查(CRUD)
 */
@Injectable
class Biz_Widget {
  constructor(private db: DB) {}

  async create(params: AddWidget) {
    const { name } = params;
    try {
      const Model = await this.db.getModel('widget');
      const duplicated = await Model.findOne({
        where: {
          name
        },
      });
      if (!duplicated) {
        try {
          const p: AddWidget = {
            name
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

  async retrieve(params: QueryWidget = {}, findOne: boolean = false) {
    try {
      const Model = await this.db.getModel('widget');
      try {
        const { name, creator, widget_id } = params;
        const andCondition: { [key: string]: any }[] = [];
        if (widget_id) andCondition.push({ widget_id });
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

  async updateReleaseId(widget_id: string, releaseId: string) {
    try {
      const Model = await this.db.getModel('widget');
      try {
        const rsl = await Model.update(
          {
            current_commit_id: releaseId,
          },
          {
            where: {
              widget_id,
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

  async delete(params: DeleteWidget) {
    const { name } = params;
    try {
      const Model = await this.db.getModel('widget');
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

export default Biz_Widget;
