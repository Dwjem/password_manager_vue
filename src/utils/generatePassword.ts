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
export function getDesc(key:string):string{
    if (!key)return ""
    switch(key){
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

export function generatePassword(config: pwdConfig): string {
    // 定义包含所需字符的字符串
    const uppercaseChars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars: string = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars: string = '0123456789';
    const symbolChars: string = '!@#$%^&*()_-+=<>?';

    const length = config.length ? config.length : 6,
        includeUppercase = config.includeUppercase,
        includeLowercase = config.includeLowercase!=undefined ? config.includeLowercase : true,
        includeNumbers = config.includeNumbers!=undefined ? config.includeNumbers : 6,
        includeSymbols = config.includeSymbols;

    // 初始化密码
    let password = '';

    // 构建密码字符集合
    let chars = '';
    if (includeUppercase) {
        chars += uppercaseChars;
    }
    if (includeLowercase) {
        chars += lowercaseChars;
    }
    if (includeNumbers) {
        chars += numberChars;
    }
    if (includeSymbols) {
        chars += symbolChars;
    }

    // 生成密码
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars.charAt(randomIndex);
    }

    return password;
}
