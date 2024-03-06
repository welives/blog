---
title: 常用工具封装
---

## Axios

我自用的`axios`单例模式封装，思路参考自 `UmiJS 4`

::: code-group

```ts [http.ts]
// @ts-expect-error
import utils from 'axios/unsafe/utils'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios'
import axios from 'axios'
import requestConfig from './config'

type RequestError = AxiosError | Error

interface IRequestOptions extends AxiosRequestConfig {
  skipErrorHandler?: boolean
  getResponse?: boolean
  requestInterceptors?: IRequestInterceptorTuple[]
  responseInterceptors?: IResponseInterceptorTuple[]
  [key: string]: any
}

interface IRequest<T = any> {
  (url: string, opts?: IRequestOptions): Promise<T>
}

interface IUpload<T = any, D = any> {
  (url: string, data: D, opts?: IRequestOptions): Promise<T>
}

interface IErrorHandler {
  (error: RequestError, opts: IRequestOptions): void
}

type IRequestInterceptor = (
  config: IRequestOptions & InternalAxiosRequestConfig
) => IRequestOptions & InternalAxiosRequestConfig
type IResponseInterceptor = (response: AxiosResponse) => AxiosResponse
type IErrorInterceptor = (error: AxiosError) => Promise<AxiosError>

type IRequestInterceptorTuple =
  | [IRequestInterceptor, IErrorInterceptor]
  | [IRequestInterceptor]
  | IRequestInterceptor
type IResponseInterceptorTuple =
  | [IResponseInterceptor, IErrorInterceptor]
  | [IResponseInterceptor]
  | IResponseInterceptor

interface RequestConfig<T = any> extends AxiosRequestConfig {
  errorConfig?: {
    errorHandler?: IErrorHandler
    errorThrower?: (res: T) => void
  }
  requestInterceptors?: IRequestInterceptorTuple[]
  responseInterceptors?: IResponseInterceptorTuple[]
}

const singletonEnforcer = Symbol('AxiosRequest')

class AxiosRequest {
  private static _instance: AxiosRequest
  private readonly service: AxiosInstance
  private config: RequestConfig = {
    // TODO 改成你的基础路径
    baseURL: 'http://localhost',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  }
  constructor(enforcer: any) {
    if (enforcer !== singletonEnforcer) {
      throw new Error('Cannot initialize Axios client single instance')
    }
    this.mergeConfig()
    this.service = axios.create(this.config)
    // 请求拦截
    this.config?.requestInterceptors?.forEach((interceptor) => {
      interceptor instanceof Array
        ? this.service.interceptors.request.use(interceptor[0], interceptor[1])
        : this.service.interceptors.request.use(interceptor)
    })
    // 响应拦截
    this.config?.responseInterceptors?.forEach((interceptor) => {
      interceptor instanceof Array
        ? this.service.interceptors.response.use(interceptor[0], interceptor[1])
        : this.service.interceptors.response.use(interceptor)
    })
  }
  /**
   * 创建唯一实例
   */
  static get instance() {
    // 如果已经存在实例则直接返回, 否则实例化后返回
    this._instance || (this._instance = new AxiosRequest(singletonEnforcer))
    return this._instance
  }
  /**
   * 合并请求参数
   */
  private mergeConfig() {
    this.config = utils.merge(this.config, requestConfig)
  }
  /**
   * 获取需要移除的拦截器
   * @param opts
   */
  private getInterceptorsEject(opts: {
    requestInterceptors?: IRequestInterceptorTuple[]
    responseInterceptors?: IResponseInterceptorTuple[]
  }) {
    const { requestInterceptors, responseInterceptors } = opts
    const requestInterceptorsToEject = requestInterceptors?.map((interceptor) => {
      return interceptor instanceof Array
        ? this.service.interceptors.request.use(interceptor[0], interceptor[1])
        : this.service.interceptors.request.use(interceptor)
    })
    const responseInterceptorsToEject = (responseInterceptors as IResponseInterceptorTuple[])?.map(
      (interceptor) => {
        return interceptor instanceof Array
          ? this.service.interceptors.response.use(interceptor[0], interceptor[1])
          : this.service.interceptors.response.use(interceptor)
      }
    )
    return { requestInterceptorsToEject, responseInterceptorsToEject }
  }
  /**
   * 移除拦截器
   * @param opts
   */
  private removeInterceptors(opts: {
    requestInterceptorsToEject?: number[]
    responseInterceptorsToEject?: number[]
  }) {
    const { requestInterceptorsToEject, responseInterceptorsToEject } = opts
    requestInterceptorsToEject?.forEach((interceptor) => {
      this.service.interceptors.request.eject(interceptor)
    })
    responseInterceptorsToEject?.forEach((interceptor) => {
      this.service.interceptors.response.eject(interceptor)
    })
  }
  /**
   * 基础请求
   * @param url 接口地址
   * @param opts 请求参数
   */
  request: IRequest = (url: string, opts = { method: 'GET' }) => {
    const { getResponse = false, requestInterceptors, responseInterceptors } = opts
    const { requestInterceptorsToEject, responseInterceptorsToEject } = this.getInterceptorsEject({
      requestInterceptors,
      responseInterceptors,
    })
    return new Promise((resolve, reject) => {
      this.service
        .request({ ...opts, url })
        .then((res) => {
          this.removeInterceptors({ requestInterceptorsToEject, responseInterceptorsToEject })
          resolve(getResponse ? res : res.data)
        })
        .catch((error) => {
          this.removeInterceptors({ requestInterceptorsToEject, responseInterceptorsToEject })
          try {
            const handler = this.config?.errorConfig?.errorHandler
            if (handler) handler(error, opts)
          } catch (e) {
            reject(e)
          } finally {
            reject(error) // 如果不想把错误传递到方法调用处的话就去掉这个 finally
          }
        })
    })
  }
  /**
   * 上传
   * @param url 接口地址
   * @param opts 请求参数
   */
  upload: IUpload = (url: string, data, opts = {}) => {
    opts.headers = opts.headers ?? { 'Content-Type': 'multipart/form-data' }
    const { getResponse = false, requestInterceptors, responseInterceptors } = opts
    const { requestInterceptorsToEject, responseInterceptorsToEject } = this.getInterceptorsEject({
      requestInterceptors,
      responseInterceptors,
    })
    return new Promise((resolve, reject) => {
      this.service
        .post(url, data, opts)
        .then((res) => {
          this.removeInterceptors({ requestInterceptorsToEject, responseInterceptorsToEject })
          resolve(getResponse ? res : res.data)
        })
        .catch((error) => {
          this.removeInterceptors({ requestInterceptorsToEject, responseInterceptorsToEject })
          try {
            const handler = this.config?.errorConfig?.errorHandler
            if (handler) handler(error, opts)
          } catch (e) {
            reject(e)
          } finally {
            reject(error)
          }
        })
    })
  }
  /**
   * 下载
   * @param url 资源地址
   * @param opts 请求参数
   */
  download: IRequest = (url: string, opts = {}) => {
    opts.responseType = opts.responseType ?? 'blob'
    const { getResponse = false, requestInterceptors, responseInterceptors } = opts
    const { requestInterceptorsToEject, responseInterceptorsToEject } = this.getInterceptorsEject({
      requestInterceptors,
      responseInterceptors,
    })
    return new Promise((resolve, reject) => {
      this.service
        .get(url, opts)
        .then((res) => {
          this.removeInterceptors({ requestInterceptorsToEject, responseInterceptorsToEject })
          resolve(getResponse ? res : res.data)
        })
        .catch((error) => {
          this.removeInterceptors({ requestInterceptorsToEject, responseInterceptorsToEject })
          try {
            const handler = this.config?.errorConfig?.errorHandler
            if (handler) handler(error, opts)
          } catch (e) {
            reject(e)
          } finally {
            reject(error)
          }
        })
    })
  }
}

const requestInstance = AxiosRequest.instance
const request = requestInstance.request
const upload = requestInstance.upload
const download = requestInstance.download
export { requestInstance, request, upload, download }
export type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  RequestError,
  RequestConfig,
  IResponseInterceptor as ResponseInterceptor,
  IRequestOptions as RequestOptions,
  IRequest as Request,
  IUpload as Upload,
}
```

```ts [config.ts]
import type { AxiosResponse, AxiosError } from 'axios'
import type { RequestConfig } from './http'

// 错误处理方案：错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}

// 与后端约定的响应数据格式
interface ResponseStructure<T = any> {
  success: boolean
  code: string
  data?: T
  message?: string
  [key: string]: any
}
/**
 * 业务错误处理
 */
function bizErrorHandler(error: any) {
  if (error.info) {
    const { errorMessage, errorCode, showType } = error.info
    switch (showType) {
      case ErrorShowType.SILENT:
        // do nothing
        break
      case ErrorShowType.WARN_MESSAGE:
        // TODO
        break
      case ErrorShowType.ERROR_MESSAGE:
        // TODO
        break
      case ErrorShowType.NOTIFICATION:
        // TODO
        break
      case ErrorShowType.REDIRECT:
        // TODO
        break
      default:
        // TODO
        console.error(errorMessage)
    }
  }
}
/**
 * 请求错误处理
 */
function responseStatusHandler(error: AxiosError) {
  if (error.response) {
    const { status } = error.response as AxiosResponse
    switch (status) {
      case 401:
        // TODO
        break
      case 403:
        // TODO
        break
      case 404:
        // TODO
        break
      default:
        console.error(`Response status:${status}`)
    }
  } else {
    console.error(error.message)
  }
}

const requestConfig: RequestConfig<ResponseStructure> = {
  errorConfig: {
    // 抛出错误
    errorThrower: (res) => {
      const { success, data, code, message, errorCode, errorMessage, showType } = res
      if (!success) {
        const error: any = new Error(errorMessage || message)
        error.name = 'BizError'
        error.info = {
          errorCode: errorCode ?? code,
          errorMessage: errorMessage ?? message,
          showType,
          data,
        }
        throw error // 抛出自定义的错误,请求方法中的 .catch 部分会捕获
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts) => {
      if (opts?.skipErrorHandler) return
      // 自定义错误的处理
      if (error.name === 'BizError') {
        bizErrorHandler(error)
      } else if (error.name === 'AxiosError') {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        responseStatusHandler(error)
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // error.request 在浏览器中是 XMLHttpRequest 的实例
        // 而在node.js中是 http.ClientRequest 的实例
        // TODO
        console.error('None response! Please retry.')
      } else {
        // 发送请求时出了点问题
        // TODO
        console.error('Request error, please retry')
      }
    },
  },
  // 请求拦截器
  requestInterceptors: [
    [
      (config) => {
        // 拦截请求配置，进行个性化处理。
        // TODO
        return { ...config }
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      },
    ],
  ],
  // 响应拦截器，这里只处理状态码 2xx 的情况
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const { config, data } = response
      !data &&
        requestConfig.errorConfig?.errorThrower?.({
          success: false,
          code: 'E0001',
          message: '缺少响应数据',
        })
      if (!data.success) {
        // TODO
        requestConfig.errorConfig?.errorThrower?.(data)
      }
      return response
    },
  ],
}

export default requestConfig
```

:::

## 助手函数 {#helper}

```ts
interface AnyObj {
  [key: string]: any
}
const { getPrototypeOf } = Object
const kindOf = ((cache) => (thing: any) => {
  const str = toString.call(thing)
  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase())
})(Object.create(null))
const kindOfTest = (type: string) => {
  type = type.toLowerCase()
  return (thing: any) => kindOf(thing) === type
}
const typeOfTest = (type: string) => (thing: any) => typeof thing === type
function findKey(obj: object, key: string) {
  key = key.toLowerCase()
  const keys = Object.keys(obj)
  let i = keys.length
  let _key
  while (i-- > 0) {
    _key = keys[i]
    if (key === _key.toLowerCase()) {
      return _key
    }
  }
  return null
}
const _global = (() => {
  if (typeof globalThis !== 'undefined') return globalThis
  // @ts-expect-error
  return typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : global
})()

const singletonEnforcer = Symbol('Utils')
// 助手函数写这里
class Utils {
  private static _instance: Utils
  constructor(enforcer: any) {
    if (enforcer !== singletonEnforcer) {
      throw new Error('Cannot initialize single instance')
    }
  }
  static get instance() {
    // 如果已经存在实例则直接返回, 否则实例化后返回
    this._instance || (this._instance = new Utils(singletonEnforcer))
    return this._instance
  }

  /** @description 是否为数组 */
  isArray = Array.isArray
  /** @description 是否为 undefined */
  isUndefined = typeOfTest('undefined')
  /** @description 是否为对象 */
  isObject = (thing: any) => thing !== null && typeof thing === 'object'
  /** @description 是否为函数 */
  isFunction = typeOfTest('function')
  /** @description 是否为数字 */
  isNumber = typeOfTest('number')
  /** @description 是否为布尔值 */
  isBoolean = (thing: any) => thing === true || thing === false
  /** @description 是否为字符串 */
  isString = typeOfTest('string')
  /** @description 是否为 Date 对象 */
  isDate = kindOfTest('Date')
  /** @description 是否为 File 对象 */
  isFile = kindOfTest('File')
  /** @description 是否为 FileList 对象 */
  isFileList = kindOfTest('FileList')
  /** @description 是否为 Blob 对象 */
  isBlob = kindOfTest('Blob')
  /** @description 是否为 Stream流 */
  isStream = (val: any) => this.isObject(val) && this.isFunction(val.pipe)
  /** @description 是否为 URLSearchParams 对象 */
  isURLSearchParams = kindOfTest('URLSearchParams')
  /** @description 是否为 HTMLFormElement 对象 */
  isHTMLForm = kindOfTest('HTMLFormElement')
  /** @description 是否为 ArrayBuffer 对象 */
  isArrayBuffer = kindOfTest('ArrayBuffer')
  /** @description 是否为 RegExp 对象 */
  isRegExp = kindOfTest('RegExp')
  /** @description 是否为异步函数 */
  isAsyncFn = kindOfTest('AsyncFunction')
  /** @description 是否存在上下文对象 */
  isContextDefined = (context: any) => !this.isUndefined(context) && context !== _global
  /** @description 是否为 Buffer 对象 */
  isBuffer(val: any) {
    return (
      val !== null &&
      !this.isUndefined(val) &&
      val.constructor !== null &&
      !this.isUndefined(val.constructor) &&
      this.isFunction(val.constructor.isBuffer) &&
      val.constructor.isBuffer(val)
    )
  }
  /** @description 是否为 ArrayBuffer 对象 */
  isArrayBufferView(val: any): boolean {
    let result
    if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
      result = ArrayBuffer.isView(val)
    } else {
      result = val && val.buffer && this.isArrayBuffer(val.buffer)
    }
    return result
  }
  /** @description 是否为 plain object */
  isPlainObject = (val: any) => {
    if (kindOf(val) !== 'object') return false
    const prototype = getPrototypeOf(val)
    return (
      (prototype === null ||
        prototype === Object.prototype ||
        Object.getPrototypeOf(prototype) === null) &&
      !(Symbol.toStringTag in val) &&
      !(Symbol.iterator in val)
    )
  }
  /** @description 是否为 FormData 对象 */
  isFormData = (thing: any) => {
    let kind
    return (
      thing &&
      ((typeof FormData === 'function' && thing instanceof FormData) ||
        (this.isFunction(thing.append) &&
          ((kind = kindOf(thing)) === 'formdata' ||
            // detect form-data instance
            (kind === 'object' &&
              this.isFunction(thing.toString) &&
              thing.toString() === '[object FormData]'))))
    )
  }
  /** @description 是否为 FormData 对象 */
  isSpecCompliantForm(thing: any) {
    return !!(
      thing &&
      this.isFunction(thing.append) &&
      thing[Symbol.toStringTag] === 'FormData' &&
      thing[Symbol.iterator]
    )
  }
  /** @description 是否有 then 方法 */
  isThenable = (thing: any) =>
    thing &&
    (this.isObject(thing) || this.isFunction(thing)) &&
    this.isFunction(thing.then) &&
    this.isFunction(thing.catch)
  /** @description 是否绝对地址 */
  isAbsoluteURL(url: string) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url)
  }
  /** @description 去除字符串首尾的空白符 */
  trim = (str: string) =>
    str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
  /** @description 去除字符串中的 BOM */
  stripBOM = (content: string) => {
    if (content.charCodeAt(0) === 0xfeff) {
      content = content.slice(1)
    }
    return content
  }
  /** @description 把 横线、下划线、空格 连接起来的字符串转为小驼峰字符串 */
  toCamelCase = (str: string) => {
    return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2
    })
  }
  /** @description 判断对象是否有某属性 */
  hasOwnProperty = (
    ({ hasOwnProperty }) =>
    (obj: object, prop: string) =>
      hasOwnProperty.call(obj, prop)
  )(Object.prototype)
  /** @description 把baseURL和relativeURL组合起来 */
  combineURLs(baseURL: string, relativeURL: string) {
    return relativeURL
      ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
      : baseURL
  }
  /** @description 将类数组对象转为真正的数组 */
  toArray = (thing: any) => {
    if (!thing) return null
    if (this.isArray(thing)) return thing
    let i = thing.length
    if (!this.isNumber(i)) return null
    const arr = new Array(i)
    while (i-- > 0) {
      arr[i] = thing[i]
    }
    return arr
  }
  /** @description 迭代数组或对象 */
  forEach(obj: AnyObj | Array<any>, fn: (...args: any[]) => void) {
    if (obj === null || typeof obj === 'undefined') {
      return
    }
    if (typeof obj !== 'object') {
      obj = [obj]
    }
    if (this.isArray(obj)) {
      for (let i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj)
      }
    } else {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj)
        }
      }
    }
  }
  /** @description 对象合并 */
  merge(...args: object[]) {
    // @ts-expect-error
    const { caseless } = (this.isContextDefined(this) && this) || {}
    const result: AnyObj = {}
    const assignValue = (val: any, key: string) => {
      const targetKey = (caseless && findKey(result, key)) || key
      if (this.isPlainObject(result[targetKey]) && this.isPlainObject(val)) {
        result[targetKey] = this.merge(result[targetKey], val)
      } else if (this.isPlainObject(val)) {
        result[targetKey] = this.merge({}, val)
      } else if (this.isArray(val)) {
        result[targetKey] = val.slice()
      } else {
        result[targetKey] = val
      }
    }

    for (let i = 0, l = arguments.length; i < l; i++) {
      args[i] && this.forEach(args[i], assignValue)
    }
    return result
  }
  /** @description 将文件对象转为URL */
  readBlob2Url = (blob: Blob, cb: (url: any) => void) => {
    if (!this.isBlob(blob)) {
      throw new Error('is not Blob')
    }
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
      reader.readAsDataURL(blob)
    }).then(cb)
  }
  /** @description 洗牌算法 */
  shuffle = (arr: any[]) => {
    const res = []
    let random
    while (arr.length > 0) {
      random = Math.floor(Math.random() * arr.length)
      res.push(arr.splice(random, 1)[0])
    }
    return res
  }
  /** @description 深拷贝 */
  deepClone = (source: any, cache = new WeakMap()) => {
    if (typeof source !== 'object' || source === null) return source
    if (cache.has(source)) return cache.get(source)
    const target = Array.isArray(source) ? [] : {}
    Reflect.ownKeys(source).forEach((key) => {
      const val = source[key]
      if (typeof val === 'object' && val !== null) {
        target[key] = this.deepClone(val, cache)
      } else {
        target[key] = val
      }
    })
    return target
  }
}
export default Utils.instance
```
