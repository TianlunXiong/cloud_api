import { Injectable } from '@myfe/oasis';
import { Op } from 'sequelize';
import DB, { ModelInstance } from '../../db';
import {
  QueryComponentCommitRequest,
  DB_ComponentCommitRequest,
} from '../../../controller/component/validator';
import { Response } from '../../../types/response';

/**
 * 提交组件 增删改查
 */
@Injectable
class DB_Component_Commit {
  constructor(private db: DB) {}

  getUUID() {
    return this.db.getUUID();
  }

  async create(params: DB_ComponentCommitRequest) {
    try {
      const Model = await this.db.getModel('component_commit');
      const {
        component_id,
        creator,
        src_url,
        comment,
        component_name,
        package_name,
        package_version,
        component_commit_id,
      } = params;
      const p: Partial<ModelInstance['component_commit']> = {
        creator,
        component_id,
        src_url,
        component_commit_id,
        component_name,
        package_name,
        package_version,
      };
      if (comment) p.comment = comment;
      await Model.create(p);
      return Response.Success('提交组件成功');
    } catch (e) {
      return Response.Error(e);
    }
  }

  async retrieve(params: QueryComponentCommitRequest, noComponentId = true) {
    try {
      const Model = await this.db.getModel('component_commit');
      const { component_id, creator, component_name, component_commit_id } = params;
        const andCondition = [];
        if (component_id) andCondition.push({ component_id });
        if (component_commit_id) andCondition.push({ component_commit_id });
        if (component_name) andCondition.push({ component_name });
        if (creator) andCondition.push({ creator });
        
        const whereCondition = andCondition.length ? {
          [Op.and]: andCondition,
        } : undefined;

        const rsl = await Model.findAll({
          where: whereCondition,
          attributes: {
            exclude: noComponentId ? ['id', 'component_id'] : ['id'],
            include: ['update_time']
          }
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
