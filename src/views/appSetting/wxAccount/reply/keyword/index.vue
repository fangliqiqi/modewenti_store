<template>
  <div class="divBox">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="container">
          <el-form size="small" :inline="true">
            <el-form-item label="回复类型：">
              <el-select v-model="tableFrom.type" placeholder="请选择类型" @change="seachList" class="selWidth">
                <el-option label="文本消息" value="text"></el-option>
                <el-option label="图片消息" value="image"></el-option>
                <el-option label="图文消息" value="news"></el-option>
                <el-option label="音频消息" value="voice"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键字：">
              <el-input v-model="tableFrom.keywords" placeholder="请输入关键字" class="selWidth" size="small">
                <el-button slot="append" icon="el-icon-search" size="small" @click="seachList" />
              </el-input>
            </el-form-item>
          </el-form>
          <router-link :to="{path: '/appSetting/publicAccount/wxReply/keyword/save'}">
            <el-button size="small" type="primary">添加关键字</el-button>
          </router-link>
        </div>
      </div>
      <el-table
        v-loading="listLoading"
        :data="tableData.data"
        style="width: 100%"
        size="small"
        highlight-current-row
      >
        <el-table-column
          prop="id"
          label="ID"
          width="60"
        />
        <el-table-column
          prop="keywords"
          label="关键字"
          min-width="150"
        />
        <el-table-column
          label="回复类型"
          min-width="100"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.type | keywordStatusFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="是否显示"
          min-width="100"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="true"
              :inactive-value="false"
              @change="onchangeIsShow(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <router-link :to="{path: '/appSetting/publicAccount/wxReply/keyword/save/' + scope.row.id}">
              <el-button type="text" size="small">编辑</el-button>
            </router-link>
            <el-button type="text" size="small" @click="handleDelete(scope.row.id, scope.$index)">删除</el-button>
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
import { replyListApi, replyDeleteApi, replyUpdateApi } from '@/api/wxApi'
import { getToken } from '@/utils/auth'
export default {
  name: 'WechatKeyword',
  data() {
    return {
      tableData: {
        data: [],
        total: 0
      },
      tableFrom: {
        pageNo: 1,
        pageSize: 20,
        keywords: '',
        type: ''
      },
      listLoading: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    seachList() {
      this.tableFrom.pageNo = 1
      this.getList()
    },
    onchangeIsShow(row) {
      replyUpdateApi(row.id, row).then(() => {
        this.$message.success('修改成功')
      })
    },
    // 列表
    getList() {
      this.listLoading = true
      replyListApi(this.tableFrom).then(res => {
        this.tableData.data = res.list
        this.tableData.total = res.total
        this.listLoading = false
      }).catch(res => {
        this.listLoading = false
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
    handleDelete(id, idx) {
      this.$modalSure().then(() => {
        replyDeleteApi(id).then(() => {
          this.$message.success('删除成功')
          this.getList()
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
