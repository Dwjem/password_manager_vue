/**
 * 生成符合条件的密码
 * @param length 密码长度
 * @param includeUppercase 是否包含大写字母
 * @param includeLowercase 是否包含小写字母
 * @param includeNumbers 是否包含数字
 * @param includeSymbols 是否包含符号
 * @returns 符合条件的密码
 */
export interface pwdConfig {
    length: number;
    includeUppercase: boolean;
    includeLowercase: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;
}

export function getDesc(key: string): string {
    if (!key) return ""
    switch (key) {
        case "length":
            return '密码长度'
        case 'includeUppercase':
            return '包含大写字母'
        case 'includeLowercase':
            return '包含小写字母'
        case 'includeNumbers':
            return '包含数字'
        case 'includeSymbols':
            return '包含符号'
        default:
            return key
    }
}

export const configDic = {
    length:{
        desc: "密码长度",
        str: ""
    },
    includeUppercase: {
        desc: "包含大写字母",
        str: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    },
    includeLowercase: {
        desc: "包含小写字母",
        str: "abcdefghijklmnopqrstuvwxyz"
    },
    includeNumbers: {
        desc: "包含数字",
        str: "0123456789"
    },
    includeSymbols: {
        desc: "包含符号",
        str: "!@#$%^&*()_-+=<>?"
    },
}

export function generatePassword({chars,length}): string {
    // 初始化密码
    let password = '';

    // 生成密码
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars.charAt(randomIndex);
    }
    return password;
}
