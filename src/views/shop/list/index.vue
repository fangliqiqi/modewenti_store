<template>
  <div class="divBox">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-tabs v-model="tableFrom.type" @tab-click="seachList">
          <el-tab-pane :label="item.name +'('+item.count +')' " :name="item.type.toString()" v-for="(item,index) in headeNum" :key="index"/>
        </el-tabs>
        <div class="container">
          <el-form inline size="small">
            <el-form-item label="门店分类：">
              <el-cascader v-model="tableFrom.cateId" :options="merCateList" :props="props" clearable class="selWidth mr20" @change="seachList" size="small"/>
            </el-form-item>
            <el-form-item label="门店搜索：">
              <el-input v-model="tableFrom.branchName" placeholder="请输入门店名称" clearable class="selWidth" size="small">
                <el-button slot="append" icon="el-icon-search" @click="seachList" size="small"/>
              </el-input>
            </el-form-item>
            <el-form-item label="标签搜索：">
              <el-input v-model="tableFrom.branchLabel" placeholder="请输入门店标签" clearable class="selWidth" size="small">
                <el-button slot="append" icon="el-icon-search" @click="seachList" size="small"/>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <router-link :to=" { path:'/shop/creatShop' } ">
          <el-button size="small" type="primary" class="mr10">添加门店</el-button>
        </router-link>
<!--        <el-button size="small" type="success" class="mr10" @click="onCopy">复制淘宝、天猫、拼多多、京东、苏宁</el-button>-->
        <!-- <el-button size="small" @click="exports">导出</el-button> -->
      </div>
      <el-table
        v-loading="listLoading"
        :data="tableData.data"
        style="width: 100%"
        size="mini"
        highlight-current-row
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="分类：">
                <span v-for="(item, index) in props.row.cateValues.split(',')" :key="index" class="mr10">{{ item }}</span>
              </el-form-item>
              <el-form-item label="市场价：">
                <span>{{ props.row.otPrice }}</span>
              </el-form-item>
              <el-form-item label="成本价：">
                <span>{{ props.row.cost }}</span>
              </el-form-item>
              <el-form-item label="收藏：">
                <span>{{ props.row.collectCount }}</span>
              </el-form-item>
              <el-form-item label="虚拟销量：">
                <span>{{ props.row.ficti }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="ID"
          min-width="50"
          align="center"
        />
       <!-- <el-table-column label="门店图" min-width="80">
         <template slot-scope="scope">
           <div class="demo-image__preview">
             <el-image
               style="width: 36px; height: 36px"
               :src="scope.row.branchPhotoParamList[0].photoUrl"
               :preview-src-list="[scope.row.image]"
             />
           </div>
         </template>
       </el-table-column> -->
        <el-table-column
          prop="branchName"
          label="门店名称"
          min-width="150"
          align="center"
        />
				<el-table-column
				  prop="branchLabel"
				  label="门店标签"
				  min-width="150"
          align="center"
				/>
        <el-table-column
          prop="account"
          label="提现银行卡"
          min-width="200"
          align="center"
        />
        <el-table-column
          prop="earnestMoney"
          label="保证金"
          min-width="100"
          align="center"
        />
        <el-table-column
          prop="entUserUpdateFo.name"
          label="负责人名字"
          min-width="100"
          align="center"
        />
        <el-table-column
          prop="entUserUpdateFo.mobilePhone"
          label="负责人电话"
          min-width="100"
          align="center"
        />
        <el-table-column
          label="状态"
          min-width="160"

        >
          <template slot-scope="scope" align="center">
            <el-switch
              :disabled="tableFrom.type === '5'"
              v-model="scope.row.branchStatus"
              :active-value="1"
              active-text="开店"
              inactive-text="休业"
              @change="onchangeIsShow(scope.row)"
            />
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="endTime"
          label="到期时间"
          min-width="120"
          align="center"
        /> -->
        <el-table-column
          prop="description"
          label="门店简介"
          min-width="200"
          align="center"
        />
        <el-table-column
          prop="province"
          label="省市区"
          min-width="200"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{scope.row.province}}/</span>
            <span>{{scope.row.city}}/</span>
            <span>{{scope.row.district}}</span>
          </template>
       </el-table-column>

        <el-table-column
          prop="attr"
          label="详细地址"
          min-width="200"
          align="center"
        />
        <el-table-column
          label="操作时间"
          min-width="150"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="160" fixed="right" align="center">
          <template slot-scope="scope">
            <router-link :to="{path: '/shop/creatShop/' + scope.row.id}">
              <el-button type="text" size="small" class="mr10">编辑</el-button>
            </router-link>
            <el-button  v-if="tableFrom.type === '5'" type="text" size="small" @click="handleRestore(scope.row.id, scope.$index)">恢复门店</el-button>
            <el-button type="text" size="small" @click="handleDelete(scope.row, scope.$index)">{{ tableFrom.type === '5' ? '删除' : '加入回收站' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          :page-sizes="[20, 40, 60, 80]"
          :page-size="tableFrom.pageSize"
          :current-page="tableFrom.pageNo"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
          @size-change="handleSizeChange"
          @current-change="pageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { shopListPageApi, delShopApi, categoryApi,activeShopApi, freezeShopApi, productHeadersApi, productExportApi, restoreApi } from '@/api/shop'
import { getToken } from '@/utils/auth'
export default {
  name: 'ProductList',
  components: {  },
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
      dialogVisible: false
    }
  },
  mounted() {
    // this.goodHeade()
    this.getList()
    // this.getCategorySelect()
  },
  methods: {
    handleRestore(id) {
      this.$modalSure("恢复门店").then(() => {
        restoreApi(id)
          .then((res) => {
            this.$message.success('操作成功');
            // this.goodHeade();
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
    // 获取门店表单头数量
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
      shopListPageApi(this.tableFrom).then(res => {
        this.tableData.data = res.rows
        this.tableData.data.map(items=>{
          if(items.branchStatus==1){
            items.isShow = true
          }else{
            items.isShow = false
          }
        })
        this.tableData.total = res.totalRows
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
    handleDelete(row, type) {

      this.$modalSure(`删除 id 为 ${row.id} 的门店`).then(() => {
        // const deleteFlag = type == 5 ? 'delete':'recycle';
        delShopApi(row).then(() => {
          this.$message.success('删除成功')
          this.getList()
          // this.goodHeade();
        })
      })
    },
    onchangeIsShow(row) {
      console.log(row);
      row.branchStatus==1
        ? activeShopApi( {id:row.id} ).then(() => {
          this.$message.success('上架成功')
          this.getList()
        }) : freezeShopApi({id:row.id}).then(() => {
          this.$message.success('下架成功')
          this.getList()
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
  .selWidth{
    width: 350px !important;
  }
  .seachTiele{
    line-height: 30px;
  }
</style>
