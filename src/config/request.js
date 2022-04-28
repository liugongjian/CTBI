import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
// import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['X-Token'] = getToken()
    }
    return config
  },
  (error) => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data
    if (response.headers['content-type'] === 'image/svg+xml' && response.status === 200) {
      return res
    }
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(res)
    } else {
      return res
    }
  },
  (error) => {
    console.log('err' + error) // for debug
    if (error?.response?.status === 401) {
      // to re-login
      MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
        confirmButtonText: 'Re-Login',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export const http = {
  // get请求
  get (url, params) {
    return new Promise((resolve, reject) => {
      service({
        method: 'get',
        url,
        params
      })
        .then((res) => {
          // axios返回的是一个promise对象
          resolve(res.data || res) // resolve在promise执行器内部
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  // post请求
  post (url, data) {
    return new Promise((resolve, reject) => {
      service({
        method: 'post',
        url,
        data
      })
        .then((res) => {
          resolve(res.data || res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  // put请求
  put (url, data) {
    console.log('url----', url, data)
    return new Promise((resolve, reject) => {
      service({
        method: 'put',
        url,
        data
      }).then(res => {
        resolve(res.data || res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // delete请求
  delete (url, data) {
    return new Promise((resolve, reject) => {
      service({
        method: 'delete',
        url,
        data
      })
        .then((res) => {
          resolve(res.data || res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  // POST 文件上传 onUploadProgress => 上传中回调事件，用于进度条控制
  blobStream (url, data, onUploadProgress) {
    const headerConfig = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    return new Promise((resolve, reject) => {
      service({
        method: 'post',
        headers: headerConfig.headers,
        url,
        data,
        onUploadProgress
      })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  blobDownload (url, params, method) {
    return new Promise((resolve) => {
      service({
        method: method || 'get',
        url,
        params,
        responseType: 'blob'
      }).then((res) => {
        if (!res) {
          resolve(false)
        }
        const url = window.URL.createObjectURL(
          new Blob([res.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
        )

        const fileNameCode =
          res.headers['content-disposition'].split("filename*=utf-8''")[1] ||
          res.headers['content-disposition'].split('filename=')[1] ||
          '导出文件.xlsx'

        const fileName = decodeURI(fileNameCode)
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        resolve()
      })
    })
  },
  // put请求 参数为body
  putDataSet (url, data) {
    return new Promise((resolve, reject) => {
      service
        .put({
          method: 'put',
          url,
          data
        })
        .then((res) => {
          resolve(res.data || res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

export default service
