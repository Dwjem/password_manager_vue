import {userInfoType} from '@/types/user';
import isEmpty from './isEmpty';

// 创建一个key
function creatStore(key: string) {
    window.localStorage.setItem(key, "");
}

// 设置一个store
function setStore(key: string, value: any, callback?: Function) {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        window.localStorage.setItem(key, value);
    }
    callback && callback({msg: "success", status: 200});
}

// 获取一个store
function getStore(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const value: string | null = window.localStorage.getItem(key);
        if (value && !isEmpty(value)) {
            try {
                return resolve(JSON.parse(value))
            } catch (e) {
                return resolve(value);
            }
        } else {
            creatStore(key)
            return reject(null);
        }
    })
}

// 同步获取一个store
function getStoreSync(key: string): any {
    const value: string | null = window.localStorage.getItem(key);
    if (value && !isEmpty(value)) {
        try {
            return JSON.parse(value)
        } catch (e) {
            return value
        }
    } else {
        creatStore(key)
        return null;
    }
}

// 删除一个store
function removeStore(key: string) {
    window.localStorage.removeItem(key);
}

// 删除所有store
function removeAllStore() {
    window.localStorage.clear();
}

// 给key新增一条数据
function addStore(key: string, value: any, callback?: Function) {
    getStore(key).then(
        (data: any[]) => {
            // 判断是否有这条key
            if (data) {
                data.push(value as never);
                setStore(key, data, callback);
            } else {
                setStore(key, [value]);
            }
        }, (err) => {
            setStore(key, [value], callback);
        })
}

// 新增一个用户
function addUser(value: userInfoType, callback: Function) {
    getStore("user_list").then(
        (data: userInfo[]) => {
            if (data) {
                const {username} = value;
                const index = data.findIndex(item => item.username === username);
                if (index === -1) {
                    addStore("user_list", value, callback)
                } else {
                    callback({msg: "用户名已存在", status: 200})
                }
            } else {
                addStore("user_list", value, callback)
            }
        }, (err) => {
            addStore("user_list", value, callback)
        })
}

// 判断指定key中是否存在某条数据
function byKeypath_existStore(key: string, keypath: string, value: any, callback?: Function) {
    getStore(key).then(
        (data: []) => {
            if (data) {
                const index = data.findIndex(item => item[keypath] === value);
                callback && callback(index >= 0 ? data[index] : false)
            } else {
                callback && callback(false)
            }
        }, (err) => {
            callback && callback(false)
        })
}

// 删除指定key中的某条记录
function byKeypath_removeStore(key: string, keypath: string, value: any) {
    getStore(key).then(
        (data: []) => {
            if (data) {
                const index = data.findIndex(item => item[keypath] === value);
                if (index >= 0) {
                    data.splice(index, 1);
                    setStore(key, data);
                } else {
                    console.log('byKeypath_removeStore: 未找到该key');
                }
            } else {
                console.log('byKeypath_removeStore: 未找到该key');
            }
        }, (err) => {
            console.log('byKeypath_removeStore: 未找到该key');
        })
}

// 获取登陆状态
function getUserInfoByStorage() {
    return JSON.parse(window.sessionStorage.getItem('userInfo') || '{}')
}

// 存储登录信息
function setUserInfoByStorage(userInfo: userInfoType) {
    window.sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
}

// 删除登录信息
function delUserInfoByStorage(key: string) {
    window.sessionStorage.removeItem('userInfo')
}


export {
    creatStore,
    setStore,
    getStore,
    getStoreSync,
    removeStore,
    removeAllStore,
    addStore,
    byKeypath_existStore,
    byKeypath_removeStore,
    addUser,
    getUserInfoByStorage,
    setUserInfoByStorage,
    delUserInfoByStorage
}


