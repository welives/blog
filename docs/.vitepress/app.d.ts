declare namespace App {
  /** 有道Web发音API的发音类型 */
  type PronounceType = 'us' | 'uk' | 'zh' | 'ja' | 'romaji'
  /** 音标类型 */
  type PhoneticType = 'us' | 'uk' | 'zh' | 'ja' | 'romaji'

  type LanguageType = 'en' | 'zh' | 'ja' | 'romaji'

  type LanguageCategoryType = 'en' | 'ja' | 'zh'
  /** 发音类型和音标的映射关系 */
  type PronounceToPhoneticMap = Record<PronounceType, PhoneticType>

  /** 罗马注音和平假名的对应关系 */
  interface IRomajiToHiragana {
    [key: string]: string
  }

  /** 声音设置 */
  interface ISoundSetting {
    pronounceType: PronounceType
    pronounceTypeName: string
    autoplay: boolean
    volume: number
  }
}
