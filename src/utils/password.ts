import IndexDB from "./indexDB";
import { message } from "ant-design-vue";
import { PASSWORD_DB_NAME } from "@/config";

// 数据库名称
const dbName: string = PASSWORD_DB_NAME;

interface IAddPwd {
  addRecord: (value: any) => void;
}


// 获取一个store
export function getPwdList(key: string) {
  // 创建一个 IndexDB 实例
}

/**
 *  添加密码
 *   @param menuName 菜单名称（表名）
 *   @param value 记录
 * */
export async function addPwd(menuName: string, value: any) {
  const db = new IndexDB(dbName, menuName);
  try {
    await db.addRecord(value);
    message.success("保存成功");
    db.close();
  } catch (e) {
    // 保存失败可能是因为要新建表，但是新建表需要增加版本号
    // 获取版本号
    const v = await db.getVersion();
    db.close();
    // 使用新的版本号创建一个 IndexDB 实例
    const db2 = new IndexDB(dbName, menuName, v + 1);
    // 重新添加记录
    await db2.addRecord(value);
    // 关闭数据库
    db2.close();
  }
}

/**
 * 添加一张表到数据库
 *  @param {string} storeName 表名
 *   @param {string} keyPath 键路径
 *   @param {string[]} indexNames 索引名数组
 * @returns {Promise<void>}
 * */
// export async function creatTabel(storeName: string, keyPath: string, indexNames: string[]) {
//   const db = new IndexDB(dbName, storeName);
//   await db.createTable(keyPath, indexNames);
//   db.close();
// }


