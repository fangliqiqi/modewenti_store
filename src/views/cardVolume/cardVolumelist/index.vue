<template>
  <div class="divBox">
     <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
            <el-form-item label="活动开始时间" prop="actStartTime">
              <el-date-picker clearable size="small" style="width: 200px"
                v-model="queryParams.actStartTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择活动开始时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="活动结束时间" prop="actEndTime">
              <el-date-picker clearable size="small" style="width: 200px"
                v-model="queryParams.actEndTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择活动结束时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="是否上下架" prop="standUp">
              <el-select v-model="queryParams.standUp" placeholder="请选择是否上下架" clearable size="small">
                <el-option
                  v-for="dict in standUpOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
            </el-form-item>
          </el-form>
          <el-row :gutter="10" class="mb8" style="margin-bottom: 10px;">
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
                v-hasPermi="['share:activity:add']"
              >新增</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="success"
                icon="el-icon-edit"
                size="mini"
                :disabled="single"
                @click="handleUpdate"
                v-hasPermi="['share:activity:edit']"
              >修改</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
                v-hasPermi="['share:activity:remove']"
              >删除</el-button>
            </el-col>
            <!-- <el-col :span="1.5">
              <el-button
                type="warning"
                icon="el-icon-download"
                size="mini"
                @click="handleExport"
                v-hasPermi="['share:activity:export']"
              >导出</el-button>
            </el-col> -->
            <!-- <div class="top-right-btn">
              <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                <el-button size="mini" circle icon="el-icon-refresh" @click="handleQuery" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
                <el-button size="mini" circle icon="el-icon-search" @click="showSearch=!showSearch" />
              </el-tooltip>
            </div> -->
          </el-row>

        </div>



        <el-table v-loading="loading" :data="activityList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="主键id" align="center" prop="id" />
          <el-table-column label="活动名称标题" align="center" prop="title" width="120"/>
          <el-table-column label="活动内容" align="center" prop="content" width="200"/>
          <el-table-column label="活动价格(元)" align="center" prop="activityPrice" />
          <el-table-column label="市场价(元)" align="center" prop="marketPrice" />
           <el-table-column label="价格单位" align="center" prop="activityPriceUnit" />
          <el-table-column label="活动开始时间" align="center" prop="actStartTime"  width="120">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.actStartTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="活动结束时间" align="center" prop="actEndTime" width="120">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.actEndTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否上下架" align="center" prop="standUp"  />
          <el-table-column label="活动对接业务员手机号码" align="center" prop="salesmanPhone" width="120"/>
          <el-table-column label="活动范围" align="center" prop="activityScope" />
          <el-table-column label="活动类型" align="center" prop="type" :formatter="typeFormat" />
          <el-table-column label="名词标题" align="center" prop="nextTitle" width="120"/>
          <el-table-column label="名词解释" align="center" prop="remark" width="200"/>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="200">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['share:activity:edit']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['share:activity:remove']"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
     </el-card>


    <!-- 添加或修改活动推广对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动名称标题" prop="title">
              <el-input v-model="form.title"  placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否上下架" prop="standUp">
              <el-radio-group v-model="form.standUp">
                <el-radio
                  v-for="dict in standUpOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动价格" prop="activityPrice">
              <el-input v-model="form.activityPrice" placeholder="请输入活动价格" type="number"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动单位" prop="activityPriceUnit">
              <el-input v-model="form.activityPriceUnit" placeholder="活动价格单位"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="市场价" prop="marketPrice">
              <el-input v-model="form.marketPrice" placeholder="请输入市场价"  type="number"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="市场价单位" prop="marketPriceUnit">
              <el-input v-model="form.marketPriceUnit" placeholder="市场价单位"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动开始时间" prop="actStartTime">
              <el-date-picker clearable style="width: 100%;"
                v-model="form.actStartTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择活动开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动结束时间" prop="actEndTime">
              <el-date-picker clearable style="width: 100%;"
                v-model="form.actEndTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择活动结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="对接手机号码" prop="salesmanPhone">
              <el-input v-model="form.salesmanPhone" placeholder="请输入活动对接业务员手机号码" type="number"/>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="活动类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择活动类型" style="width: 100%;" @change="changeType">
                <el-option
                  v-for="dict in typeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动范围" prop="activityScope">
              <el-input v-model="form.activityScope"  placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="卡券背景" v-if="cardbg" prop="photoFlag1">
              <el-select v-model="form.photoFlag" placeholder="请选择卡券背景" style="width: 100%;" :disabled="true">
                <el-option
                  v-for="dict in cardbgList"
                  :key="dict.id"
                  :label="dict.remark"
                  :value="dict.photoFlag"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="卡券背景" prop="photoFlag" v-if="!cardbg">
              <el-select v-model="form.photoFlag" placeholder="请选择卡券背景" style="width: 100%;" @change="changeBg" >
                <el-option
                  v-for="dict in cardbgList"
                  :key="dict.id"
                  :label="dict.remark"
                  :value="dict.photoFlag"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="活动内容" prop="content">
              <el-input v-model="form.content" placeholder="请输入活动内容" type="textarea" resize="none" rows="3"
                        show-word-limit/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <!-- <el-col :span="12">
            <el-form-item label="免费内容" prop="freeContent">
              <el-input v-model="form.freeContent" placeholder="请输入名词标题" />
            </el-form-item>
          </el-col> -->
         <el-col :span="24">
            <el-form-item label="名词标题" prop="nextTitle">
              <el-input v-model="form.nextTitle" placeholder="请输入名词标题" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="名词解释" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入名词解释"
                        type="textarea" resize="none"    show-word-limit/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listActivity, getActivity, delActivity, addActivity, updateActivity, exportActivity,getCardbg } from "@/api/card.js";

export default {
  name: "Activity",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 活动推广表格数据
      activityList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否上下架字典
      standUpOptions: [
        {dictValue:10,dictLabel:'上架'},
        {dictValue:20,dictLabel:'下架'}
      ],
      // 活动类型字典
      typeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize:10,
        actStartTime: null,
        actEndTime: null,
        standUp: null,
        salesmanPhone: null,
        type: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "活动名称标题不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "活动内容不能为空", trigger: "blur" }
        ],
        activityPrice: [
          { required: true, message: "活动价格不能为空", trigger: "blur" }
        ],
        marketPrice: [
          { required: true, message: "市场价不能为空", trigger: "blur" }
        ],
        actStartTime:[
           { required: true, message: "活动开始时间不能为空", trigger: "blur" }
        ],
        actEndTime:[
           { required: true, message: "活动结束时间不能为空", trigger: "blur" }
        ],
        salesmanPhone:[
           { required: true, message: "对接手机号码不能为空", trigger: "blur" }
        ],
        type:[
           { required: true, message: "活动类型不能为空", trigger: "blur" }
        ],
        standUp: [
          { required: true, message: "是否上下架）不能为空", trigger: "blur" }
        ],
        photoFlag:[
          { required:true, message: "背景图不能为空", trigger: "blur" }
        ],
        nextTitle:[
          { required:true, message: "名词标题不能为空", trigger: "blur" }
        ],
        remark:[
          { required:true, message: "名词解释不能为空", trigger: "blur" }
        ],
      },
      cardbg:true,
      cardbgList:[]
    };
  },
  created() {
    this.getList();
    this.getCardbg()
    // this.getDicts("foupr_activity_stand_up").then(response => {
    //   this.standUpOptions = response.data;
    // });
    // this.getDicts("foupr_activity_type").then(response => {
    //   this.typeOptions = response.data;
    // });
  },
  methods: {
    /** 查询活动推广列表 */
    getList() {
      this.loading = true;
      listActivity(this.queryParams).then(response => {
        this.activityList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 是否上下架字典翻译
    // standUpFormat(row, column) {
    //   return this.selectDictLabel(this.standUpOptions, row.standUp);
    // },
    // 活动类型字典翻译
    // typeFormat(row, column) {
    //   return this.selectDictLabel(this.typeOptions, row.type);
    // },
    // 卡券背景图
    getCardbg(){
      getCardbg().then(res=>{
        console.log(res)
        if(res.code==200){
          this.cardbgList = res.data;
        }
      })
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        title: null,
        content: null,
        activityPrice: null,
        marketPrice: null,
        actStartTime: null,
        actEndTime: null,
        standUp: "10",
        salesmanPhone: null,
        type: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        activityScope: null,
        photoFlag:null
      };
      // this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      // this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加活动推广";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getActivity({id:id}).then(response =>{
        this.form = response.data;
        if(this.form.type==60){
          this.cardbg = false;
        }else{
          this.cardbg = true;
        }
        this.open = true;
        this.title = "修改活动推广";
      });
    },
    // 类型选择
    changeType(e){
      if(e==60){
        this.cardbg = false;
      }else{
        this.cardbg = true;
      }
    },
    // 卡的背景选择
    changeBg(e){
      this.form.url = this.cardbgList.filter(item=>item.photoFlag== e)[0].url
    },
    /** 提交按钮 */
    submitForm() {
      console.log(this.form)
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateActivity(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addActivity(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除活动推广编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delActivity(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有活动推广数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportActivity(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
