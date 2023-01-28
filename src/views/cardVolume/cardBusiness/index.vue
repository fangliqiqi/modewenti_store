<template>
  <div class="divBox">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="110px">
          <el-form-item label="套餐类型" prop="cardId" >
            <el-select v-model="queryParams.cardId" placeholder="请选择套餐类型" style="width:100%">
              <el-option
                v-for="dict in cardList"
                :key="dict.id"
                :label="dict.title"
                :value="dict.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['share:cardBusiness:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['share:cardBusiness:edit']"
            >修改</el-button>
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['share:cardBusiness:remove']"
            >删除</el-button>
          </el-col> -->
          <!-- <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['share:cardBusiness:export']"
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
      
      <el-table v-loading="loading" :data="cardBusinessList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键ID" align="center" prop="id" />
        <el-table-column label="套餐类型" align="center" prop="cardName" />
        <el-table-column label="权益名称" align="center" prop="businessName" />
        <el-table-column label="权益价格" align="center" prop="oldPrice" />
        <el-table-column label="权益类型" align="center" prop="businessType" :formatter="businessTypeFormat"/>
        <el-table-column label="计量单位类型" align="center" prop="businessUnit" :formatter="businessUnitFormat"/>
        <!-- <el-table-column label="天数" align="center" prop="dayNumber" /> -->
        <el-table-column label="时长(月)" align="center" prop="monthNumber" />
        <el-table-column label="可用次数(次)" align="center" prop="timesNumber" />
        <!-- <el-table-column label="生效时间类型" align="center" prop="timeType" />
        <el-table-column label="延迟生效天数" align="center" prop="delayDays" /> -->
        <!-- <el-table-column label="起始时间" align="center" prop="startTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="center" prop="endTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="权益规则" align="center" prop="businessCouponEquities" width="180"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['share:cardBusiness:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['share:cardBusiness:remove']"
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
    <!-- 添加或修改卡券业务项对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="套餐类型" prop="cardId" >
              <el-select v-model="form.cardId" placeholder="请选择套餐类型" style="width:100%">
                <el-option
                  v-for="dict in cardList"
                  :key="dict.id"
                  :label="dict.title"
                  :value="dict.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权益名称" prop="businessName">
              <el-input v-model="form.businessName" placeholder="请输入权益名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="权益价格" prop="oldPrice">
              <el-input v-model="form.oldPrice" placeholder="请输入权益价格" type="number"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权益类型" prop="businessType" >
              <el-select v-model="form.businessType" placeholder="请选择权益类型" style="width:100%">
                <el-option
                  v-for="dict in businessTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单位类型" prop="businessUnit">
              <el-select v-model="form.businessUnit" placeholder="计量单位类型" style="width:100%" @change="changeBusinessUnit">
                <el-option
                  v-for="dict in businessUnitOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="月数" prop="monthNumber">
              <el-input v-model="form.monthNumber" type="number"   placeholder="请输入月数" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
           <el-form-item label="次数" prop="timesNumber">
             <el-input v-model="form.timesNumber"  type="number"  placeholder="请输入次数" :disabled="disabled"/>
           </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权益规则" prop="businessCouponEquities">
              <el-input type="textarea":rows="2"  maxlength="30" show-word-limit   v-model="form.businessCouponEquities" placeholder="请输入备注" clearable resize="none"/>
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
import { listCardBusiness,
					getCardBusiness,
					delCardBusiness,
					addCardBusiness,
					updateCardBusiness,
					exportCardBusiness,
          getCardList
          } from "@/api/card.js";

export default {
  name: "CardBusiness",
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
      // 卡券业务项表格数据
      cardBusinessList: [],
      //计量单位类型:1月,2次
      businessUnitOptions:[],
      // 权益类型 代金券 非代金券
      businessTypeOptions:[],
      // 套餐类型
      cardList:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize:10,
        businessName: null,
        oldPrice: null,
        businessUnit: null,
        dayNumber: null,
        monthNumber: null,
        timesNumber: null,
        timeType: null,
        delayDays: null,
        startTime: null,
        endTime: null,
      },
      disabled:false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        cardId: [
          { required: true, message: "套餐类型不能为空", trigger: "blur" }
        ],
        businessName: [
          { required: true, message: "权益名称不能为空", trigger: "blur" }
        ],
        monthNumber: [
          { required: true, message: "月数不能为空", trigger: "blur" }
        ],
        timesNumber: [
          { required: true, message: "次数不能为空", trigger: "blur" }
        ],
        businessUnit: [
          { required: true, message: "计量单位类型不能为空", trigger: "blur" }
        ],
        businessType: [
          { required: true, message: "权益类型不能为空", trigger: "blur" }
        ],
        businessCouponEquities: [
          { required: true, message:"权益规则不能为空", trigger: "blur" }
        ],
        oldPrice:[
          { required: true, message:"权益价格不能为空", trigger: "blur" }
        ]
      },

    };
  },
  created() {
    this.getList();
    this.getCardList()
    // 字典
    this.getDicts("card_bus_unit").then(response => {
      this.businessUnitOptions = response.data;
    });

    this.getDicts("card_bus_type").then(response => {
      this.businessTypeOptions = response.data;
    });
  },
  methods: {
    /** 查询卡券业务项列表 */
    getList(){
      this.loading = true;
      listCardBusiness(this.queryParams).then(response => {
        this.cardBusinessList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 字典翻译
    businessUnitFormat(row, column) {
      return this.selectDictLabel(this.businessUnitOptions, row.businessUnit);
    },
    businessTypeFormat(row, column) {
      return this.selectDictLabel(this.businessTypeOptions, row.businessType);
    },

    /**获取套餐类型**/
    getCardList(){
      getCardList().then(res=>{
        console.log(res)
        this.cardList = res.data;
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
        cardId:null,
        businessName: null,
        oldPrice: null,
        businessUnit: null,
        dayNumber: null,
        monthNumber: null,
        timesNumber: null,
        timeType: null,
        delayDays: null,
        startTime: null,
        endTime: null,
        businessType:null,
        businessCouponEquities: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    // 选择计量单位
    changeBusinessUnit(){
      if(this.form.businessUnit==1){
        this.form.timesNumber=1
        this.disabled=true
      }else{
        this.form.timesNumber=null
        this.disabled=false
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加卡券业务项";
    },
    /** 修改按钮操作 */
    handleUpdate(row){
      console.log(row)
      this.reset();
      const id = row.id || this.ids
      getCardBusiness({id:id}).then(response => {
        this.form = response.data;
        if(this.form.businessUnit==1){
          this.form.timesNumber=1
          this.disabled=true
        }else{
          this.disabled=false
        }
        this.form.businessUnit = response.data.businessUnit.toString()
        this.form.businessType = response.data.businessUnit.toString()
        this.open = true;
        this.title = "修改卡券业务项";
      });
    },
    /** 提交按钮 */
    submitForm() {
      console.log(this.form)
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCardBusiness(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addCardBusiness(this.form).then(response => {
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
      this.$confirm('是否确认删除卡券业务项编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCardBusiness(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有卡券业务项数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCardBusiness(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
