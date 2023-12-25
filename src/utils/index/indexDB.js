export default class IndexDB {
    /**
     * 创建一个 IndexDB 实例
     * @param {string} dbName 数据库名称
     * @param {string} storeName 存储对象名称
     */
    constructor(dbName, storeName) {
        this.dbName = dbName;
        this.storeName = storeName;
        this.db = null;
    }

    /**
     * 打开数据库并创建存储对象和索引（如果不存在）
     * @returns {Promise<IDBDatabase>} 打开的数据库实例
     */
    async open() {
        return new Promise((resolve, reject) => {
            // 打开数据库
            const request = window.indexedDB.open(this.dbName, 1);

            request.onerror = function (event) {
                reject(event.target.error);
            };

            request.onsuccess = event => {
                this.db = event.target.result;
                resolve(this.db);
            };

            // 创建一个新的存储对象
            request.onupgradeneeded = event => {
                const db = event.target.result;

                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    // 创建一个新的索引
                    // store.createIndex(this.storeName, this.dbName, { unique: false });
                }
            };
        });
    }

    /**
     * 添加一条记录到数据库
     * @param {object} record 记录对象
     * @returns {Promise<any>} 添加的记录
     */
    async addRecord(record) {
        if (!this.db) {
            // 如果数据库还没有打开，先打开数据库
            await this.open();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);

            // 添加一条记录
            const request = store.add(record);

            request.onerror = event => {
                console.error('Failed to add record:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = event => {
                resolve(event.target.result);
            };
        });
    }

    /**
     * 获取数据库中的所有记录
     * @returns {Promise<any[]>} 所有记录的数组
     */
    async getRecords() {
        if (!this.db) {
            // 如果数据库还没有打开，先打开数据库
            await this.open();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);

            // 获取所有记录
            const request = store.getAll();

            request.onerror = event => {
                console.error('Failed to get records:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = event => {
                resolve(event.target.result);
            };
        });
    }

    /**
     * 根据 ID 删除一条记录
     * @param {number} id 记录的 ID
     * @returns {Promise<any>} 被删除的记录
     */
    async deleteRecord(id) {
        if (!this.db) {
            // 如果数据库还没有打开，先打开数据库
            await this.open();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);

            // 删除一条记录
            const request = store.delete(id);

            request.onerror = event => {
                console.error('Failed to delete record:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = event => {
                resolve(event.target.result);
            };
        });
    }

    /**
     * 根据索引和值获取记录
     * @param {object} options 索引和值的对象
     * @param {string} options.index 索引名称
     * @param {any} options.value 索引的值
     * @returns {Promise<any>} 匹配的记录
     */
    async getRecordsByIndex({index, value}) {
        if (!this.db) {
            // 如果数据库还没有打开，先打开数据库
            await this.open();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);

            // 根据索引和值获取记录
            const request = store.index(index).get(value);

            request.onerror = event => {
                console.error('Failed to get records:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = event => {
                resolve(event.target.result);
            };
        });
    }

    /**
     * 根据键值获取记录
     * @param {string} key 键值名称
     * @returns {Promise<any>} 匹配的记录
     */
    async getRecordsByKey(key) {
        if (!this.db) {
            // 如果数据库还没有打开，先打开数据库
            await this.open();
        }
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);

            // 使用 get() 方法获取指定 key 值的记录
            const request = store.get(key);

            request.onerror = event => {
                console.error('Failed to get records:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = event => {
                resolve(event.target.result);
            };


        });
    }

    /**
     * 关闭数据库
     * */
    close(){
        this.db.close()
    }
}
