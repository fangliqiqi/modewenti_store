<template>
  <div class="divBox">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
<!--        <router-link :to=" { path:'/store/list/creatProduct' } ">-->
<!--          <el-button size="small" type="primary" class="mr10">添加商品</el-button>-->
<!--        </router-link>-->
        <img src='@/assets/imgs/shop.png'></img>
        <span>{{shopInfo.branchName||''}}</span>
        <span>ID:{{shopInfo.id||''}}</span>
      </div>
      <el-row class="shop_main">
        <el-col :span="12">
          <el-row  :gutter="24" >
            <el-col :span="12" class="shop_col">负责人姓名：{{shopInfo.entUserUpdateFo.nickName}}</el-col>
            <el-col :span="12" class="shop_col">负责人电话：{{shopInfo.entUserUpdateFo.photoName}}</el-col>
            <!-- <el-col :span="12">BOSS的ID：{{shopInfo.bossId}}</el-col> -->
            <el-col :span="12" class="shop_col">门店等级：{{shopInfo.branchLevel}}</el-col>
            <el-col :span="12" class="shop_col">门店标签：{{shopInfo.branchLabel}}</el-col>
            <el-col :span="12" class="shop_col">商户提现账号：{{shopInfo.account}}</el-col>
            <el-col :span="12" class="shop_col">门店状态：{{shopInfo.branchStatusname}}</el-col>
            <el-col :span="12" class="shop_col">门店类型：{{shopInfo.branchType}}</el-col>
            <el-col :span="12" class="shop_col">保证金(元)：{{shopInfo.earnestMoney}}</el-col>
            <el-col :span="12" class="shop_col">租金(元)：{{shopInfo.rentAmount}}</el-col>
            <el-col :span="12" class="shop_col">到期时间：{{shopInfo.endTime}}</el-col>
            <el-col :span="12" class="shop_col">门店地址：{{shopInfo.attr}}</el-col>
            <el-col :span="12" class="shop_col">门店订单余额：{{shopInfo.orderBalance}}</el-col>

          </el-row>
        </el-col>
        <el-col :span="12">
          <el-image v-for="(item,index) in shopInfo.branchPhotoResultList" :src="objectUrl + item.photoUrl" :key="'img'+index" style="height: 200px;width: 300px;">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
          <!-- <img src="" alt="" v-for="(item,index) in shopInfo.branchPhotoResultList" :src="objectUrl + item.photoUrl" :key="'img'+index" style="height: 200px;width: 300px;"> -->
        </el-col>
      </el-row>

    </el-card>
  </div>
</template>

<script>
import { getShopInfoApi } from '@/api/shop'
import { getToken } from '@/utils/auth'
export default {
  name: 'ShopInfo',
  components: { },
  data() {
    return {
      props: {
        children: 'child',
        label: 'name',
        value: 'id',
        emitPath: false
      },
      // roterPre: roterPre,
      headeNum: [],
      listLoading: true,
      tableData: {
        data: [],
        total: 0
      },
      tableFrom: {
        pageNo: 1,
        pageSize: 20,
        cateId: '',
        keywords: '',
        type: '1'
      },
      categoryList: [],
      merCateList: [],
      objectUrl: process.env.VUE_APP_BASE_API,
      dialogVisible: false,
      shopInfo:{
        entUserUpdateFo:{}
      }
    }
  },
  mounted() {
    this.getInfo()
    // this.goodHeade()
    // this.getList()
    // this.getCategorySelect()
  },
  methods: {
    getInfo(){
      getShopInfoApi(this.$store.getters.shopId).then(data=>{
      // getShopInfoApi(66).then(data=>{
        this.shopInfo=data
        // if( this.shopInfo.branchLabel == 1){
        //   this.shopInfo.branchLabelname = '服饰'
        // }else if(this.shopInfo.branchLabel == 2){
        //    this.shopInfo.branchLabelname = '食品'
        // }else if(this.shopInfo.branchLabel == 3){
        //    this.shopInfo.branchLabelname = '电子产品'
        // }else if(this.shopInfo.branchLabel == 4){
        //    this.shopInfo.branchLabelname = '办公用品'
        // }

        if( this.shopInfo.branchStatus == 1){
          this.shopInfo.branchStatusname = '启用'
        }else if(this.shopInfo.branchStatus == 2){
           this.shopInfo.branchStatusname = '注销(自主申请)'
        }else if(this.shopInfo.branchStatus == 3){
           this.shopInfo.branchStatusname = '冻结(平台操作)'
        }

      })
    },
    handleRestore(id) {
      this.$modalSure("恢复商品").then(() => {
        restoreApi(id)
          .then((res) => {
            this.$message.success('操作成功');
            this.goodHeade();
            this.getList();
          })
      });
    },
    seachList() {
      this.tableFrom.pageNo = 1
      this.getList()
    },
    handleClose() {
      this.dialogVisible = false
    },
    // 复制
    onCopy(){
      this.dialogVisible = true
    },
    // 导出
    exports () {
      window.open(this.objectUrl + 'admin/export/excel/product?type=1&Authori-zation=' + getToken())
    },
    // 获取商品表单头数量
    goodHeade () {
      productHeadersApi().then(res => {
        this.headeNum = res
      }).catch(res => {
        this.$message.error(res.message);
      })
    },
    // 商户分类；
    getCategorySelect() {
      categoryApi({ status: -1, type: 1 }).then(res => {
        this.merCateList = res
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    // 列表
    getList() {
      this.listLoading = true
      productLstApi(this.tableFrom).then(res => {
        this.tableData.data = res.list
        this.tableData.total = res.total
        this.listLoading = false
      }).catch(res => {
        this.listLoading = false
        this.$message.error(res.message)
      })
    },
    pageChange(page) {
      this.tableFrom.pageNo = page
      this.getList()
    },
    handleSizeChange(val) {
      this.tableFrom.pageSize = val
      this.getList()
    },
    // 删除
    handleDelete(id, type) {
      this.$modalSure(`删除 id 为 ${id} 的商品`).then(() => {
        const deleteFlag = type == 5 ? 'delete':'recycle';
        productDeleteApi(id,deleteFlag).then(() => {
          this.$message.success('删除成功')
          this.getList()
          this.goodHeade();
        })
      })
    },
    onchangeIsShow(row) {
      row.isShow
        ? putOnShellApi( row.id ).then(() => {
          this.$message.success('上架成功')
          this.getList()
          this.goodHeade();
        }) : offShellApi(row.id).then(() => {
          this.$message.success('下架成功')
          this.getList()
          this.goodHeade();
        })
    }
  }
}
</script>

<style scoped lang="scss">
  .taoBaoModal{
    z-index: 333 !important;
  }
  .demo-table-expand{
    /deep/ label{
      width: 82px;
    }
  }
  .demo-table-expand{
    /deep/ .el-form-item__content{
      width: 77%;
    }
  }
  /deep/ .el-card__header{
    font-size: 18px;
  }
  .shop_main{
    font-size: 16px;
  }
  .shop_col{
    height: 30px;
  }
  .selWidth{
    width: 350px !important;
  }
  .seachTiele{
    line-height: 30px;
  }
</style>
