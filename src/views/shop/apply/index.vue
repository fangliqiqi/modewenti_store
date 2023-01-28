<template>
  <div class="divBox">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="container">
          <el-form ref="form" inline :model="formData">
            <el-form-item label="申请用户名称：">
              <el-input v-model="formData.name" placeholder="请用户名称" class="selWidth" size="small" clearable>
                <el-button slot="append" icon="el-icon-search" @click="handleSearch" />
              </el-input>
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
          label="申请用户名称"
          min-width="100"
          prop="name"
          align='center'
        />

        <el-table-column
          label="申请用户电话"
          min-width="100"
          align='center'
          prop="phone"
        />

        <el-table-column
          label="公司名称"
          min-width="100"
          align='center'
          prop="companyName"
        />

      <el-table-column
          label="联系邮箱"
          min-width="100"
          align='center'
          prop="contactEmail"
        />
      <el-table-column
          label="申请时间"
          min-width="100"
          align='center'
          prop="applicationTime"
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

import {getShopApply} from '@/api/shop.js'

export default {
  name: 'ShippingTemplates',
  data() {
    return {
      dialogVisible: false,
      formData:{
        pageNo: 1,
        pageSize: 20,
      },
      tableData: {
        data: [],
        total: 0,
      },
      loading: false,

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
     getShopApply(this.formData).then(res=>{
        this.tableData.data = res.rows
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
