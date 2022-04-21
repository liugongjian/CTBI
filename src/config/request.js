import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
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
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
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
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
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
      }).then(res => { // axios返回的是一个promise对象
        resolve(res) // resolve在promise执行器内部
      }).catch(err => {
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
      }).then(res => {
        resolve(res)
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
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // POST 文件上传
  blobStream (url, data) {
    const headerConfig = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      responseType: 'arraybuffer'
    }
    return new Promise((resolve, reject) => {
      service({
        method: 'post',
        headers: headerConfig.headers,
        url,
        data
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  blobDownload (url, params) {
    return new Promise(resolve => {
      axios({
        method: 'get',
        url: url,
        headers: {
          Authorization: 'Bearer ' + getToken()
        },
        params,
        responseType: 'blob'
      }).then(res => {
        if (!res) {
          resolve(false)
        }
        const url = window.URL.createObjectURL(new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '导出数据.xlsx')
        document.body.appendChild(link)
        link.click()
        resolve()
      })
    })
  }
}

export default service
