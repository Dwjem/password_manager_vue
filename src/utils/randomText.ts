function getRandomChineseCharacter(): string {
    const min = 0x4E00; // 基本汉字Unicode范围
    const max = 0x9FA5; // 常用汉字Unicode范围
    return String.fromCharCode(Math.floor(Math.random() * (max - min + 1)) + min);
}

/**
 * 
 * @param length 字符串的长度, 默认10个字
 * @returns 返回生成的汉字
 */
function generateRandomText(length: number=10): string {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += getRandomChineseCharacter();
    }
    return result;
}
export default generateRandomText;
