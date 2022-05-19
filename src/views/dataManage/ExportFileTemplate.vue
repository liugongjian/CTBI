<template>
  <div class="template-container">
    <el-button type="text" size="small" style="margin-left: 10px" @click="handleHostsTemplate">
      模板下载
    </el-button>
  </div>
</template>

<script>
import { parseTime } from '@/utils/numberUtils'

export default {
  name: 'ExportFileTemplate',
  data() {
    return {
      bookType: 'xlsx',
      filename: '文件模板',
      autoWidth: true,
      excelData: [
        {
          number: '225',
          orderTime: '2011/5/24 0:00',
          customerName: '张子强',
          orderLevel: '中级',
          orderNumber: '24',
          amount: '126.58',
          discount: '0.06',
          transport: '火车',
          profitAmount: '18.27',
          price: '5.58',
          transportCost: '0.7',
          region: '华东',
          province: '上海',
          city: '上海',
          type: '办公用品',
          productType: '笔、美术用品',
          productName: 'Kleencut_Forged Office Shears by Acme United Corporation',
          productPack: '打包纸袋',
          transportTime: '2011/5/25 0:00'
        },
        {
          number: '420',
          orderTime: '2011/10/30 0:00',
          customerName: '王仲奇',
          orderLevel: '其它',
          orderNumber: '8',
          amount: '43.29',
          discount: '0.09',
          transport: '火车',
          profitAmount: '-20.69',
          price: '4.98',
          transportCost: '4.86',
          region: '华东',
          province: '上海',
          city: '上海',
          type: '办公用品',
          productType: '纸张',
          productName: 'Kleencut_Forged Office Shears by Acme United Corporation',
          productPack: '小型箱子',
          transportTime: '2011/10/30 0:00'
        },
        {
          number: '548',
          orderTime: '2009/9/20 0:00',
          customerName: '杨子梅',
          orderLevel: '中级',
          orderNumber: '26',
          amount: '2753.1925',
          discount: '0.04',
          transport: '火车',
          profitAmount: '510.49',
          price: '125.99',
          transportCost: '4.2',
          region: '华东',
          province: '上海',
          city: '上海',
          type: '技术产品',
          productType: '电话通信产品',
          productName: 'Kleencut_Forged Office Shears by Acme United Corporation',
          productPack: '小型箱子',
          transportTime: '2009/9/22 0:00'
        },
        {
          number: '1028',
          orderTime: '2009/1/5 0:00',
          customerName: '田凤琴',
          orderLevel: '高级',
          orderNumber: '11',
          amount: '2021.147',
          discount: '0.01',
          transport: '火车',
          profitAmount: '-60.39',
          price: '205.99',
          transportCost: '5.99',
          region: '华东',
          province: '上海',
          city: '上海',
          type: '技术产品',
          productType: '电话通信产品',
          productName: 'Kleencut_Forged Office Shears by Acme United Corporation',
          productPack: '小型箱子',
          transportTime: '2009/1/7 0:00'
        },
        {
          number: '2307',
          orderTime: '2010/6/28 0:00',
          customerName: '刁琳',
          orderLevel: '低级',
          orderNumber: '32',
          amount: '182.33',
          discount: '0.1',
          transport: '火车',
          profitAmount: '40.85',
          price: '5.98',
          transportCost: '1.49',
          region: '华东',
          province: '上海',
          city: '上海',
          type: '办公用品',
          productType: '夹子及其配件',
          productName: 'Kleencut_Forged Office Shears by Acme United Corporation',
          productPack: '小型箱子',
          transportTime: '2010/6/28 0:00'
        }
      ]
    }
  },
  methods: {
    /**
     * 下载模板
     */
    handleHostsTemplate() {
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = ['订单编号', '订单日期', '客户名称', '订单等级', '订单数量', '订单金额', '折扣点', '运输方式', '利润金额', '单价', '运输成本', '区域', '省份', '城市', '产品类型', '产品小类', '产品名称', '产品包箱', '运输日期']
        const fieldName = ['number', 'orderTime', 'customerName', 'orderLevel', 'orderNumber', 'amount', 'discount', 'transport', 'profitAmount', 'price', 'transportCost', 'region', 'province', 'city', 'type', 'productType', 'productName', 'productPack', 'transportTime']
        const data = this.formatJson(fieldName, this.excelData)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
      })
    },
    formatJson(fieldName, jsonData) {
      return jsonData.map((item) => fieldName.map((attributeName) => {
        if (attributeName === 'timestamp') {
          return parseTime(item[attributeName])
        }
        return item[attributeName]
      }))
    }
  }
}
</script>

<style scoped>
.template-container {
  display: inline-block;
}
</style>
