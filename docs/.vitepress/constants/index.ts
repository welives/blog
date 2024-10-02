/**
 * 有道 Web 发音 API 接口
 *
 * 英式发音：https://dict.youdao.com/dictvoice?audio=word&type=1
 * 美式发音：https://dict.youdao.com/dictvoice?audio=word&type=2
 */
export const PRONUNCIATION_API = 'https://dict.youdao.com/dictvoice?audio='

export enum PRONUNCIATION_PHONETIC_MAP {
  US = 'us',
  UK = 'uk',
  ZH = 'zh',
  JA = 'ja',
  ROMAJI = 'romaji',
}

export const PRONOUNCE_TYPE_NAME = {
  [PRONUNCIATION_PHONETIC_MAP.US]: '美音',
  [PRONUNCIATION_PHONETIC_MAP.UK]: '英音',
  [PRONUNCIATION_PHONETIC_MAP.ZH]: '拼音',
  [PRONUNCIATION_PHONETIC_MAP.JA]: '平假名',
  [PRONUNCIATION_PHONETIC_MAP.ROMAJI]: '罗马音',
} as const

export const SOUND_SETTINGS: App.ISoundSetting = {
  pronounceType: PRONUNCIATION_PHONETIC_MAP.US, // 默认美音
  pronounceTypeName: PRONOUNCE_TYPE_NAME[PRONUNCIATION_PHONETIC_MAP.US],
  autoplay: true,
  volume: 0.75, // 音量
}
