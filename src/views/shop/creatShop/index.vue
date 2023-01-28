<template>
  <div class="divBox">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-steps :active="currentTab" align-center finish-status="success">
          <el-step title="门店信息" />
          <el-step   title="用户信息" />
        </el-steps>
      </div>
      <el-form ref="formValidate" v-loading="fullscreenLoading" class="formValidate mt20" :rules="ruleValidate" :model="formValidate" label-width="120px" @submit.native.prevent>
        <el-row v-show="currentTab === 0" :gutter="24">
          <!-- 商品信息-->
          <el-col v-bind="grid2">
            <el-form-item label="门店名称：" prop="branchName">
              <el-input v-model="formValidate.branchName" placeholder="请输入门店名称" />
            </el-form-item>
          </el-col>
          <el-col v-bind="grid2">
            <el-form-item label="提现银行卡：" prop="account">
              <el-input v-model="formValidate.account" placeholder="请输入银行卡" />
            </el-form-item>
          </el-col>

          <el-col v-bind="grid2">
            <el-form-item label="门店类型：" prop="branchType">
              <el-cascader v-model="formValidate.branchType" :options="merCateList" :props="props2" clearable class="selWidth" :show-all-levels="false" />
            </el-form-item>
          </el-col>
          <el-col v-bind="grid2">
            <el-form-item label="门店标签：">
              <div>
                <el-tag
                  :key="tag"
                  v-for="(tag,index) in dynamicTags"
                  v-if="index<5"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)">
                  {{tag}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 标签</el-button>
              </div>
              <el-input v-show="false" v-model="formValidate.branchLabel" readonly />
            </el-form-item>
          </el-col>
          <el-col v-bind="grid2">
            <el-form-item label="省市地址：" prop="address">
              <el-cascader
                class="dialogWidth"
                style="width: 100%;"
                clearable
                v-model="formValidate.address"
                :options="addresData"
                :props="{ value: 'label' }"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col v-bind="grid2">
            <el-form-item label="详细地址：" prop="attr">
              <el-input v-model="formValidate.attr"  style="width: 100%;" placeholder="请输入详细地址" class="dialogWidth"></el-input>
            </el-form-item>
          </el-col>

          <el-col v-bind="grid2">
            <el-form-item label="租金(元)：" prop="rentAmount">
              <el-input v-model="formValidate.rentAmount" oninput ="value=value.replace(/[^0-9.]/g,'')" placeholder="请输入租金" />
            </el-form-item>
          </el-col>
         <el-col v-bind="grid2">
           <el-form-item label="保证金(元)：" prop="earnestMoney">
             <el-input v-model="formValidate.earnestMoney" oninput ="value=value.replace(/[^0-9.]/g,'')" placeholder="请输入保证金" />
           </el-form-item>
         </el-col>

          <el-col v-bind="grid2">
            <el-form-item label="门店简介：">
              <el-input v-model="formValidate.description" type="textarea" :rows="3" placeholder="请输入门店简介" />
            </el-form-item>
          </el-col>
<!--          <el-col v-bind="grid2">-->
<!--            <el-form-item label="门店封面图：" prop="image">-->
<!--              <div class="upLoadPicBox" @click="modalPicTap('1')">-->
<!--                <div v-if="formValidate.image" class="pictrue"><img :src="formValidate.image"></div>-->
<!--                <div v-else class="upLoad">-->
<!--                  <i class="el-icon-camera cameraIconfont" />-->
<!--                </div>-->
<!--              </div>-->
<!--            </el-form-item>-->
<!--          </el-col>-->

          <el-col :span="24">
            <el-form-item label="门店图片：" prop="sliderImage">
              <div class="acea-row">
                <div
                  v-for="(item,index) in formValidate.sliderImage"
                  :key="index"
                  class="pictrue"
                  draggable="true"
                  @dragstart="handleDragStart($event, item)"
                  @dragover.prevent="handleDragOver($event, item)"
                  @dragenter="handleDragEnter($event, item)"
                  @dragend="handleDragEnd($event, item)"
                >
                  <img :src="item">
                  <i class="el-icon-error btndel" @click="handleRemove(index)" />
                </div>
                <div class="upLoadPicBox" @click="modalPicTap('2')">
                  <div class="upLoad">
                    <i class="el-icon-camera cameraIconfont" />
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 用户详情-->
        <el-row v-show="currentTab === 1" >
          <el-col v-bind="grid2">
            <el-form-item label="负责人名称：" prop="entUserUpdateFo.name">
              <el-input v-model="formValidate.entUserUpdateFo.name" placeholder="请输入负责人名称" />
            </el-form-item>
          </el-col>
          <el-col v-bind="grid2">
            <el-form-item label="联系方式：" prop="entUserUpdateFo.mobilePhone">
              <el-input v-model="formValidate.entUserUpdateFo.mobilePhone" placeholder="请输入负责人联系方式"
                        oninput ="value=value.replace(/[^0-9.]/g,'')"   :max="11" />
            </el-form-item>
          </el-col>
          <el-col v-bind="grid2">
            <el-form-item label="身份证：" prop="entUserUpdateFo.idCard">
              <el-input v-model="formValidate.entUserUpdateFo.idCard" placeholder="请输入身份证号码" />
            </el-form-item>
          </el-col>
          <el-col v-bind="grid2">
            <el-form-item label="邮箱：" prop="entUserUpdateFo.sex">
              <el-input v-model="formValidate.entUserUpdateFo.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
          <el-col v-bind="grid2">
            <el-form-item label="民族：" prop="entUserUpdateFo.nation">
              <el-input v-model="formValidate.entUserUpdateFo.nation" placeholder="请输入民族" />
            </el-form-item>
          </el-col>
          <el-col v-bind="grid2">
            <el-form-item label="性别：" prop="entUserUpdateFo.sex">
              <el-select v-model="formValidate.entUserUpdateFo.sex" placeholder="请选择性别" style="width: 100%;">
                  <el-option
                    v-for="item in sexList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>

        </el-row>
        <el-form-item>
          <el-button v-show="currentTab>0" type="primary" class="submission" @click="handleSubmitUp">上一步</el-button>
          <el-button v-show="currentTab<1"  type="primary" class="submission" @click="handleSubmitNest('formValidate')">下一步</el-button>
          <el-button v-show="currentTab===1 || $route.params.id" type="primary" class="submission" @click="handleSubmit('formValidate')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
<!--    <CreatTemplates ref="addTemplates" @getList="getShippingList" />-->
  </div>
</template>

<script>
  import { addShopApi, getShopInfoApi, updateShopApi } from '@/api/shop'
  import { shippingTemplatesList } from '@/api/logistics'
  import CreatTemplates from '@/views/systemSetting/logistics/shippingTemplates/creatTemplates'
  import city from '@/utils/city';
  const defaultObj = {
    account:'',
    attr: '',
    branchLabel: '',
    branchName: '',
    branchPhotoParamList: [],
    sliderImage:[],
    branchType: '',
    city:'',
    description: '',
    district: '',
    entUserUpdateFo: {
      'idCard':"",
      "address": "",
      "birthday": "",
      "city": "",
      "description": "",
      "district": "",
      "education": 0,
      "email": "",
      "mobilePhone": "",
      "name": "",
      "nation": "",
      "nickName": "",
      "photoName": "",
      "province": "",
      "qqNumber": 0,
      "sex": '',
      "shortName": "",
      "userId": 0
    },
    province: '',
    rentAmount: ''
  }
  const imageObj = {
    branchId: 0,
    id: 0,
    photoSort: "",
    photoType: 0,
    photoUrl: ""
  }

  export default {
    name: 'ShopAdd',
    components: { CreatTemplates },
    data() {
      var bankAccountValid = (rule, value, callback) => {
        const strBin = '10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99'
        if (!value) {
          return callback(new Error('银行卡不能为空'))
        } else if (!Number.isInteger(+value)) {
          callback(new Error('银行卡号必须全为数字'))
        } else if (value.trim().length < 12 || value.trim().length > 19) {
          callback(new Error('银行卡号长度必须在12到19之间'))
        } else if (strBin.indexOf(value.substring(0, 2)) === -1) {
          callback(new Error('银行卡号开头6位不符合规范'))
        } else {
          callback()
        }
      };
      return {
        addresData:[],
        merCateList: [], // 分类筛选
        activity: { '默认': 'red', '秒杀': 'blue', '砍价': 'green', '拼团': 'yellow' },
        props2: {
          children: 'child',
          label: 'name',
          value: 'id',
          multiple: true,
          emitPath: false
        },
        checkboxGroup: [],
        tabs: [],
        fullscreenLoading: false,
        props: { multiple: true },
        active: 0,
        ruleList: [],

        dynamicTags:[],
        inputVisible: false,
        inputValue: '',
        formValidate: Object.assign({}, defaultObj),
        formDynamics: {
          ruleName: '',
          ruleValue: []
        },
        tempData: {
          pageNo: 1,
          pageSize: 9999
        },
        manyTabTit: {},
        manyTabDate: {},
        grid2: {
          xl: 10,
          lg: 12,
          md: 12,
          sm: 24,
          xs: 24
        },
        // 规格数据
        formDynamic: {
          attrsName: '',
          attrsVal: ''
        },
        isBtn: false,
        currentTab: 0,
        isChoice: '',
        grid: {
          xl: 8,
          lg: 8,
          md: 12,
          sm: 24,
          xs: 24
        },

        ruleValidate: {
          // account: [
          //   { required: true,  trigger: 'blur',validator: bankAccountValid }
          // ],
          address:[
            { required: true, message: '请选择省市区', trigger: 'change' }
          ],
          branchName: [
            { required: true, message: '请输入门店名称', trigger: 'blur' }
          ],
          branchLabel: [
            { required: true, message: '请选择门店标签', trigger: 'change', type: 'array', min: '1' }
          ],
          attr: [
            { required: true, message: '请输入详细地址', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请输入商品简介', trigger: 'blur' }
          ],
          earnestMoney: [
            { required: true, message: '请输入保证金', trigger: 'change' }
          ],
          rentAmount: [
            { required: true, message: '请输入租金', trigger: 'change' }
          ],
          sliderImage: [
            { required: true, message: '请上传门店图片', type: 'array', trigger: 'change' }
          ],
          entUserUpdateFo:{
            name:[
              {required: true, message: '请输入用户名称', trigger: 'blur'}
            ],
            mobilePhone:[
              {required: true, message: '请输入联系方式', trigger: 'blur'},
              { min: 11, max: 11, message: '输入正确的联系方式', trigger: 'blur' }
            ]
          }
        },
        attrInfo: {},
        tableFrom: {
          pageNo: 1,
          pageSize: 9999,
          keywords: ''
        },
        tempRoute: {},
        keyNum: 0,
        sexList:[
          {value:1,label:'男'},
          {value:2,label:'女'},
        ]
      }
    },
    computed: {
      attrValue() {
        const obj = Object.assign({}, defaultObj.attrValue[0])
        delete obj.image
        return obj
      },

    },
    watch: {
      dynamicTags(val, oldVal){
          this.formValidate.branchLabel = val.join(',')||''
      }
    },
    created() {
      this.addresData = city;
      this.tempRoute = Object.assign({}, this.$route)
      if (this.$route.params.id && this.formValidate.specType) {
        this.$watch('formValidate.attr', this.watCh)
      }
    },
    mounted() {
      this.formValidate.sliderImage = []
      this.formValidate.branchPhotoParamList=[]
      if ( this.$route.params.id ) {
        this.setTagsViewTitle()
        this.getInfo()
      }
      // this.getShippingList()
    },
    methods: {
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },

      addCoupon() {
        const _this = this
        this.$modalCoupon('wu', this.keyNum += 1, this.formValidate.coupons, function(row) {
          _this.formValidate.couponIds = []
          _this.formValidate.coupons = row
          row.map((item) => {
            _this.formValidate.couponIds.push(item.id)
          })
        }, '')
      },

      setTagsViewTitle() {
        const title = '编辑商品'
        const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.$route.params.id}` })
        this.$store.dispatch('tagsView/updateVisitedView', route)
      },

      onChangeGroup() {
        this.checkboxGroup.includes('isGood') ? this.formValidate.isGood = true : this.formValidate.isGood = false
        this.checkboxGroup.includes('isBenefit') ? this.formValidate.isBenefit = true : this.formValidate.isBenefit = false
        this.checkboxGroup.includes('isBest') ? this.formValidate.isBest = true : this.formValidate.isBest = false
        this.checkboxGroup.includes('isNew') ? this.formValidate.isNew = true : this.formValidate.isNew = false
        this.checkboxGroup.includes('isHot') ? this.formValidate.isHot = true : this.formValidate.isHot = false
      },

      attrFormat(arr) {
        let data = []
        const res = []
        return format(arr)
        function format(arr) {
          if (arr.length > 1) {
            arr.forEach((v, i) => {
              if (i === 0) data = arr[i]['attrValue']
              const tmp = []
              data.forEach(function(vv) {
                arr[i + 1] && arr[i + 1]['attrValue'] && arr[i + 1]['attrValue'].forEach(g => {
                  const rep2 = (i !== 0 ? '' : arr[i]['attrName'] + '_') + vv + '$&' + arr[i + 1]['attrName'] + '_' + g
                  tmp.push(rep2)
                  if (i === (arr.length - 2)) {
                    const rep4 = {
                      image: '',
                      price: 0,
                      cost: 0,
                      otPrice: 0,
                      stock: 0,
                      barCode: '',
                      weight: 0,
                      volume: 0,
                      brokerage: 0,
                      brokerage_two: 0
                    }
                    rep2.split('$&').forEach((h, k) => {
                      const rep3 = h.split('_')
                      if (!rep4['attrValue']) rep4['attrValue'] = {}
                      rep4['attrValue'][rep3[0]] = rep3.length > 1 ? rep3[1] : ''
                    })
                    Object.values(rep4.attrValue).forEach((v, i) => {
                      rep4['value' + i] = v
                    })
                    res.push(rep4)
                  }
                })
              })
              data = tmp.length ? tmp : []
            })
          } else {
            const dataArr = []
            arr.forEach((v, k) => {
              v['attrValue'].forEach((vv, kk) => {
                dataArr[kk] = v['attrName'] + '_' + vv
                res[kk] = {
                  image: '',
                  price: 0,
                  cost: 0,
                  otPrice: 0,
                  stock: 0,
                  barCode: '',
                  weight: 0,
                  volume: 0,
                  brokerage: 0,
                  brokerage_two: 0,
                  attrValue: { [v['attrName']]: vv }
                }
                Object.values(res[kk].attrValue).forEach((v, i) => {
                  res[kk]['value' + i] = v
                })
              })
            })
            data.push(dataArr.join('$&'))
          }
          return res
        }
      },
      // 运费模板
      addTem() {
        this.$refs.addTemplates.dialogVisible = true
        this.$refs.addTemplates.getCityList()
      },
      // 添加规则；
      addRule() {
        const _this = this
        this.$modalAttr(this.formDynamics, function() {
          _this.productGetRule()
        })
      },
      // 选择规格
      onChangeSpec(num) {
        if (num) this.productGetRule()
      },
      // 选择属性确认
      confirm() {
        if (!this.formValidate.selectRule) {
          return this.$message.warning('请选择属性')
        }
        const data = []
        this.ruleList.forEach(item => {
          if (item.id === this.formValidate.selectRule) {
            item.ruleValue.forEach(i => {
              data.push({
                attrName: i.value,
                attrValue: i.detail
              })
            })
          }
          this.formValidate.attr = data
        })
      },
      filerMerCateList(treeData) {
        return treeData.map((item) => {
          if(!item.child){
            item.disabled = true
          }
          item.label = item.name
          return item
        })
      },

      // 添加按钮
      addBtn() {
        this.clearAttr()
        this.isBtn = true
      },
      // 取消
      offAttrName() {
        this.isBtn = false
      },
      clearAttr() {
        this.formDynamic.attrsName = ''
        this.formDynamic.attrsVal = ''
      },

      //确认省市区
      handleChange(e){
        let province = e[0];
        let city = e[1];
        let district = e[2];

        if(e.length===2){
          this.formValidate.province = province
          this.formValidate.city = city
          // this.ruleForm.address = province + ',' + city;
        }else if(e.length===3){
          this.formValidate.province = province
          this.formValidate.city = city
          this.formValidate.district = district
          // this.ruleForm.address = province + ',' + city + ',' + area;
        }
      },

      // 详情
      getInfo () {
        this.fullscreenLoading = true
        getShopInfoApi(this.$route.params.id).then(async res => {
          let info = res
          this.formValidate =  {
            id:info.id,
            account:info.account||'',
            attr: info.attr||'',
            branchLabel: info.branchLabel||'',
            branchName: info.branchName||'',
            branchPhotoParamList:info.branchPhotoResultList|| [], //
            sliderImage:(info.branchPhotoResultList||[]).map(item=>{return item.photoUrl}),
            branchType: info.branchType||'',
            city:info.city||'',
            description:info.description|| '',
            district: info.district||'',
            entUserUpdateFo: {
              "idCard":info.entUserUpdateFo.idCard,
              "address": "",
              "birthday": "",
              "city": "",
              "description": "",
              "district": "",
              "education": 0,
              "email": info.entUserUpdateFo.email,
              "mobilePhone": info.entUserUpdateFo.mobilePhone,
              "name":info.entUserUpdateFo.name,
              "nation": info.entUserUpdateFo.nation,
              "nickName": "",
              "photoName": "",
              "province": "",
              "qqNumber": 0,
              "sex": info.entUserUpdateFo.sex,
              "shortName": "",
              "userId": 0
            },
            province: info.province||'',
            rentAmount: info.rentAmount||'',
            earnestMoney:info.rentAmount||''
          }
          this.formValidate.address = [];
          if(info.district){
            this.formValidate.address = [info.province,info.city,info.district]
          }else{
            this.formValidate.address = [info.province,info.city]
          }

          this.dynamicTags = info.branchLabel.split(',')||[]
          // this.productGetRule()

          this.fullscreenLoading = false
        }).catch(res => {
          this.fullscreenLoading = false
          this.$message.error(res.message);
        })
      },
      handleRemove (i) {
        this.formValidate.sliderImage.splice(i, 1)
      },
      // 点击商品图
      modalPicTap (tit, num, i) {
        const _this = this
        this.$modalUpload(function(img) {
          if(tit==='1'&& !num){
            _this.formValidate.image = img[0].sattDir
          }
          if(tit==='2'&& !num){
            img.map((item) => {
              _this.formValidate.sliderImage.push(item)
            });
          }
        },tit, 'content')
      },
      handleSubmitUp(){
        // this.currentTab --
        if (this.currentTab-- <0) this.currentTab = 0;
      },
      handleSubmitNest(name){
        if (this.currentTab++ >= 1) this.currentTab = 0
      },
      // 提交
      handleSubmit (name) {
        this.onChangeGroup()
        let imageList = this.formValidate.branchPhotoParamList.concat(
          this.formValidate.sliderImage.map((item,index)=>{
            console.info(item)
            return {
              "branchId":item.branchId,
              "id": item.attId,
              "photoSort": index,
              "photoType": item.attType,
              "photoUrl": item.sattDir
            }
          })
        )
        this.formValidate.branchPhotoParamList = imageList.map((item,index)=>{
          item.photoSort = index;
          return item;
        }).filter(item=>{
          return !this.formValidate.sliderImage.includes(item.photoUrl,this.formValidate.branchPhotoParamList.length)
        })
        console.log(this.formValidate)
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.fullscreenLoading = true
            if(this.$route.params.id){
              let data = this.formValidate;
              updateShopApi(data).then(async res => {
                this.$message.success('编辑成功');
                setTimeout(() => {
                  this.$router.push({ path: '/shop/list' });
                }, 500);
                this.fullscreenLoading = false
              }).catch(res => {
                this.fullscreenLoading = false
              })
            }else{
              addShopApi(this.formValidate).then(async res => {
                this.$message.success('新增成功');
                setTimeout(() => {
                  this.$router.push({ path: '/shop/list' });
                }, 500);
                this.fullscreenLoading = false
              }).catch(res => {
                this.fullscreenLoading = false
              })
            }
          } else {
            if(!this.formValidate.storeName || !this.formValidate.cateId  || !this.formValidate.keyword
              || !this.formValidate.unitName || !this.formValidate.storeInfo || !this.formValidate.image || !this.formValidate.sliderImage){
              this.$message.warning("请填写完整商品信息！");
            }
          }
        })
      },
      // 表单验证
      validate (prop, status, error) {
        if (status === false) {
          this.$message.warning(error);
        }
      },
      // 移动
      handleDragStart (e, item) {
        this.dragging = item;
      },
      handleDragEnd (e, item) {
        this.dragging = null
      },
      handleDragOver (e) {
        e.dataTransfer.dropEffect = 'move'
      },
      handleDragEnter (e, item) {
        e.dataTransfer.effectAllowed = 'move'
        if (item === this.dragging) {
          return
        }
        const newItems = [...this.formValidate.sliderImage]
        const src = newItems.indexOf(this.dragging)
        const dst = newItems.indexOf(item)
        newItems.splice(dst, 0, ...newItems.splice(src, 1))
        this.formValidate.sliderImage = newItems;
      },
      handleDragEnterFont(e, item) {
        e.dataTransfer.effectAllowed = 'move'
        if (item === this.dragging) {
          return
        }
        const newItems = [...this.formValidate.activity]
        const src = newItems.indexOf(this.dragging)
        const dst = newItems.indexOf(item)
        newItems.splice(dst, 0, ...newItems.splice(src, 1))
        this.formValidate.activity = newItems;
      }
    }
  }
</script>
<style scoped lang="scss">
  .color-item{
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    color:#fff;
    margin-right :10px;
  }
  .color-list .color-item.blue{
    background-color: #1E9FFF;
  }
  .color-list .color-item.yellow{
    background-color: rgb(254, 185, 0);
  }
  .color-list .color-item.green{
    background-color: #009688;
  }
  .color-list .color-item.red{
    background-color: #ed4014;
  }
  .proCoupon{
    /deep/.el-form-item__content{
      margin-top: 5px;
    }
  }
  .tabPic{
    width: 40px !important;
    height: 40px !important;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .noLeft{
    /deep/.el-form-item__content{
      margin-left: 0 !important;
    }
  }
  .tabNumWidth{
    /deep/.el-input-number--medium{
      width: 121px !important;
    }
    /deep/.el-input-number__increase{
      width: 20px !important;
      font-size: 12px !important;
    }
    /deep/.el-input-number__decrease{
      width: 20px !important;
      font-size: 12px !important;
    }
    /deep/.el-input-number--medium .el-input__inner {
      padding-left: 25px !important;
      padding-right: 25px !important;
    }
    /deep/ thead{
      line-height: normal !important;
    }
    /deep/ .el-table .cell{
      line-height: normal !important;
    }
  }
  .selWidth{
    width: 100%;
  }
  .selWidthd{
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
  .pictrue{
    width: 60px;
    height: 60px;
    border: 1px dotted rgba(0,0,0,0.1);
    margin-right: 10px;
    position: relative;
    cursor: pointer;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .btndel{
    position: absolute;
    z-index: 1;
    width :20px !important;
    height: 20px !important;
    left: 46px;
    top: -4px;
  }
  .labeltop{
    /deep/.el-form-item__label{
      float: none !important;
      display: inline-block !important;
      margin-left: 120px !important;
      width: auto !important;
    }
  }
</style>
<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
