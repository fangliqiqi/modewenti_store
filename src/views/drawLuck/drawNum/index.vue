<template>
  <div class="divBox">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="container">
          <el-form ref="form" inline :model="formData">
            <el-form-item label="用户账号：">
              <el-input v-model="formData.phone" placeholder="请用户手机号" class="selWidth" size="small" clearable>
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
          prop="userId"
          label="ID"
          min-width="60"
          align='center'
        />
        <el-table-column
          label="用户账号"
          min-width="120"
          prop="user.account"
          align='center'
        />
        <el-table-column label="头像" min-width="120"  align='center'>
          <template slot-scope="scope">
            <div class="demo-image__preview">
              <el-image
                style="width: 36px; height: 36px"
                :src="scope.row.user.avatar"
                :preview-src-list="[scope.row.user.avatar]"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="剩余转盘抽奖次数"
          min-width="100"
          align='center'
          prop="frequency"
        />
        <el-table-column
          label="剩余砸金蛋次数"
          min-width="100"
          align='center'
          prop="luckDrawType"
        />
        <el-table-column
          label="剩余翻牌次数"
          min-width="100"
          align='center'
          prop="numberOfFlipDraws"
        />
        
        <el-table-column
          label="用户余额"
          min-width="100"
          align='center'
          prop="user.nowMoney"
        />

        <el-table-column
          prop="address"
          fixed="right"
          width="200"
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="bindEdit(scope.row)">增/减次数</el-button>
          </template>
        </el-table-column>
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
    <!--抽奖次数增减-->
    <el-dialog
      title="抽奖次数"
      :visible.sync="Visibleopen"
      width="500px"
      :close-on-click-modal="false"
      :before-close="handlePointClose">
      <el-form :model="dramForm" ref="dramForm" label-width="100px" class="demo-dynamic">
        <el-form-item
          label="抽奖类型"
          required
        >
        <div class="acea-row">
          <el-select v-model="dramForm.LuckDrawType" placeholder="请选择" class="selWidth">
            <el-option
              v-for="item in luckDrawTypelist"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
        </el-form-item>
        <el-form-item
          label="修改次数"
          required
        >
          <el-radio-group v-model="dramForm.type">
            <el-radio :label="0">增加</el-radio>
            <el-radio :label="1">减少</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="抽奖次数"
          required
        >
          <el-input-number type="text" v-model="dramForm.frequency" :max="999999"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handlePointClose">取 消</el-button>
        <el-button type="primary" :loading="loadingBtn" @click="submitdrawForm('dramForm')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

import {getDrawnum,getDrawdetail,updateDraw} from '@/api/drawluck.js'

export default {
  name: 'ShippingTemplates',
  data() {
    return {
      isShow: false,
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
      Visibleopen:false,
      loadingBtn: false,
      dramForm:{
        type:0,
        frequency:1,
        LuckDrawType:1
      },
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
     getDrawnum(this.formData).then(res=>{
        this.tableData.data = res.rows
        console.log(this.tableData.data)

        this.tableData.total = res.totalRows
        this.loading = false
      })
    },

    // 编辑
    bindEdit(item) {
      this.dramForm = {
        type:0,
        frequency:1,
        LuckDrawType:1
      }
      this.Visibleopen = true
      console.log(item)
      this.dramForm.userId = item.userId
    },
    // 关闭
    handlePointClose() {
      this.Visibleopen  = false
      this.dramForm = {
        type:0,
        frequency:1,
        userId:'',
        LuckDrawType:1
      }
    },
    // 提交
    submitdrawForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
         this.loadingBtn = true
          updateDraw(this.dramForm).then(res => {
            this.$message.success('设置成功')
            this.loadingBtn = false
            this.handlePointClose()
            this.getDataList()
          }).catch(() => {
            this.loadingBtn = false
          })
        } else {
          return false
        }
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
