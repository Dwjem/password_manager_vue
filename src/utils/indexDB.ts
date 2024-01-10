export default class IndexDB {
    /**
     * 创建一个 IndexDB 实例
     * @param {string} dbName 数据库名称
     * @param {string} storeName 存储对象名称
     * @param {number} v 版本号
     */
    constructor(dbName: string, storeName: string, v: number) {
        this.dbName = dbName;
        this.storeName = storeName;
        this.version = v;
        this.db = null;
    }

    /**
     * 打开数据库并创建存储对象和索引（如果不存在）
     * @returns {Promise<IDBDatabase>} 打开的数据库实例
     */
    async open() {
        // console.log(this.dbName, "Opening", this.storeName ," database...")
        return new Promise((resolve, reject) => {
            // 打开数据库
            const request = window.indexedDB.open(this.dbName, this.version);

            request.onerror = function (event) {
                reject(event.target.error);
            };

            request.onsuccess = event => {
                this.db = event.target.result;
                resolve(this.db);
            };

            // 数据库不存在或版本号较低
            request.onupgradeneeded = event => {
                // console.log("数据库不存在或版本号较低")
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    // 创建一个新的索引
                    // store.createIndex(this.storeName, this.dbName, {unique: false});
                }
            };
        });
    }

    /**
     * 获取版本号
     * */
    async getVersion() {
        if (!this.db) {
            // 如果数据库还没有打开，先打开数据库
            await this.open();
        }
        return new Promise((resolve) => {
            resolve(this.db.version);
        })
    }

    /**
     * 添加一条记录到数据库
     * @param {object} record 记录对象
     * @returns {Promise<any>} 添加的记录
     */
    async addRecord(record: any): Promise<unknown> {
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
     * 覆盖所有记录
     * @param {object[]} records 记录数组
     * @returns {Promise<void>}
     * */
    async setRecords(records: []): Promise<unknown> {
        if (!this.db) {
            // 如果数据库还没有打开，先打开数据库
            await this.open();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);

            // 删除所有记录
            const request = store.clear();

            request.onerror = event => {
                console.error('Failed to clear records:', event.target.error);
                reject(event.target.error);
            }

            request.onsuccess = event => {
                // 添加新的记录
                records.forEach(record => {
                    const request = store.add(record);

                    request.onerror = event => {
                        console.error('Failed to add record:', event.target.error);
                        reject(event.target.error);
                    };

                    request.onsuccess = event => {
                        // 忽略成功的结果
                    };
                });

                resolve();
            };
        });
    }

    /**
     * 获取数据库中的所有记录
     * @returns {Promise<any[]>} 所有记录的数组
     */
    async getAllRecords(): Promise<unknown> {
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
    async deleteRecord(id: number): Promise<unknown> {
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
     * 根据 ID 批量删除记录
     *  @param {number[]} ids 记录的 ID 数组
     * @returns {Promise<any>} 被删除的记录
     * */
    async deleteRecords(ids: number[]): Promise<unknown> {
        if (!this.db) {
            // 如果数据库还没有打开，先打开数据库
            await this.open();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);

            // 批量删除记录
            const requests = ids.map(id => store.delete(id));

            // 监听所有删除请求的完成状态
            Promise.all(requests).then(results => {
                resolve(results);
            }).catch(error => {
                console.error('Failed to delete records:', error);
                reject(error);
            });
        });
    }

    /**
     * 删除所有记录
     * @returns {Promise<any>} 所有被删除的记录
     * */
    async deleteAllRecords(): Promise<unknown> {
        if (!this.db) {
            // 如果数据库还没有打开，先打开数据库
            await this.open();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);

            // 删除所有记录
            const request = store.clear();

            request.onerror = event => {
                console.error('Failed to delete all records:', event.target.error);
                reject(event.target.error);
            }

            request.onsuccess = event => {
                resolve(event.target.result);
            }
        });
    }

    /**
     * 根据索引和值获取记录
     * @param {object} options 索引和值的对象
     * @param {string} options.index 索引名称
     * @param {any} options.value 索引的值
     * @returns {Promise<any>} 匹配的记录
     */
    async getRecordsByIndex({index, value}): Promise<unknown> {
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
    async getRecordsByKey(key: string): Promise<unknown> {
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
    close() {
        this.db.close()
        // console.log(this.dbName + " close db")
    }
}
