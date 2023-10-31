---
title: axios封装
---

我自用的`axios`单例模式封装，思路参考自 `UmiJS 4`

::: code-group

```ts [axios.ts]
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios'
import requestConfig from './config'

type RequestError = AxiosError | Error

// request 方法 opts 参数的接口
interface IRequestOptions extends AxiosRequestConfig {
  skipErrorHandler?: boolean
  requestInterceptors?: IRequestInterceptorTuple[]
  responseInterceptors?: IResponseInterceptorTuple[]
  [key: string]: any
}

interface IRequestOptionsWithResponse extends IRequestOptions {
  getResponse: true
}

interface IRequestOptionsWithoutResponse extends IRequestOptions {
  getResponse: false
}

interface IRequest<T = any> {
  (url: string, opts: IRequestOptionsWithResponse): Promise<AxiosResponse<T>>
  (url: string, opts: IRequestOptionsWithoutResponse): Promise<T>
  (url: string, opts: IRequestOptions): Promise<T> // getResponse 默认是 false， 因此不提供该参数时，只返回 data
  (url: string): Promise<T> // 不提供 opts 时，默认使用 'GET' method，并且默认返回 data
}

interface IErrorHandler {
  (error: RequestError, opts: IRequestOptions): void
}

type IRequestInterceptor = (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
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

const singletonEnforcer = Symbol()

class AxiosRequest {
  private static _instance: AxiosRequest
  private readonly service: AxiosInstance
  private config: RequestConfig = {
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
    // 当响应的数据 success 是 false 的时候，抛出 error 以供 errorHandler 处理
    this.service.interceptors.response.use((response) => {
      const { data } = response
      if (data?.success === false && this.config?.errorConfig?.errorThrower) {
        this.config.errorConfig.errorThrower(data)
      }
      return response
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
    this.config = Object.assign(this.config, requestConfig)
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
   * @param opts 额外参数
   */
  request: IRequest = (url: string, opts: any = { method: 'GET' }) => {
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
          }
          reject(error)
        })
    })
  }
}

const requestInstance = AxiosRequest.instance
const request = requestInstance.request
export { requestInstance, request }
export type {
  RequestError,
  RequestConfig,
  IResponseInterceptor as ResponseInterceptor,
  IRequestOptions as RequestOptions,
  IRequest as Request,
}
```

```ts [config.ts]
import { AxiosError } from 'axios'
import type { RequestConfig } from './axios'

// 错误处理方案： 错误类型
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

const requestConfig: RequestConfig = {
  errorConfig: {
    // 错误抛出
    errorThrower: (res: ResponseStructure) => {
      const { success, data, errorCode, errorMessage, showType } = res
      if (!success) {
        const error: any = new Error(errorMessage)
        error.name = 'BizError'
        error.info = { errorCode, errorMessage, showType, data }
        throw error // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts) => {
      if (opts?.skipErrorHandler) throw error
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info
        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break
            case ErrorShowType.WARN_MESSAGE:
              // TODO: message
              console.warn(errorMessage)
              break
            case ErrorShowType.ERROR_MESSAGE:
              // TODO: message
              console.error(errorMessage)
              break
            case ErrorShowType.NOTIFICATION:
              // TODO: notification
              console.error({ description: errorMessage, message: errorCode })
              break
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break
            default:
              // TODO: message
              console.error(errorMessage)
          }
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        // TODO: message
        console.error(`Response status:${error.response.status}`)
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // error.request 在浏览器中是 XMLHttpRequest 的实例
        // 而在node.js中是 http.ClientRequest 的实例
        // TODO: message
        console.error('None response! Please retry.')
      } else {
        // 发送请求时出了点问题
        // TODO: message
        console.error('Request error, please retry')
      }
    },
  },
  // 请求拦截器
  requestInterceptors: [
    [
      (config) => {
        // 拦截请求配置，进行个性化处理。
        return { ...config }
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      },
    ],
  ],
  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response
      if (!data.success) {
        // TODO: message
        console.error('请求失败！')
      }
      return response
    },
  ],
}

export default requestConfig
```

:::
