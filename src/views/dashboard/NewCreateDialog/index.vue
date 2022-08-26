<template>
  <el-dialog
    title="从模板新建"
    :visible.sync="visible"
    width="1000px"
    @open="handleOpen"
    @close="handleClose"
  >
    <div v-loading="loading" class="dialog-content">
      <el-card v-for="item in templateList" :key="item._id" class="box-card">
        <img class="card-img" :src="item.thumbnail">
        <div class="card-name">{{ item.name }}</div>
        <div class="card-description">
          <el-tooltip class="item" effect="dark" :content="item.description" placement="top-start">
            <div class="tooltip-description">{{ item.description }}</div>
          </el-tooltip>
        </div>
        <div class="card-footer">
          <el-button @click.native="handlePreview(item._id)">预览</el-button>
          <el-button type="primary" @click.native="handleApply(item._id)">应用</el-button>
        </div>
      </el-card>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getTemplateList } from '@/api/template'

export default {
  props: {
    newCreateVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      templateList: [],
      loading: false
    }
  },
  computed: {
    visible: {
      get() {
        return this.newCreateVisible
      },
      set(val) {
        this.$emit('update:newCreateVisible', val)
      }
    }
  },
  methods: {
    handleOpen() {
      this.getTemplateList()
    },
    handleClose() {
      this.visible = false
    },
    async getTemplateList () {
      try {
        this.loading = true
        const params = {
          isPaging: '0'
        }
        const data = await getTemplateList(params)
        this.templateList = data.result
        // this.templateList = [
        //   {
        //     _id: 'fJfu0BNKKFsF7',
        //     name: 'Quick BI组件模板',
        //     description: '这是一个描述这是一个描述这是一个描述这是一个描述真是一个描述这是一个描述',
        //     thumbnail: 'data:image/jpeg;base64,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'
        //   },
        //   {
        //     _id: 123,
        //     name: 'Quick BI组件模板',
        //     description: '这是一个描述这是一个描述这是一个描述这是一个',
        //     thumbnail: 'data:image/jpeg;base64,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'
        //   },
        //   {
        //     _id: 123,
        //     name: 'Quick BI组件模板',
        //     description: '这是一个描述这是一个描述这是一个描述这是一个描述真是一个描述这是一个描述',
        //     thumbnail: 'data:image/jpeg;base64,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'
        //   },
        //   {
        //     _id: 123,
        //     name: 'Quick BI组件模板',
        //     description: '这是一个描述这是一个描述这是一个描述这是一个描述真是一个描述这是一个描述',
        //     thumbnail: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAwICQoJBwwKCQoNDAwOER0TERAQESMZGxUdKiUsKyklKCguNEI4LjE/MigoOk46P0RHSktKLTdRV1FIVkJJSkf/2wBDAQwNDREPESITEyJHMCgwR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0f/wAARCABQAHgDASIAAhEBAxEB/8QAGwAAAgMBAQEAAAAAAAAAAAAABQYCAwQAAQf/xAA4EAEAAQMDAgUDAgQCCwAAAAABAgMEEQAFIRIxBhNBUWFxgZGhwRQiMrHR8BUjJDNTYoKSssLh/8QAGQEAAwEBAQAAAAAAAAAAAAAAAgMEAQUA/8QAJBEAAwACAgEEAwEBAAAAAAAAAAECAxESIUEEIjFRE0JhFCP/2gAMAwEAAhEDEQA/AN1K3lDiiDgx3/fQbcPDdS9rzlcVimSlniOZJntnOA0zWTEpklfjJx+dU7zeNnY1KxD+ZjiOThXV2VRXdC45J6QlXdLbtrf4eyiVarxUqSkPSBzg7Z0OvaFa0o+aym1KpFmKiDyRfV4DJ8/Gju17L5k293TMqknqKa/PeXv9NeeIolbbCtKmYas5M4mBM9IHL6R/TUzlh/CBG20I318ULmcIxrZIKYISTIfHOPvonss6m17gbfusWNOStJYmGQ4HPfH+OqTaZVdqtri1WdWc8Aej1Jy+wZ02R2ynutjSle0mGMKPEoo8mX0yP10/HDS2JqlsjtG1tl5sYVOqnOTKIn9OXL8aEeJ6O5VpzKFpCVCjIxOQdTkRTPoP+Om6KUaXTFEOM6WvEVPcK8mpC4jQt4nJkwnrnOtzJ8daPQ+9i/tu11SEtwhcUytAXy8YRcgZ7ej6f21lrVG8jKpXZ+RRqMhkIQX0yCucdsPbPvo3ZbHSdkudwuK7GgiwZOJScqnfIJ6Yy/TuGtrKr5FaW115SenNQHiUUO58Ljn21yp0qbZc1yXRbS3u/wCiNCyhaRp5cMR/l+o4fTvj104+D6V4V6ruNCNKtVpgJIxIMocdsc59edJnhjeqdhfSjfU6fRM6fNYuY/gcj9PTX0C3uIs6NzbMasGQkouRM4efzqyIdy9smqvx0tIE3sI21e7oUAUzOmOMOcuO/bqz+dK2329Rle0ymsoEkEyqiBx6uP00979ZxhdRvJTcZKcs8HOMeoHIdj10MIU6c5dMCLJyoYV+dP8AS6yQvtAep/50/wCgPY0dppylnq5JZMInH9sa7RGtCFOLGnEjHK4DBrtdOJ4zogqk2MdCZCJGMQQ7rnnUL1a8Y+dEnjt1GcOtFtRJRMH82p1aCjg1zFaZ2OCBElpRlVYsun0z3+NVNt/HbRChUUKsSecZwrnt99Ea9FjSn1LH+V5DKcd8a61h0WlLBlKcTL9DWpp12KuXx6MdnZFlbQt6bmMVRe6qq/rojTZFPD29NVZiPODV1FymA5cGfXVKpJElY6bIi9YIpwGNYN5tKl3SKFKUY0pP+tqKKHsHqvv6aNTo0oI1asR9YCK/c1GULKmspzMnY740qqV9BqeAieIdtbHbKVC3KjRRVXOX6OsthZV7PcrdWRiAyJCZi8YT6Z/Gn29q2FxApTolSIIdWQM47B9NZK1nQvmNOESNTqjKLEwrEQMvpjJ9330isOq5eBs5euPkpfCW2So18x6SvCJEx/u5GeT68cfD7632FhS2zb6drTmdMRVcCryusNe8qidCmO3xrBXr15SVVXur31Qsc/KE8rfTGa68q92pi1KkpAwY0zKvY+nc0vxnGdOLNCRmMhTInD2+daNmu6lKNakyCUw6VM8n/wAf01i3r/ZplxGE2lMwSUjGEjBlMdn68P41BGT/AD52vDLax/nxL+Ea0cnHJrtToWlWcAq1OqQZWJmKLxh5PtnOu115zy0cysLl6Halt8qYIZ901oLPqMqZ0QIhAyfbXoD2DXITZ0+fgVvEdpOntVaUJYlwEvZZBnVEKFX+Ep5i8wjyHHY0S8XpHYK+OGTGJx7yNb6EQtaccHEAw/Q0afuPN6kXIWNeTnCfKalWsa8MSQX0TTIHOANWxnSpR6qkomPfDonfFAb2xZtNrr1Z5nGWDlex9nVtfaarNjGmgGcy4NG627W0MxhInL2D99UNxWucYIwg57vOtnJTYNSgPT2aSnXKGfj01dDbPKnGcGUpRRMGDjRSnHpiDLPzqzjTHbfQvSQDr7VFrVJLGJ1ODC8dz9E1VPZWpHMV/wC3B/fR6mR8+Zg5BOM9uH9tWygPCZ9s6XNvQTlCnV2epFCFSAkh9kw54+f8/D7XjaVqNW2YVJ1ahKWDL0+wpwPGcZ+7xpmlRDsB9tL+89dlXjVpvRSqKykdyWM/Qyc5+OMd9I9RDr3IfhvXtZksrCUemUbytKI/z06p1dzOBcJ3E512tFrclSQhPBEZMso5M8Lwpj3cZ7mu1uPPPH3A5Mdcuh2WMjumooBkTjWQrTTC/prxmnJLD8mlKmvkJygP4zqEdqpwwLUrRgHzhf20bghEGIgY5zpe8R5r3G30M9XVcwk49ARf0zo5GaAY50yaTZlLSJ1IRm9sHsaz1LUmY4w9zH+GtRM9TGoF1Qbj+H86n5+CXl9R1Yc84744dH0xbbRkjttOLmOR9zU4WWHKoex3/OrL28/hJ0eqJ5c5MZTXHTwpxjlUxrRb1aVeHXTl1GcZx6634M22QKREwAfXnXeW51qImfX8a96THbWcjdA+Uei9oPpMlHP2z+xrb0Y76y7olKnQqzl0ka0cuM8LrawX10CrsPXRROB66HblaUby1qW9Z/lmYycI+ifI86KSpZ7v66z1aId00fJeTNfQgUrypt17/o+uJOmEWQLmOOJB6qHB8PbGXtHfFGy09zspSt5tO8pxSnMcdQ94r7OP8i67UdY9voonItdjX108f1wx9TUZSoJhlD8mvnMfHdox4jWX4pAf+evHxxQTihWeP+GH/tpqexHu+hruoUq/iqzgIxoxlUeeM9Ke/wDzH6aMMaY8SPya+Yx8aUDd43crWYRoypgBlyxRcyx6P5/BA8cW9QzG3qHwyif3lrY0bkdN6SGPeZ1LqrVs6d0WdGjSKtW5FJRXOARAMCq8Bj3yLdnvVttu9W8q+5215SlHEbiujUgOBjKeHJlEfaMjjPIvcfFlNuZVIWvmQqwKdalKcQkCoiLzyiYwj8axHiTbbirIutmJUyLCnRhEYgoquTlQ7HHPfOmLTE+/yh23a7u9yKcaBGEZxlVoivMIpmaGFySCMRFFVMaJ7Fc1LYo2lepSrwrEpUq9M6SSc4RXnHIjhB4MGUGp4noLSla7fdSnSJQIMOoYqLHOcmMGMDgMY51otN4qyuqVWrtN9RID5cI0VMphkrjsKAHq/GD3Gu2L3k31J9T86J3T8mvPNimSR+TSJT3yUwzaX8PVZWyca00t08yOYxuY49JUJH64xpbvGvIa/K/1Gbdoxu9trUeoygmEzwj+2p2N3GtY051JxJkQllBJHDke3Ol0vepCVSUc9swzn7Zzr2lOhAnIr1pE5snjAPbgXg1JeeJvopmMjjtDJUuaMRZVYH/Uaw3O428O0+rOf6X99AruVKtRlSJXBnIsJkVMe7lPtpfuNno1ZHU1Y446alxKa59+eOdDXqFS6Gzhf7DFd79QJMKYMsZzzIPuca7QGW306MIsAAMBAcHf0Dv8a7U3K35KVEfR/9k='
        //   },
        //   {
        //     _id: 123,
        //     name: 'Quick BI组件模板',
        //     description: '这是一个描述这是一个描述这是一个描述这是一个描述真是一个描述这是一个描述',
        //     thumbnail: 'data:image/jpeg;base64,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'
        //   },
        //   {
        //     _id: 123,
        //     name: 'Quick BI组件模板',
        //     description: '这是一个描述这是一个描述这是一个描述这是一个描述真是一个描述这是一个描述',
        //     thumbnail: 'data:image/jpeg;base64,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'
        //   }
        // ]
      } catch (error) {
        console.log(error)
        this.tableData = []
      } finally {
        this.loading = false
      }
    },
    handlePreview(id) {
      this.$router.push({
        path: '/dashboard',
        query: {
          id,
          from: 'template',
          mode: 1
        }
      })
    },
    handleApply(id) {
      this.$router.push({
        path: '/dashboard',
        query: {
          id,
          from: 'template'
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.dialog-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: space-between;
  flex-wrap: wrap;
  max-height: 446px;
  min-height: 446px;
  overflow-y: auto;
  .box-card {
    width: 306px;
    flex: 0 0 306px;
    margin: 0px 5px;
    .card-img {
      width: 290px;
      height: 110px;
    }
    .card-name {
      font-family: PingFangSC-Medium;
      font-size: 12px;
      color: #333333;
      line-height: 20px;
      font-weight: 500;
    }
    .card-description {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #333333;
      line-height: 20px;
      font-weight: 400;

      .tooltip-description {
        &::before {
          display: inline;
          content: '描述：';
        }
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
    .card-footer {
      height: 44px;
      background: #FFFFFF;
      box-shadow: 0px 2px 8px 0px rgba(200,201,204,0.5);
      border-radius: 0px 0px 4px 4px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 306px;
      transform: translate(-8px, 8px);
    }
    ::v-deep .el-card__body {
      padding: 8px;
    }
  }
}
.dialog-footer{
  padding-top: 10px;
}
</style>
