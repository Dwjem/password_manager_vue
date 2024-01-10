import pinyin from 'pinyin'

function convertToPinyin(chinese) {
    var result = '';

    for (var i = 0; i < chinese.length; i++) {
        var charCode = chinese[i].charCodeAt();

        if ((charCode >= 48 && charCode <= 57) ||   // 数字
            (charCode >= 65 && charCode <= 90) ||   // 大写英文字母
            (charCode >= 97 && charCode <= 122)) {  // 小写英文字母

            result += chinese[i];                      // 保持原样输出
        } else {
            var pyArr = pinyin(chinese[i], {style: pinyin.STYLE_NORMAL});
            result += pyArr[0][0];                       // 取得拼音的第一个字符作为结果
        }
    }

    return result;
}


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
function generateRandomText(length: number = 10): string {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += getRandomChineseCharacter();
    }
    return result;
}

export {generateRandomText, convertToPinyin};