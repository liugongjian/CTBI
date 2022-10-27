<template>
  <div ref="wrapper" class="wrapper" @scroll="handleScroll">
    <div class="title">
      <div class="table-title">
        <div style="text-align:left;margin-left:20px">来源</div>
        <div style="text-align:left;">访问量</div>
        <div style="text-align:right;margin-right:20px">占比</div>
      </div>
      <div class="table-title">
        <div style="text-align:left;margin-left:20px">去向</div>
        <div style="text-align:left;">访问量</div>
        <div style="text-align:right;margin-right:20px">占比</div>
      </div>
    </div>
    <div class="table">
      <div class="left">
        <div v-for="(item,index) in endLeft" :ref="`left${index}`" :key="index" class="table-box">
          <div style="text-align:left;">{{ item.name }}</div>
          <div style="text-align:left;">{{ Number(item.value) }}</div>
          <div style="text-align:right;">{{ GetPercent(Number(item.value),num) }}%</div>
        </div>
      </div>
      <div ref="center" class="center">
        <div class="center-left">
          <img
            src="data:image/png;base64,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"
            alt
          >
        </div>
        <div class="center-main">
          <div class="center-inner">
            <el-select v-model="centerName" placeholder="请选择" @change="changeCenter">
              <el-option
                v-for="item in centerData"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
            </el-select>

          </div>
          <p>访问量：{{ num }}</p>
        </div>
        <div class="center-right">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAADm5JREFUeF7tnXvQb1Mdxp/H1IxpMkZNTTeN1KSrVDLKEN0VhcyRBiNEucVRGLkWo6jcckkuGXLpSleSIplqTJGQUVEqXdR0lQx6mu+xT95zOud9996//f399t7rWX+v9XzX9/Pdz/vb+91rr0W4mYAJrJQAzcYETGDlBGwQXx0mMA8BG8SXhwnYIL4GTKAdAf+CtOPmUYUQsEEKKbTTbEfABmnHzaMKIWCDFFJop9mOgA3SjptHFULABimk0E6zHQEbpB03jyqEgA1SSKGdZjsCNkg7bh5VCAEbpJBCO812BGyQdtw8qhACNkghhXaa7QjYIO24eVQhBGyQQgrtNNsRsEHacfOoQgjYIIUU2mm2I2CDtOPmUYUQsEEKKbTTbEfABmnHzaMKIWCDFFJop9mOgA3SjptHFUKgKINIOgLAXgCuBbCY5K8KqbPTbEmgNINoDqefAtif5BUt2XlYAQRKNsjS8oZJTiyg1k6xBQEb5GFoZwLYl+T9LRh6yIgJ2CCPFPc71S3Xj0Zcb6fWkIANsiyweyqTfLohR3cfKQEbZMWFPYbkoSOtudNqQMAGWTmsz1e/Jr9uwNNdR0bABpm/oLdWJvnGyOrudGoSsEEWBhXvTuJfwSct3NU9xkbABqlf0TNIvrt+d/ccAwEbpFkVr6l+TW5oNsy9h0rABmleuT9WJrmw+VCPGBoBG6R9xY4meVj74R45BAI2yGRV+hyAXUn+fTIZj+4rARtk8srcUt1yXTm5lBX6RsAG6aYi/6lMcnI3clbpC4HSDBL/fVovEf7pJPdM1Lf0lAmUZpBdAZyVzPhqALuT/FlyHMtPgUBRBgmekp4DIL4mzGx/qG65LsoMYu18AsUZZClSST8AsEEy4g+SPDw5huUTCRRrkOrX5DgA70vkG9KfJbkoOYblkwgUbZDKJFsA+HIS36WyNwN4F8nrkuNYvmMCxRukMsnqAO4A8LiO+c6Ve6h6LjklMYalOyZgg8wBKukLALbumPHycqeRjL253AZAwAZZrkiS3gMgexugbwNYRPJPA7hGip6iDbKC8kuKl4nZS9p/H7s8koxfLbeeErBB5imMpB8DWDe5dkeRPDI5huVbErBBFgAnKdZX7dOSb91hnyG5Xd3O7jc9AjZIDdaSto33GTW6TtLlJwC2Jxmrg916QsAGqVkISWsCuA3AY2oOadPtwWoL1NPbDPaY7gnYIA2ZSvoagM0bDmva/VSSezcd5P7dE7BBWjCVdBCAD7UY2mTItwC8nmT8qrjNiIAN0hK8pI0AfLfl8LrDfgdgB5JhFrcZELBBJoAu6bEAfgjg2RPI1Bl6JMmj6nR0n24J2CAd8JT0SQC7dSA1n8QlJN+WHMPyyxGwQTq6JCTtAOD8juRWJnMTgDeS/G1yHMtXBGyQDi8FSc8DEO8zVulQdnmpBwDsRPLixBiWtkHyrgFJ8VC9WV6EJcofJ5n9hj85hf7L+xckqUbVkdPZa6yuIvmapBQsC8AGSbwMJMULxXixmNnuBrAFyezVx5k59FbbBkkujaSnAPgegKcnh9rPZ5h0T9gG6Z7pChUlxX+44j9dme1ikttnBihN2waZYsUl7QHgjOSQ8Q3LRiTvTY5ThLwNMuUyS9qwuuXKjHw/gK1IXp4ZpARtG2QGVZYUS+a/CeDlyeGPJXlIcoxRy9sgMyyvpGMBHJw8hW+SfG1yjNHK2yAzLq2k+NQ2+614LE3ZmOSdM053cOFtkB6UrNpQOw4IfWLydHYmeV5yjFHJ2yA9Kqek+O49vn/PbOeQjGMg3GoQsEFqQJpmF0mxmXZsqp3ZbiT54swAY9G2QXpYSUmvA3BF8tT+HQsqSX4/Oc6g5W2QnpZP0pOqdVzZf+kPIpn9i9VTygtPywZZmNFMe0iK3eCzdzj5CsktZ5poT4PbID0tzNxpSXongDOTp/qb2GaV5F+S4wxK3gYZSLkkxXFx8fZ9teQpxxKVy5JjDEbeBhlMqZYcQLpqtQVqnIqV2T5K8r2ZAYaibYMMpVJz5inpgwAOTZ769SSzDzlNTmFyeRtkcoYzUZjShtr3AXgJydiTuMhmgwy47JJiw7pLATw3OY3dScbeX8U1G2QEJZcU66t2Sk7lApI7JsfonbwN0ruStJuQpAMAfKTd6Nqj7gKwFknVHjHwjjbIwAs4d/qSYgug2EXl0clpbUoyVh+PvtkgIyuxpFgyfwmATZNTO4zk0ckxZi5vg8y8BDkTkHRSnFaVo/4/1StJxsLK0TYbZLSlXfJicRcAZyen+C8AzyQZx1qPrtkgoyvpsglJWh/AZwA8IznVRSSzDzpNTuH/5W2QqSOffkBJ8dAeJtkqOfroNtS2QZKvmD7JS4pTqg5PntNNJF+UHGNq8jbI1FD3I5CkbQB8Pnk2d5N8anKMqcjbIFPB3K8gkp5ZrQrO/FrxBJKL+5V589nYIM2ZjWaEpHMB7JyY0NtJXpSony5tg6Qj7ncASfsBOCFplmeRjK8hB9tskMGWrruJS3pV9V+ux3enukTpTpJrd6w5VTkbZKq4+xks0SC3k1ynn1nXm5UNUo/TaHtJ2h/Ax5ISHPyDug2SdGUMQXYKD+mDf7tugwzhSu54jpKeVT1zZP6b91KSW3c89anL2SBTRz7bgJLeWpljlcSZ/JXkGon6U5O2QaaGevaBprTUZFQbY9sgs79u02dQLVaMlbZvSQ52Esl4rzKaZoOMppQrTkTSy6pbqrWSU92aZOywMqpmg4yqnMsmI2k3ANnb9fwtvjUZ656+NshIDSLpZAD7JKd3Gcnsb0ySU5hf3gaZKf7ug1ebNsTzxibdqy+juJhk1hqu5KnXl7dB6rPqfc/qZKr4cnD15MnGdqQ3JMfohbwN0osyTD4JSbEb+/GTK82rMKqvBeuwskHqUOp5H0nnA9gheZonk3xPcozeydsgvStJ/QlJipWy8bzxwvqjWvV8K8kvtBo58EE2yEALKGlRtYNiZgb/ALAOyd9lBumztg3S5+qsZG6SjgFwSPLUv0zyzckxei9vg/S+RI9MsDqC7XMA3pQ87QNIZn0jkjz1buVtkG55pqlJ2rB63nhaWpCHhdcn+cPkGIORt0EGUCpJewA4I3mqNwPYkOS9yXEGJW+D9Lxckk4D8O7kaY5uy9CueNkgXZHsWEfSkwHE88YrOpZeXm5bktk7LSankCdvg+Sxba0safNqifpjW4ssPPCfAF5M8ucLdy23hw3Ss9pLOhjAscnT+irJLZJjjELeBulRGSXFNp1vS57S+0hmH/aZnML05G2Q6bFeaSRJcc55PAdkn3e+Cclre5DyYKZgg8y4VJK2B3Bh8jRuAbAZyXuS44xO3gaZYUklfRjAgclTOI3kXskxRitvg8ygtJIeAyBWx74+Ofx2JOMDKreWBGyQluDaDpMU7zXi/Ua858hqcfLsy0nelBWgFF0bZIqVlrQngFOTQ34NwDYk70+OU4S8DTKlMks6E0D2YTIHkTxuSikVEcYGSS6zpDjMMp43NkgO9QaSVyTHKE7eBkksuaT4biOeN1ZNDPNTAG8k+cvEGMVK2yBJpZf0fgBHJ8kvlT2dZDzXuCURsEESwEqKjRS2TZCeK/kOkp9KjlG8vA3S4SUg6QXVkpFndyi7vNR9AF5N8nuJMSxdEbBBOroUJMW+VLE/VWa7HECcPf6XzCDWfoSADdLB1SApVsce0IHUfBKHkMxeBp+cwvDkbZAJaiZpNQBfjFueCWTqDC1247Y6cDL72CAt6UrauHreeEJLiTrDbgMQ5ri1Tmf36Z6ADdKCqaQ4dyPO38hsnwCwF8mHMoNYe34CNkjDK0TS2QB2aTisafe9SWav2Wo6pyL72yA1yy5pzep546U1h7TpFgsM30TyqjaDPaZ7AjZIDaaStqzWUz2qRve2Xb4BYFeSv2kr4HHdE7BBFmAq6TAAH+ge/TKKx5A8NDmG5VsQsEHmgSYpNlLYpgXXJkN2JHlBkwHuOz0CNsgKWEtat3reWDuxFLfHqVAkr0+MYekJCdggywGUtBOA8ybkutDwcwDsRzIOqHHrMQEbZE5xJMWZGPsn1+tAktmHbSanUI68DQJAUhybHEtGNkss/QOxBJ7klxJjWLpjAsUbRNIrK3Os0THbuXJXAoiXf/Hc4TYgAkUbRFIca3xicr1OILk4OYblkwgUaxBJ5wLYOYnrUtk9SMZuJm4DJVCcQSStVd1SrZdYszhzYzeS1yTGsPQUCBRlEEmvBRBLOjLbxdW/cP+QGcTa0yFQmkHioMrnJ6I9kuRRifqWnjKB0gyiJL4PAoglI/Hr4TYiAjbI5MWM54x4K37j5FJW6BsBG2SyisRXf/uTjK143EZIwAZpX9TFJE9oP9wjh0DABmlepV8A2Ifk15sP9YihEbBBmlUs1lHFLdUdzYa591AJ2CD1K3c8yezzBOvPxj2nQsAGWRjzf+LgG5LxDYdbYQRskPkLHl/7xS3VdYVdF063ImCDrPxSiO/E4/3Gn321lEvABllx7Q8leUy5l4UzX0rABln2Wog9qeKWKo5NczMB2CCPXASxm2HcUsWCRjcTWELABnn4Qoh9cOOXI74bdzOB/xGwQYB9SZ7ia8IEVkSgZIPEmRtxSxUbKriZwAoJlGaQIwDsC+Dq6pbqLl8XJjAfgaIM4kvBBJoSsEGaEnP/ogjYIEWV28k2JWCDNCXm/kURsEGKKreTbUrABmlKzP2LImCDFFVuJ9uUgA3SlJj7F0XABimq3E62KQEbpCkx9y+KgA1SVLmdbFMCNkhTYu5fFAEbpKhyO9mmBGyQpsTcvygCNkhR5XayTQnYIE2JuX9RBGyQosrtZJsSsEGaEnP/ogjYIEWV28k2JWCDNCXm/kURsEGKKreTbUrABmlKzP2LImCDFFVuJ9uUgA3SlJj7F0XABimq3E62KQEbpCkx9y+KwH8BvVMn9tJReDEAAAAASUVORK5CYII="
            alt
          >
        </div>
      </div>
      <div class="right">
        <div v-for="(item,index) in endRight" :ref="`right${index}`" :key="index" class="table-box table-box-right">
          <div style="text-align:left;">{{ item.name }}</div>
          <div style="text-align:left;">{{ Number(item.value) }}</div>
          <div style="text-align:right;">{{ GetPercent(Number(item.value),num) }}%</div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import LeaderLine from 'leader-line'
import ResizeObserver from 'resize-observer-polyfill'
// @ is an alias to /src

export default {
  name: 'SourceChart',
  props: {
    sourceList: {
      type: Array,
      default: () => []
    },
    centerData: {
      type: Array,
      default: () => []
    },
    directionList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      resizeObserver: null,
      showEffectName: 'draw',
      centerName: '中心节点',
      num: 0,
      animOptions: {
        duration: 1000,
        timing: 'ease-in'
      },
      styleOption: {
        color: 'rgba(0, 126, 255,0.5)',
        endPlug: 'behind',
        size: 30,
        opacity: 0.5,
        startSocket: 'right',
        endSocket: 'left',
        outLineColor: 'rgba(0, 126, 255,0.5)',
        path: 'straight', // straight,arc,fluid,magnet,grid
        hide: true
      },
      rightstyleOption: {
        color: 'rgba(31, 180, 136,0.5)',
        endPlug: 'behind',
        size: 30,
        opacity: 0.5,
        startSocket: 'left',
        endSocket: 'right',
        outLineColor: 'rgba(31, 180, 136,0.5)',
        path: 'straight',
        hide: true
      },
      leftList: [],
      rightList: [],
      endCenter: [],
      endLeft: [],
      endRight: []
    }
  },
  watch: {
    centerData (val) {
      this.$nextTick(() => {
        console.log(val, 'vvvvv')
        this.endCenter = val
        this.centerName = val[0].name
        this.num = Number(val[0].num)
        this.filterData(val[0].name)
        console.log(this.endCenter, this.endCenter, this.endLeft, this.endRight, '总')
      })
    }

  },
  mounted() {
    this.centerName = this.centerData[0].name
    this.num = Number(this.centerData[0].num)
    this.filterData(this.centerName)
    this.getLine()
    window.addEventListener('scroll', this.handleScroll, true)
    // const _this = this
    // _this.resizeObserver = new ResizeObserver(entries => {
    //   _this.$nextTick(() => {
    //     _this.$refs.messageInfoTableRef.resizeTo(entries[0].target.clientWidth)
    //     _this.$refs.transcodingTableRef.resizeTo(entries[0].target.clientWidth)
    //   })
    // })
    // _this.resizeObserver.observe(document.getElementsByClassName('cssTransforms'))
    // const content = document.getElementsByClassName('cssTransforms')
    const myObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        // console.log('大小位置', entry.contentRect)
        // console.log('监听的DOM', entry.target)
        this.getResize()
      })
    })
    myObserver.observe(this.$refs.wrapper)
    // window.addEventListener('resize', this.getResize)
    // const content = document.getElementsByClassName('cssTransforms')
    // console.log(content, 'content')
    // content.addEventListener('resize', this.getResize)
  },
  destroyed() {
    this.clearLine()
    window.removeEventListener('resize', this.getResize)
    const content = document.getElementById('content')
    content.removeEventListener('scroll', this.getResize, false)
  },

  methods: {
    getResize() {
      // console.log(this.leftList, 'llllll')
      if (this.leftList && this.leftList.length) {
        this.leftList.forEach((line) => {
          line.position()
        })
      }
      if (this.rightList && this.rightList.length) {
        this.rightList.forEach((line) => {
          line.position()
        })
      }
    },
    clearLine() {
      console.log(this.leftList, this.rightList, 'llllrrrrr')
      if (this.leftList || this.leftList.length) {
        this.leftList.forEach((line) => {
          console.log(line, 'line')
          line.remove()
        })
      }
      if (this.rightList || this.rightList.length) {
        this.rightList.forEach((line) => {
          line.remove()
        })
      }
      this.rightList = []
      this.leftList = []
    },
    getLine() {
      // var box = document.getElementById('center')
      var box = this.$refs.center
      for (let i = 0; i < this.endLeft.length; i++) {
        // const left = document.getElementById('left' + i)

        const left = this.$refs[`left${i}`][0]
        console.log(left, 'refsss')
        const lineContainer = new LeaderLine(left, box, this.styleOption)
        lineContainer.show(this.showEffectName, this.animOptions)
        lineContainer.position()
        this.leftList.push(lineContainer)
      }
      for (let i = 0; i < this.endRight.length; i++) {
        // const right = document.getElementById('right' + i)
        const right = this.$refs[`right${i}`][0]
        const lineContainer = new LeaderLine(right, box, this.rightstyleOption)
        lineContainer.show(this.showEffectName, this.animOptions)
        lineContainer.position()
        this.rightList.push(lineContainer)
      }
    },
    filterData(name) {
      const myObserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
          this.getResize()
        })
      })
      myObserver.observe(this.$refs.wrapper)
      console.log(name, 'name')
      window.addEventListener('scroll', this.handleScroll, true)

      this.endLeft = this.sourceList.filter(item => {
        if (item.type === name) {
          return item
        }
      })
      this.endRight = this.directionList.filter(item => {
        if (item.type === name) {
          return item
        }
      })

      this.$nextTick(() => {
        this.clearLine()
        // window.removeEventListener('resize', this.getResize)
      })
      this.$nextTick(() => {
        this.getLine()
      })
    },
    GetPercent(num, total) {
      num = parseFloat(num)
      total = parseFloat(total)
      if (isNaN(num) || isNaN(total)) {
        return 0
      }
      return total <= 0 ? '0%' : (Math.round(num / total * 10000) / 100.00)
    },
    changeCenter(e) {
      console.log(e, 'eee')
      this.centerData.forEach(item => {
        if (item.name === e) {
          this.centerName = item.name
          this.num = Number(item.num)
          this.$nextTick(() => {
            this.filterData(e)
          })
        }
      })
    },
    handleScroll () {
      // var scrollTop = window.pageYOffset || document.documentElement.scrollTop
      // console.log(scrollTop)
      this.getResize()
    }
  }
}
</script>

<style scoped lang='scss'>
.wrapper {
  width: 100%;
  height:100%;
  overflow:hidden;
}
.wrapper .title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.left,
.right {
  width: 33%;
}
.table {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.table-title {
  width: 33%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.table-title > div {
  width: 33%;
  text-align: center;
}
.table-box {
  background: #eaf3ff;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
}
.table-box > div {
  width: 33%;
  text-align: center;
}
.center {
  position: relative;
}
.center-left {
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
  left: -25px;
  background: rgba(0, 126, 255, 0.5);
  padding: 0;
  z-index: 100;
}
.center-right {
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
  right: -25px;
  background: rgba(31, 180, 136, 0.5);
  padding: 0;
  z-index: 100;
}
.center-left img,
.center-right img {
  width: 80%;
  height: 100%;
}
.center > .center-main {
  width: 150px;
  position: relative;
  padding: 5px 50px;
  text-align: center;
  background: #f2f3f6;
  z-index: 1001 !important;
}
.center > .center-main .center-inner{
  ::v-deep .el-input__inner{
     background:#f2f3f6 !important;
     color:#000;
     border:none;
     width:70px;
  }
  ::v-deep .el-input__suffix{
    color:#000;
  }

}
.table-box-right {
  background: #ecfaf4;
}
</style>
