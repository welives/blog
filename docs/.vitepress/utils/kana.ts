import { ROMAJI_TO_HIRAGANA_MAP } from '../constants/kana'

export function isKanji(ch: string) {
  ch = ch[0]
  return (ch >= '\u4e00' && ch <= '\u9fcf') || (ch >= '\uf900' && ch <= '\ufaff') || (ch >= '\u3400' && ch <= '\u4dbf')
}

/**
 * 日文假名处理
 * @see https://github.com/andree-surya/moji4j
 */
export function romajiToHiragana(romaji: string): string {
  const changeStr: string = romaji.toLowerCase()
  const resultStr: string[] = changeStr.split('')

  for (let i = 0; i < changeStr.length - 1; i++) {
    const currentCharacter = changeStr[i]
    const nextCharacter = changeStr[i + 1]

    const isDoubleConsonant = currentCharacter == nextCharacter && currentCharacter !== 'n'
    const isExceptionalCase = currentCharacter == 't' && nextCharacter == 'c'

    if (isRomanConsonant(currentCharacter) && (isDoubleConsonant || isExceptionalCase)) {
      resultStr[i] = 'っ'
    }
  }

  let result = ''
  let currentOffset = 0
  while (currentOffset < resultStr.length) {
    const maxSubstringLength = Math.min(4, resultStr.length - currentOffset)

    for (let substringLength = maxSubstringLength; substringLength > 0; substringLength--) {
      const substring = resultStr.slice(currentOffset, currentOffset + substringLength)

      const replacementString: string = ROMAJI_TO_HIRAGANA_MAP[substring.join('')]

      if (replacementString !== void 0 && replacementString !== null) {
        result += replacementString
        currentOffset += substring.length
        break
      }

      if (substringLength == 1) {
        result += substring

        currentOffset += 1
        break
      }
    }
  }

  return result
}

function isRomanConsonant(character: string): boolean {
  return character >= 'a' && character <= 'z' && !isRomanVowel(character)
}

function isRomanVowel(character: string): boolean {
  return character == 'a' || character == 'i' || character == 'u' || character == 'e' || character == 'o'
}
