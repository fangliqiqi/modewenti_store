
<template>
  <div class="divBox">
    <el-card class="box-card">
      <el-form
        ref="formValidate"
        v-loading="fullscreenLoading"
        class="formValidate mt20"
        :rules="ruleValidate"
        :model="formValidate"
        label-width="150px"
        @submit.native.prevent
      >
        <div>
          <el-form-item label="奖品类型：" prop="luckDrawType">
            <div class="acea-row">
              <el-select v-model="formValidate.luckDrawType" placeholder="请选择" class="selWidth">
                <el-option
                  v-for="item in luckDrawTypelist"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </div>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="商品类型：" prop="type">
            <div class="acea-row">
              <el-select v-model="formValidate.type" @change="typeChange" placeholder="请选择" class="selWidth">
                <el-option
                  v-for="item in shippingList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"

                />
              </el-select>
            </div>
          </el-form-item>
        </div>
        <div v-if="formValidate.type==2||formValidate.type==1">
          <el-form-item label="选择商品：" prop="image">
            <div class="upLoadPicBox" @click="changeGood">
              <div v-if="formValidate.image" class="pictrue"><img :src="formValidate.image"></div>
              <div v-else class="upLoad">
                <i class="el-icon-camera cameraIconfont"/>
              </div>
            </div>
          </el-form-item>
        </div>

        <div>
          <!-- <el-row :gutter="24" v-if="formValidate.type==2">
            <el-col :span="24">
              <el-form-item label="商品主图：">
                <div class="upLoadPicBox" @click="modalPicTap('1')">
                  <div v-if="formValidate.image" class="pictrue"><img :src="formValidate.image"></div>
                  <div v-else class="upLoad">
                    <i class="el-icon-camera cameraIconfont"/>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row> -->
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="奖品图片：" prop="imagess">
                <div class="acea-row">
                  <div
                    v-for="(item,index) in formValidate.imagess"
                    :key="index"
                    class="pictrue"
                    draggable="true"
                    @dragstart="handleDragStart($event, item)"
                    @dragover.prevent="handleDragOver($event, item)"
                    @dragenter="handleDragEnter($event, item)"
                    @dragend="handleDragEnd($event, item)"
                  >
                    <img :src="item">
                    <i class="el-icon-error btndel" @click="handleRemove(index)"/>
                  </div>
                  <div v-if="formValidate.imagess.length==0" class="upLoadPicBox" @click="modalPicTap('2')">
                    <div class="upLoad">
                      <i class="el-icon-camera cameraIconfont"/>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

           <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="奖品名称：" prop="name">
                <el-input v-model="formValidate.name"  placeholder="请输入商品名称" class="selWidth"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="奖品中奖率：" prop="winningRate">
                <div style="display: flex;">
                  <el-input-number v-model="formValidate.winningRate"  :controls="false"
                             :max="100"
                            placeholder="请输入奖品中奖率0-100" style="width: 70%;"/>
                  <span style="margin-left: 10px;font-size: 20px;">%</span>
                </div>
              </el-form-item>
            </el-col>
           </el-row>
           <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="奖品价值：" prop="price">
                <el-input v-model="formValidate.price"
                      oninput ="value=value.replace(/[^0-9.]/g,'')"
                      placeholder="请输入奖品价值" :disabled="formValidate.type==4" class="selWidth"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="奖品数量：" prop="number">
                <el-input-number v-model="formValidate.number" :step="1" step-strictly :min="1" placeholder="请输入奖品数量"
                                 class="selWidth"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <el-form-item style="margin-top:30px;">
          <!-- <el-button
            v-show="(!$route.params.id && currentTab > 0) || ($route.params.id && currentTab===2)"
            type="primary"
            class="submission"
            size="small"
            @click="handleSubmitUp"
          >上一步
          </el-button> -->
          <!-- <el-button
            v-show="currentTab == 0"
            type="primary"
            class="submission"
            size="small"
            @click="handleSubmitNest1('formValidate')"
          >下一步
          </el-button> -->
          <el-button
            :loading="loading"
            type="primary"
            class="submission"
            size="small"
            @click="handleSubmit('formValidate')"
          >提交
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

  </div>
</template>

<script>

import {drawStoreadd, drawStoreupdate ,drawStoredetail} from '@/api/drawluck.js'



export default {

  data() {
    return {
      currentTab: 0,
      formValidate:{
        imagess:[],
        images:''
      },
      loading: false,
      fullscreenLoading: false,
      shippingList: [
        {id:1,name:'优惠券'},
        {id:2,name:'商品卷'},
        {id:3,name:'实物'},
        {id:4,name:'谢谢惠顾'},
      ],
      luckDrawTypelist:[
        {id:1,name:'幸运大转盘'},
        {id:2,name:'百分百砸金蛋'},
        {id:3,name:'翻牌抽奖'},
      ],
      ruleValidate: {
        luckDrawType:[
          {required: true, message: '请选择抽奖类型', trigger: 'change'}
        ],
        name: [
          {required: true, message: '请输入奖品名称', trigger: 'blur'}
        ],
        number: [
          {required: true, message: '请输入奖品数量', trigger: 'blur'}
        ],
        price: [
          {required: true, message: '请输入奖品价值', trigger: 'blur'}
        ],
        image: [
          {required: true, message: '请上传商品图', trigger: 'change'}
        ],
        imagess: [
          {required: true, message: '请上传奖品图片', type: 'array', trigger: 'change'}
        ],
        winningRate: [
          {required: true, message: '请设置中奖率', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请选择奖品类型', trigger: 'change'}
        ]
      }

    }
  },
  computed: {

  },
  created() {

  },

  mounted() {

    // console.log(this.$route.params)
    if (this.$route.params.id) {
      this.currentTab = 1
      drawStoredetail({id:this.$route.params.id}).then(res=>{
        console.log('编辑')
        console.log(res)
        this.formValidate = res
        this.formValidate.imagess = []
        this.formValidate.imagess.push(this.formValidate.prizePicture)
        console.log(this.formValidate.imagess)
        // this.formValidate.type = Number(this.formValidate.type)
        console.log('---------------')
        console.log(this.formValidate)
      })
    }
  },
  methods: {

    // 中奖率限制大小
    numBer(val,maxNum){

       //转换数字类型
       this.formValidate.winningRate = Number(val)
       //重新渲染
       this.$nextTick(()=>{
          //比较输入的值和最大值，返回小的
          let num = Math.min(Number(val),maxNum)
          //输入负值的情况下， = 0（可根据实际需求更该）
          if(num<0) {
              this.formValidate.winningRate = 0
          }else {
              //反之
              this.formValidate.winningRate = num
          }
       })

    },
    // 删除图片
    handleRemove(i) {
      this.formValidate.imagess.splice(i, 1)
      this.$forceUpdate()
    },
    typeChange(e){
      console.log(e)
      if(e==4){
        this.$set(this.formValidate,'price',0)
      }
    },
    // 点击商品图
    modalPicTap(tit, num, i) {
      const _this = this
      this.$modalUpload(function (img) {
        if (tit === '1' && !num) {
          _this.formValidate.image = img[0].sattDir
          _this.ManyAttrValue[0].image = img[0].sattDir
        }
        if (tit === '2' && !num) {
          console.log('上传奖品图')
          console.log(img)
          if (img.length > 10) return this.$message.warning("最多选择10张图片！");
          if (img.length + _this.formValidate.imagess.length > 10) return this.$message.warning("最多选择10张图片！");
          img.map((item) => {
            _this.formValidate.imagess.push(item.sattDir)
            _this.$forceUpdate()
          });
        }
        if (tit === '1' && num === 'duo') {
          _this.ManyAttrValue[i].image = img[0].sattDir
        }
      }, tit, 'content')
    },

    // 选择商品
    changeGood() {
      const _this = this
      this.$modalGoodList(function (row) {
        console.log(row)
        // _this.formValidate.image = row.image
        _this.formValidate.bindingId = row.id
        console.log(_this.formValidate.image)
        _this.$set(_this.formValidate,'image',row.image)
        _this.$forceUpdate()
      })
    },
    // 下一步
    handleSubmitNest1() {
      if (this.formValidate.type==2&&!this.formValidate.image) {
        return this.$message.warning("请选择商品！");
      } else {
        this.currentTab++;
      }
    },


    // 提交
    handleSubmit(name) {
      console.info("-----------------------------------------");
      console.log(this.formValidate);
      this.formValidate.prizePicture = this.formValidate.imagess[0]

      this.$refs[name].validate((valid) => {
        if (valid) {
          this.fullscreenLoading = true;
          this.loading = true;
          if(this.formValidate.id){
            drawStoreupdate(this.formValidate).then(async () => {
                this.fullscreenLoading = false;
                this.$message.success('修改成功');
                this.$router.push({
                  path: "/drawLuck/drawStore/storelist",
                });
                this.$refs[name].resetFields();
                // this.formValidate.images = [];
                this.loading = false;
              })
              .catch(() => {
                this.fullscreenLoading = false;
                this.loading = false;
              })
          }else{
            drawStoreadd(this.formValidate).then(async () => {
                this.fullscreenLoading = false;
                this.$message.success('添加成功');
                this.$router.push({
                  path: "/drawLuck/drawStore/storelist",
                });
                this.$refs[name].resetFields();
                // this.formValidate.images = [];
                this.loading = false;
              })
              .catch(() => {
                this.fullscreenLoading = false;
                this.loading = false;
              })
          }
          // this.$route.params.id
          //   ? seckillStoreUpdateApi({id: this.$route.params.id}, this.formValidate)
          //     .then(async () => {
          //       this.fullscreenLoading = false;
          //       this.$message.success('编辑成功');
          //       this.$router.push({
          //         path: "/marketing/seckill/list",
          //       });
          //       this.$refs[name].resetFields();
          //       this.formValidate.images = [];
          //       this.loading = false;
          //     })
          //     .catch(() => {
          //       this.fullscreenLoading = false;
          //       this.loading = false;
          //     })
          //   : seckillStoreSaveApi(this.formValidate)
          //     .then(async (res) => {
          //       this.fullscreenLoading = false;
          //       this.$message.success('新增成功');
          //       this.$router.push({
          //         path: "/marketing/seckill/list",
          //       });
          //       this.$refs[name].resetFields();
          //       this.formValidate.images = [];
          //       this.loading = false;
          //     })
          //     .catch(() => {
          //       this.fullscreenLoading = false;
          //       this.loading = false;
          //     });
        } else {
          // this.$message.warning("请填写完整商品信息！");
        }
      });

    },
    // 上一步
    handleSubmitUp() {
      if (this.currentTab-- < 0) this.currentTab = 0;
    },
    setTagsViewTitle() {
      const title = '编辑抽奖商品'

      this.$store.dispatch('tagsView/updateVisitedView', title)
    },
    // 移动
    handleDragStart(e, item) {
      this.dragging = item;
    },
    handleDragEnd(e, item) {
      this.dragging = null
    },
    handleDragOver(e) {
      e.dataTransfer.dropEffect = 'move'
    },
    handleDragEnter(e, item) {
      e.dataTransfer.effectAllowed = 'move'
      if (item === this.dragging) {
        return
      }
      const newItems = [...this.formValidate.imagess]
      const src = newItems.indexOf(this.dragging)
      const dst = newItems.indexOf(item)
      newItems.splice(dst, 0, ...newItems.splice(src, 1))
      this.formValidate.imagess = newItems;
    }
  }
}
</script>

<style scoped lang="scss">
.labeltop {
  /deep/ .el-input-number--small {
    /*width: 172px !important;*/
    min-width: 132px !important;
  }
}

.proCoupon {
  /deep/ .el-form-item__content {
    margin-top: 5px;
  }
}

.tabPic {
  width: 40px !important;
  height: 40px !important;

  img {
    width: 100%;
    height: 100%;
  }
}

.noLeft {
  /deep/ .el-form-item__content {
    margin-left: 0 !important;
  }
}

.tabNumWidth {
  /deep/ .el-input-number--medium {
    width: 121px !important;
  }

  /deep/ .el-input-number__increase {
    width: 20px !important;
    font-size: 12px !important;
  }

  /deep/ .el-input-number__decrease {
    width: 20px !important;
    font-size: 12px !important;
  }

  /deep/ .el-input-number--medium .el-input__inner {
    padding-left: 25px !important;
    padding-right: 25px !important;
  }

  /deep/ thead {
    line-height: normal !important;
  }

  /deep/ .el-table .cell {
    line-height: normal !important;
  }
}

.selWidth {
  width: 80%;
}

.selWidthd {
  width: 300px;
}

.button-new-tag {
  height: 28px;
  line-height: 26px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.pictrue {
  width: 60px;
  height: 60px;
  border: 1px dotted rgba(0, 0, 0, 0.1);
  margin-right: 10px;
  position: relative;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
  }
}

.btndel {
  position: absolute;
  z-index: 1;
  width: 20px !important;
  height: 20px !important;
  left: 46px;
  top: -4px;
}

.labeltop {
  /deep/ .el-form-item__label {
    /*float: none !important;*/
    /*display: inline-block !important;*/
    /*margin-left: 120px !important;*/
    /*width: auto !important;*/
  }
}
</style>
