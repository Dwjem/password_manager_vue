import IndexDB from "./indexDB"

const dbName = 'background';
const storeName = 'background';
export async function saveImage({key, base64Image}) {
    console.log({key, base64Image})
    // 创建一个 IndexDB 实例
    const db = new IndexDB(dbName, storeName);

    const record = {id: key, image: base64Image};

    await db.addRecord(record);

    db.close();

    // // 获取所有记录
    // const records = await db.getRecords();
    // console.log(records);
    //
    // // 获取存储的图片
    // const storedRecord = await db.getRecordsByKey(key);
    // console.log(storedRecord);
}

/**
 * 根据键值获取记录
 * @param {string} key 键值名称
 * @returns {Promise<any>} 匹配的记录
 */
export function getImageByKey(key){
    const db = new IndexDB(dbName, storeName);
    return db.getRecordsByKey(key)
}