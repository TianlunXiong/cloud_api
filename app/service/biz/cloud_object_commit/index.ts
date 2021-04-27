import { Injectable } from '@vikit/xnestjs';
import { Op } from 'sequelize';
import DB from '../../db';
import Utils from '../../utils';
import {
  AddCloudObjectCommit,
  QueryCloudObjectCommit,
  UpdateCloudObjectCommit,
} from '../../../interface/api/request/cloud_object';

const Response = Utils.Response;

/**
 * 提交组件 增删改查
 */
@Injectable
class DB_Component_Commit {
  constructor(private db: DB) {}

  async create(params: AddCloudObjectCommit) {
    try {
      const Model = await this.db.getModel('cloudObjectCommit');
      const {
        name,
        pkg_name,
        pkg_version,
        creator,
        cloud_object_id,
      } = params;
      const d = await Model.create({
        name,
        pkg_name,
        pkg_version,
        creator,
        cloud_object_id,
      });
      return Response.Success({
        msg: '提交成功',
        commit_id: d.commit_id,
      });
    } catch (e) {
      return Response.Error(e);
    }
  }

  async retrieve(params: QueryCloudObjectCommit) {
    try {
      const Model = await this.db.getModel('cloudObjectCommit');
      const { name, pkg_name, cloud_object_id, commit_id } = params;
        const andCondition = [];
        if (cloud_object_id) andCondition.push({ cloud_object_id });
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

  async update(params: UpdateCloudObjectCommit) {
    try {
      const Model = await this.db.getModel('cloudObjectCommit');
      const { commit_id, src } = params;
      await Model.update(
        {
          src,
        },
        {
          where: {
            commit_id,
          },
        },
      );
      return Response.Success("更新成功");
    } catch (e) {
      return Response.Error(e);
    }
  }

  async delete() {}
}

export default DB_Component_Commit;
