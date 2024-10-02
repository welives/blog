import { PRONUNCIATION_PHONETIC_MAP, PRONUNCIATION_API } from '../constants'
import { romajiToHiragana } from './kana'

/**
 * 生成有道的发音API链接
 * @param word 单词
 * @param pronunciation 发音类型
 * @returns
 */
export function generateWordSoundSrc(word: string, pronunciation: Exclude<App.PronounceType, false>) {
  switch (pronunciation) {
    case PRONUNCIATION_PHONETIC_MAP.UK:
      return `${PRONUNCIATION_API}${word}&type=1`
    case PRONUNCIATION_PHONETIC_MAP.US:
      return `${PRONUNCIATION_API}${word}&type=2`
    case PRONUNCIATION_PHONETIC_MAP.ZH:
      return `${PRONUNCIATION_API}${word}&le=zh`
    case PRONUNCIATION_PHONETIC_MAP.JA:
      return `${PRONUNCIATION_API}${word}&le=jap`
    case PRONUNCIATION_PHONETIC_MAP.ROMAJI:
      return `${PRONUNCIATION_API}${romajiToHiragana(word)}&le=jap`
    default:
      return ''
  }
}
