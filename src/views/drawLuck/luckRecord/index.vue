<template>
  <div class="divBox">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="container">
          <el-form ref="form" inline :model="formData">
            <el-form-item label="用户名称：">
              <el-input v-model="formData.userName" placeholder="请用户名称" class="selWidth" size="small" clearable>
                <!-- <el-button slot="append" icon="el-icon-search" @click="handleSearch" /> -->
              </el-input>
            </el-form-item>
            <el-form-item label="抽奖类型:">
              <el-select v-model="formData.type" placeholder="请选择抽奖类型" class="selWidth" size="small" clearable>
                <el-option
                  v-for="item in luckDrawTypelist"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-button   type="info" plain size="small" icon="el-icon-search" @click="handleSearch" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData.data"
        style="width: 100%"
        size="mini"
      >
        <el-table-column
          prop="id"
          label="ID"
          min-width="60"
          align='center'
        />
        <el-table-column
          label="用户名称"
          min-width="100"
          prop="userName"
          align='center'
        />

        <el-table-column
          label="用户id"
          min-width="100"
          align='center'
          prop="userId"
        />
        <el-table-column
          label="抽奖类型"
          min-width="100"
          align='center'
          prop="typeName"
        />
        <el-table-column
          label="奖品名称"
          min-width="100"
          align='center'
          prop="luckDrawName"
        />

      <el-table-column
          label="奖品id"
          min-width="100"
          align='center'
          prop="luckDrawId"
        />
      <el-table-column
          label="中奖时间"
          min-width="100"
          align='center'
          prop="winningTime"
        />
      </el-table>
      <div class="block-pagination">
        <el-pagination
          :page-sizes="[20, 40, 60, 80]"
          :page-size="formData.pageSize"
          :current-page="formData.pageNo"
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

import {luckRecord} from '@/api/drawluck.js'

export default {
  name: 'ShippingTemplates',
  data() {
    return {
      dialogVisible: false,
      formData:{
        pageNo: 1,
        pageSize: 20,
        type:null,
      },
      tableData: {
        data: [],
        total: 0,
      },
      loading: false,
      luckDrawTypelist:[
       {id:1,name:'幸运大转盘'},
       {id:2,name:'百分百砸金蛋'},
       {id:3,name:'翻牌抽奖'},
      ],

    }
  },
  created() {
    this.getDataList()
  },
  methods: {

    handleSearch() {
      this.formData.pageNo = 1
      this.getDataList()
    },
    // 分页
    pageChange(e) {
      this.formData.pageNo = e
      this.getDataList()
    },

    handleSizeChange(e) {
      this.formData.pageSize = e
      this.getDataList()
    },
    // 数据列表
    getDataList() {
     this.loading = true
     luckRecord(this.formData).then(res=>{
        this.tableData.data = res.rows
        this.tableData.data.map(item=>{
          if(item.type==1){
            item.typeName = '大转盘'
          }else if(item.type==2){
            item.typeName = '砸金蛋'
          }else if(item.type==3){
            item.typeName = '翻牌抽奖'
          }
        })
        this.tableData.total = res.totalRows
        this.loading = false
      })
    },

  }
}
</script>

<style scoped lang="scss">
.selWidth{
  width: 350px;
}
</style>
