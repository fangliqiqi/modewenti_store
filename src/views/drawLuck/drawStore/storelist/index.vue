<template>
  <div class="divBox">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="container">
          <el-form inline>
            <el-form-item label="商品搜索：">
              <el-input v-model="tableFrom.keywords" placeholder="请输入商品ID/名称" class="selWidth" clearable>
                <el-button slot="append" icon="el-icon-search" @click="getList(1)"/>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <router-link :to=" { path:'/drawLuck/drawstore/addStore/creat' }">
          <el-button size="small" type="primary" class="mr10">添加抽奖商品</el-button>
        </router-link>
      </div>

      <el-table
        v-loading="listLoading"
        :data="tableData.data"
        style="width: 100%"
        size="mini"
        ref="multipleTable"
      >
      <el-table-column
        prop="id"
        label="抽奖id"
        align="center"
        min-width="50"
      />
			<el-table-column
			  prop="luckDrawTypename"
			  label="抽奖类型"
			  align="center"
			  min-width="150"
			/>
      <el-table-column
        prop="name"
        label="商品名称"
        align="center"
        min-width="150"
      />
       <el-table-column
          prop="bindingId"
          label="商品id"
          align="center"
          min-width="100"
        />
        <el-table-column label="商品图片" min-width="100" align="center">
          <template slot-scope="scope">
            <div class="demo-image__preview">
              <el-image
               v-if='scope.row.prizePicture'
                style="width: 36px; height: 36px"
                :src="scope.row.prizePicture"
                :preview-src-list="[scope.row.prizePicture]"
              />
              <div v-else>无图片</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="number"
          label="商品数量"
          align="center"
          min-width="120"
        />
        <el-table-column
          prop="price"
          label="商品价值(元)"
          align="center"
          min-width="120"
        />
        <el-table-column
          prop="typeName"
          label="商品类型"
          align="center"
          min-width="120"
        />
        <el-table-column
          prop="winningRate"
          label="中奖率"
          align="center"
          min-width="120"
        />

        <el-table-column
          label="创建时间"
          align="center"
          prop="creationTime"
          min-width="150"
        />
        <el-table-column label="操作" min-width="150" fixed="right" align="center">
          <template slot-scope="scope">
            <router-link :to="{ path:'/drawLuck/drawstore/addStore/updeta' +'/' + scope.row.id}">
              <el-button type="text" size="small">编辑</el-button>
            </router-link>
            <el-button  type="text" size="small" @click="handleDelete(scope.row.id)"  class="mr10">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block mb20">
        <el-pagination
          :page-sizes="[10, 20, 30, 40]"
          :page-size="tableFrom.limit"
          :current-page="tableFrom.page"
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


  import {drawStorelist, drawStoredetail ,drawStoreadd ,drawStoredelete,drawStoreupdate } from '@/api/drawluck'

  export default {
    data() {
      return {
        listLoading: true,
        tableData: {
          data: [],
          total: 0
        },
        tableFrom: {
          page: 1,
          limit: 20,
          timeId: '',
          status: '',
          keywords: ''
        },
        seckillTime: []
      }
    },

    mounted() {

      this.tableFrom.timeId = Number(this.$route.params.timeId) || ''
      this.getList()
    },
    methods: {

      // 列表
      getList(num) {
        this.listLoading = true
        this.tableFrom.page = num ? num : this.tableFrom.page;
        drawStorelist(this.tableFrom).then(res => {
          this.tableData.data = res.rows
          this.tableData.data.map(items=>{
            if(items.type==1){
              items.typeName = '优惠券'
            }else if(items.type==2){
              items.typeName = '商品卷'
            }else if(items.type==3){
              items.typeName = '实物'
            }else if(items.type==4){
              items.typeName = '谢谢惠顾'
            }
            if(items.luckDrawType ==1){
              items.luckDrawTypename = '幸运大转盘'
            }else if(items.luckDrawType ==2){
              items.luckDrawTypename = '砸金蛋'
            }else if(items.luckDrawType ==3){
              items.luckDrawTypename = '翻牌抽奖'
            }

          })
          this.tableData.total = res.totalRows
          this.listLoading = false
        }).catch((res) => {
          this.listLoading = false
        })
      },

      pageChange(page) {
        this.tableFrom.page = page
        this.getList()
      },
      handleSizeChange(val) {
        this.tableFrom.limit = val
        this.getList()
      },

      // 删除
      handleDelete(id, idx) {

        this.$modalSure().then(() => {
          drawStoredelete({id:id}).then(() => {
            this.$message.success('删除成功')
            this.getList()
          })
        })
      },
    }
  }
</script>

<style scoped>

</style>
