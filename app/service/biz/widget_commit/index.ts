import { Injectable } from '@vikit/xnestjs';
import { Op } from 'sequelize';
import DB from '../../db';
import Utils from '../../utils';
import {
  AddWidgetCommit,
  QueryWidgetCommit,
} from '../../../interface/api/request/widget';

const Response = Utils.Response;

/**
 * 提交组件 增删改查
 */
@Injectable
class DB_Component_Commit {
  constructor(private db: DB) {}

  async create(params: AddWidgetCommit) {
    try {
      const Model = await this.db.getModel('widgetCommit');
      const {
        name,
        pkg_name,
        pkg_version,
        creator,
        src,
        widget_id,
      } = params;
      await Model.create({
        name,
        pkg_name,
        pkg_version,
        creator,
        src,
        widget_id,
      });
      return Response.Success('提交组件成功');
    } catch (e) {
      return Response.Error(e);
    }
  }

  async retrieve(params: QueryWidgetCommit) {
    try {
      const Model = await this.db.getModel('widgetCommit');
      const { name, pkg_name, widget_id, commit_id } = params;
        const andCondition = [];
        if (widget_id) andCondition.push({ widget_id });
        if (name) andCondition.push({ name });
        if (pkg_name) andCondition.push({ pkg_name });
        if (pkg_name) andCondition.push({ pkg_name });
        if (commit_id) andCondition.push({ commit_id });
        
        const whereCondition = andCondition.length ? {
          [Op.and]: andCondition,
        } : undefined;

        const rsl = await Model.findAll({
          where: whereCondition,
        });
        return Response.Success(rsl);
    } catch (e) {
      return Response.Error(e);
    }
  }

  async update() {}

  async delete() {}
}

export default DB_Component_Commit;
