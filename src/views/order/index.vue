<template>
  <div class="divBox">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!--<el-tabs v-model="tableFrom.type" @tab-click="getList">-->
        <!--<el-tab-pane label="全部订单" name="" />-->
        <!--<el-tab-pane label="普通订单" name="1" />-->
        <!--<el-tab-pane label="拼团订单" name="2" />-->
        <!--<el-tab-pane label="秒杀订单" name="3" />-->
        <!--<el-tab-pane label="砍价订单" name="4" />-->
        <!--</el-tabs>-->
        <div class="container">
          <el-form size="small" label-width="100px">
            <el-form-item label="订单状态：">
              <el-radio-group v-model="tableFrom.status" type="button" @change="seachList">
                <el-radio-button label="all">全部 {{ '(' +orderChartType.all?orderChartType.all:0 + ')' }}</el-radio-button>
                <el-radio-button label="unPaid">未支付 {{ '(' +orderChartType.unPaid?orderChartType.unPaid:0+ ')' }}</el-radio-button>
                <el-radio-button label="notShipped">未发货 {{ '(' +orderChartType.notShipped?orderChartType.notShipped:0+ ')' }}</el-radio-button>
                <el-radio-button label="spike">待收货 {{ '(' +orderChartType.spike?orderChartType.spike:0+ ')' }}</el-radio-button>
                <el-radio-button label="bargain">待评价 {{ '(' +orderChartType.bargain?orderChartType.bargain:0+ ')' }}</el-radio-button>
                <el-radio-button label="complete">交易完成 {{ '(' +orderChartType.complete?orderChartType.complete:0+ ')' }}</el-radio-button>
<!--                <el-radio-button label="toBeWrittenOff">待核销 {{ '(' +orderChartType.toBeWrittenOff?orderChartType.toBeWrittenOff:0+ ')' }}</el-radio-button>-->
                <el-radio-button label="refunding">退款中 {{ '(' +orderChartType.refunding?orderChartType.refunding:0+ ')' }}</el-radio-button>
                <el-radio-button label="refunded">已退款 {{ '(' +orderChartType.refunded?orderChartType.refunded:0+ ')' }}</el-radio-button>
                <el-radio-button label="deleted">已删除 {{ '(' +orderChartType.deleted?orderChartType.deleted:0+ ')' }}</el-radio-button>
                <el-radio-button label="cardorder">卡券</el-radio-button>
                <el-radio-button label="applying">退货申请 {{ '(' +orderChartType.applying?orderChartType.applying:0+ ')' }}</el-radio-button>
                <el-radio-button label="pendingReturn">待退货 {{ '(' +orderChartType.pendingReturn?orderChartType.pendingReturn:0+ ')' }}</el-radio-button>
                <el-radio-button label="underReview">退货审核 {{ '(' +orderChartType.underReview?orderChartType.underReview:0+ ')' }}</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="时间选择：" class="width100">
              <el-radio-group v-model="tableFrom.dateLimit" type="button" class="mr20" size="small" @change="selectChange(tableFrom.dateLimit)">
                <el-radio-button v-for="(item,i) in fromList.fromTxt" :key="i" :label="item.val">{{ item.text }}</el-radio-button>
              </el-radio-group>
              <el-date-picker v-model="timeVal" value-format="yyyy-MM-dd" format="yyyy-MM-dd" size="small" type="daterange" placement="bottom-end" placeholder="自定义时间" style="width: 220px;" @change="onchangeTime" />
            </el-form-item>
            <el-form-item label="订单号：" class="width100">
              <el-input v-model="tableFrom.orderId" placeholder="请输入订单号" class="selWidth" size="small">
                <el-button slot="append" icon="el-icon-search" size="small" @click="seachList" />
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <cards-data :cardLists="cardLists"></cards-data>
      </div>
      <el-table
        v-loading="listLoading"
        :data="tableData.data"
        style="width: 100%"
        size="mini"
        class="table"
        highlight-current-row
        @selection-change="handleSelectionChange"
        :hidden="tableFrom.status=='cardorder'"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="商品总价：">
                <span>{{ props.row.totalPrice }}</span>
              </el-form-item>
              <el-form-item label="推广人：">
                <span>{{ props.row.spreadInfo.id + ' / ' + props.row.spreadInfo.name }}</span>
              </el-form-item>
              <el-form-item label="用户备注：">
                <span>{{ props.row.mark }}</span>
              </el-form-item>
              <el-form-item label="商家备注：">
                <span>{{ props.row.remark }}</span>
              </el-form-item>
              <el-form-item label="核销码：" v-if="props.row.shippingType === 2">
                <span>{{ props.row.verifyCode }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          label="订单号"
          min-width="170"
        >
          <template slot-scope="scope">
            <span style="display: block;" v-text="scope.row.orderId" />
            <span v-show="scope.row.isDel" style="color: #ED4014;display: block;">用户已删除</span>
          </template>
        </el-table-column>
        <!--<el-table-column-->
        <!--prop="id"-->
        <!--label="订单类型"-->
        <!--min-width="150"-->
        <!--/>-->
        <el-table-column
          prop="realName"
          label="用户信息"
          min-width="130"
        />
        <el-table-column
          label="商品信息"
          min-width="400"
        >
          <template slot-scope="scope">
            <div v-if=" scope.row.productList && scope.row.productList.length">
              <div v-for="(val, i ) in scope.row.productList" :key="i" class="tabBox acea-row row-middle">
                <div class="demo-image__preview">
                  <el-image
                    :src="val.info.productInfo.image"
                    :preview-src-list="[val.info.productInfo.image]"
                  />
                </div>
                <span class="tabBox_tit mr10">{{ val.info.productInfo.storeName + ' | ' }}{{ val.info.productInfo.attrInfo.suk ? val.info.productInfo.attrInfo.suk:'-' }}</span>
                <span class="tabBox_pice">{{ '￥'+ val.info.productInfo.attrInfo.price ? val.info.productInfo.attrInfo.price + ' x '+ val.info.cartNum : '-' }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="payPrice"
          label="实际支付"
          min-width="80"
        />
        <el-table-column
          label="支付方式"
          min-width="80"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.payTypeStr }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="订单状态"
          min-width="150"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.statusStr&&scope.row.statusStr.key === 'refunding'" class="refunding">
              <b style="color: #f124c7;">申请退款</b>
              <span>退款原因：{{scope.row.refundReasonWap}}</span>
              <span>备注说明：{{scope.row.refundReasonWapExplain}}</span>
              <span>退款时间：{{scope.row.refundReasonTime}}</span>
              <span class="acea-row">
                退款凭证：
                <template v-if="scope.row.refundReasonWapImg">
                  <div v-for="(item, index) in scope.row.refundReasonWapImg.split(',')" :key="index" class="demo-image__preview" style="width: 35px;height: auto;display: inline-block;">
                  <el-image
                    :src="item"
                    :preview-src-list="[item]"
                  />
                </div>
                </template>
                <!--<img :src="scope.row.refundReasonWapImg" v-if="scope.row.refundReasonWapImg" >-->
                <span v-else style="display: inline-block">无</span>
              </span>
            </div>
            <span v-else>{{ scope.row.statusStr&&scope.row.statusStr.value }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="下单时间"
          min-width="150"
        />
        <el-table-column label="操作" min-width="150" fixed="right" align="center" >
          <template slot-scope="scope" >
            <el-button v-if="scope.row.paid === false" type="text" size="small" @click="edit(scope.row)" class="mr10">编辑</el-button>
            <el-button v-if="scope.row.statusStr&&scope.row.statusStr.key === 'notShipped' && scope.row.shippingType === 1 && scope.row.refundStatus !==2" type="text" size="small" class="mr10" @click="sendOrder(scope.row)">发送货</el-button>
            <el-button v-if="scope.row.shippingType === 2 && scope.row.statusStr.key === 'toBeWrittenOff'  && scope.row.paid == true && scope.row.refundStatus === 0 && isWriteOff" type="text" size="small" class="mr10" @click="onWriteOff(scope.row)">立即核销</el-button>
            <el-dropdown trigger="click" v-if="scope.row.statusStr">
              <span class="el-dropdown-link">
                更多<i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="onOrderDetails(scope.row.id)">订单详情</el-dropdown-item>
                <el-dropdown-item @click.native="onOrderLog(scope.row.id)">订单记录</el-dropdown-item>
                <el-dropdown-item @click.native="onOrderMark(scope.row)">订单备注</el-dropdown-item>
                <el-dropdown-item v-show="scope.row.statusStr.key === 'refunding'" @click.native="onOrderRefuse(scope.row)">拒绝退款</el-dropdown-item>
                <el-dropdown-item v-show="scope.row.statusStr.key === 'refunding' && ((parseFloat(scope.row.payPrice) >= parseFloat(scope.row.refundPrice) || (scope.row.payPrice == 0 && [0,1].indexOf(scope.row.refundStatus) !== -1)))" @click.native="onOrderRefund(scope.row)">立即退款</el-dropdown-item>
                <el-dropdown-item v-show="scope.row.statusStr.key === 'applying'" @click.native="onOrderCheck(scope.row)">退货审核</el-dropdown-item>
                <el-dropdown-item v-show="scope.row.statusStr.key === 'underReview'" @click.native="onOrderCheck(scope.row)">退货审核</el-dropdown-item>
                <el-dropdown-item v-show="scope.row.statusStr.key === 'underReview'&&scope.row.deliveryType!='fictitious'" @click.native="onReturnFlow(scope.row)">查看物流</el-dropdown-item>

                <el-dropdown-item @click.native="handleDelete(scope.row, scope.$index)">删除订单</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-table v-show="tableFrom.status=='cardorder'"
                v-loading="listLoading"
                :data="tableData.data"
                style="width: 100%"
                size="mini"
                class="table"
                highlight-current-row
                @selection-change="handleSelectionChange"
      >
        <el-table-column prop="id" label="卡券ID" min-width="150"></el-table-column>
        <el-table-column prop="cardName" label="卡券名称" min-width="150"></el-table-column>
        <el-table-column prop="cardNumber" label="卡券数量" min-width="150"></el-table-column>
        <el-table-column prop="cardPrice" label="卡券价格" min-width="150"></el-table-column>
        <el-table-column prop="payMoney" label="支付金额" min-width="150"></el-table-column>
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

    <!--编辑-->
    <el-dialog
      title="编辑订单"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose">
        <zb-parser
        :form-id="104"
        :is-create="isCreate"
        :edit-data="editData"
        @submit="handlerSubmit"
        @resetForm="resetForm"
      />
    </el-dialog>

    <!--记录-->
    <el-dialog
      title="操作记录"
      :visible.sync="dialogVisibleJI"
      width="700px"
    >
      <el-table
        v-loading="LogLoading"
        border
        :data="tableDataLog.data"
        style="width: 100%"
      >
        <el-table-column
          prop="oid"
          align="center"
          label="ID"
          min-width="80"
        />
        <el-table-column
          prop="changeMessage"
          label="操作记录"
          align="center"
          min-width="280"
        />
        <el-table-column
          prop="createTime"
          label="操作时间"
          align="center"
          min-width="280"
        />
      </el-table>
      <div class="block">
        <el-pagination
          :page-sizes="[10, 20, 30, 40]"
          :page-size="tableFromLog.limit"
          :current-page="tableFromLog.page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableDataLog.total"
          @size-change="handleSizeChangeLog"
          @current-change="pageChangeLog"
        />
      </div>
    </el-dialog>

    <!--详情-->
    <details-from ref="orderDetail" :orderId="orderId"/>

    <!-- 发送货 -->
    <order-send ref="send" :orderId="orderId" @submitFail="getList"></order-send>
    <!-- 退货物流详情 -->
    <el-dialog
      title="退货物流详情"
      :visible.sync="LogisticsVisible"
      width="800px"
      :before-close="Logisticsclose">
      <div style="padding: 20px;">
        <div>
          <el-form :model="logisticsdata.order" label-width="120" v-if="logisticsdata.order">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="物流公司:">
                  <span>{{logisticsdata.order.deliveryName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="物流单号:">
                  <span>{{logisticsdata.order.deliveryId}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <el-timeline :reverse="false" v-if='logisticsdata.status'>
          <el-timeline-item
            v-for="(activity, index) in logisticsdata.arrlist"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
        <p v-else>{{logisticsdata.reason}}</p>
      </div>
    </el-dialog>

    <!--拒绝退款-->
    <el-dialog
      title="拒绝退款原因"
      :visible.sync="RefuseVisible"
      width="500px"
      :before-close="RefusehandleClose">
      <zb-parser
        :form-id="106"
        :is-create="1"
        :edit-data="RefuseData"
        @submit="RefusehandlerSubmit"
        @resetForm="resetFormRefusehand"
      />
    </el-dialog>
    <!--退货审核-->
    <el-dialog
      title="退货审核"
      :visible.sync="CheckVisible"
      width="500px"
      :before-close="CheckClose">
      <el-form :model="CheckData"  :rules="CheckDatarules" ref="CheckData">
        <el-form-item label="退款申请理由：">
          <el-input v-model="CheckData.returnMsg" readonly></el-input>
        </el-form-item>
        <el-form-item label="退款申请时间：">
          <el-input v-model="CheckData.returnTime" readonly></el-input>
        </el-form-item>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="退款金额：">
              <el-input v-model="CheckData.amount" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态：">
              <el-select v-model="CheckData.status">
                <el-option v-show="CheckData.curStatus==4" value="0" label="申请退货成功"></el-option>
                <el-option v-show="CheckData.curStatus==4" value="1" label="申请退货失败"></el-option>
                <el-option v-show="CheckData.curStatus==6" value="2" label="审核退货成功"></el-option>
                <el-option v-show="CheckData.curStatus==6" value="3" label="审核退货失败"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8" v-for="(item,index) in refundReasonWapImg" :key='index'>
            <el-image
                :src="item"
                :preview-src-list="[item]"
             ></el-image>
          </el-col>
        </el-row>

        <el-form-item label="备注:" prop="remark" v-if="CheckData.status==1||CheckData.status==3">
          <el-input v-model="CheckData.remark" ></el-input>
        </el-form-item>
        <el-form-item label="备注:" v-else>
          <el-input v-model="CheckData.remark" ></el-input>
        </el-form-item>

        <el-form-item size='mini'>
          <el-button type='primary' @click="returnSubmitForm">提交</el-button>
          <el-button @click="returnResetForm">取消</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
    <!--立即拒绝-->
    <el-dialog
      title="退款处理"
      :visible.sync="refundVisible"
      width="500px"
      :before-close="refundhandleClose">
      <!-- <zb-parser
        :form-id="107"
        :is-create="1"
        :edit-data="refundData"
        @submit="refundhandlerSubmit"
        @resetForm="resetFormRefundhandler"
      /> -->
      <el-form :model="refundData" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="退款单号" prop="orderId">
          <el-input v-model="refundData.orderId"></el-input>
        </el-form-item>
        <el-form-item label="退款金额" prop="amount">
           <el-input-number v-model="refundData.amount"  :min="0" :max="refundData.amount"></el-input-number>
        </el-form-item>
        <el-form-item label="处理" prop="type">
          <el-radio-group v-model="refundData.type">
            <el-radio  label="1">直接退款</el-radio>
            <!-- <el-radio  label="2">退款后,返回原状态</el-radio> -->
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="refundhandlerSubmit">提交</el-button>
          <el-button @click="resetFormRefundhandler">取消</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
  import { writeUpdateApi, orderListApi, orderUpdateApi, orderLogApi, orderMarkApi, orderDeleteApi, orderRefuseApi, orderRefundApi,orderSubListApi,pendingReturnApi,returnFlowApi } from '@/api/order'
  import cardsData from '@/components/cards/index'
  import zbParser from '@/components/FormGenerator/components/parser/ZBParser'
  import detailsFrom from './orderDetail'
  import orderSend from './orderSend'
  import { storeStaffListApi } from '@/api/storePoint'
  import Cookies from 'js-cookie'
  import { fromList } from '@/utils/constants.js'
  import { isWriteOff } from "@/utils";
  export default {
    name: 'orderlistDetails',
    components: {
      cardsData,
      zbParser,
      detailsFrom,
      orderSend
    },
    data() {
        return {
          RefuseVisible: false,
          RefuseData:{},
          CheckVisible:false,
          CheckData:{},
          orderId: 0,
          refundVisible: false,
          refundData: {},
          dialogVisibleJI: false,
          tableDataLog: {
            data: [],
            total: 0
          },
          tableFromLog: {
            pageNo: 1,
            pageSize: 10,
            oid: null
          },
          LogLoading: false,
          isCreate: 1,
          editData: null,
          dialogVisible: false,
          tableData: {
            data: [],
            total: 0
          },
          listLoading: true,
          tableFrom: {
            status: 'all',
            dateLimit: '',
            orderId: '',
            pageNo: 1,
            pageSize: 20
          },
          orderChartType: {},
          timeVal: [],
          fromList: fromList,
          selectionList: [],
          ids: '',
          orderids: '',
          cardLists: [],
          isWriteOff: isWriteOff(),
          maxAmount:0,
          LogisticsVisible:false, //物流
          logisticsdata:{},
          refundReasonWapImg:[],//申请退款的图片数组
          filePath: process.env.VUE_APP_IMAGE_API,
          rules:{
            orderId:[
               { required: true, message: '退款单号不能为空', trigger: 'blur' }
             ],
             amount: [
                { required: true, message: '退款金额不能为空', trigger: 'blur' }
              ],
              type:[
                 { required: true, message: '单选处理不能为空', trigger: 'blur' }
              ]
          },
          CheckDatarules:{
            remark:[
              { required: true, message: '退货申请拒绝请备注拒绝理由', trigger: 'blur' }
            ]
          }
        }
      },
    mounted() {
      this.getList()
    },
    methods: {
      // 取消
      resetFormRefundhandler(){
        this.refundVisible = false
      },
      resetFormRefusehand(){
        this.RefuseVisible = false
      },
      resetForm(formValue) {
        this.dialogVisible = false
      },
      CheckClose(){
        this.CheckVisible = false;
      },
      // 核销订单
      onWriteOff(row) {
        this.$modalSure('核销订单吗').then(() => {
          writeUpdateApi(row.verifyCode).then(() => {
            this.$message.success('核销成功')
            this.tableFrom.status = 'toBeWrittenOff'
            this.tableFrom.pageNo = 1
            this.getList()
          })
        })
      },
      seachList() {
        this.tableFrom.pageNo = 1
        this.getList()
      },
      // 拒绝退款
      RefusehandleClose() {
        this.RefuseVisible = false
      },

      onOrderRefuse(row) {
        this.orderids = row.id
        this.RefuseData = {
          orderId: row.orderId,
          reason: ''
        }
        this.RefuseVisible = true
      },

      RefusehandlerSubmit(formValue) {
        orderRefuseApi({ id: this.orderids, reason: formValue.reason}).then(data => {
          this.$message.success('操作成功')
          this.RefuseVisible = false
          this.getList()
        })
      },
      //退货审核
      onOrderCheck(row){
        // console.log(row)
        if(row.refundReasonWapImg){
         let refundReasonWapImg = row.refundReasonWapImg.split(',');
         this.refundReasonWapImg = refundReasonWapImg
         // this.refundReasonWapImg = refundReasonWapImg.map(item=>{
         //   return  this.filePath + item
         // })
         console.log(this.refundReasonWapImg)
        }
        this.orderids = row.id
        orderLogApi({oid: row.id,pageNo: 1,
          pageSize: 9999} ).then(res => {
          let data = res.rows.filter(item=>{
            return item.changeType=='return'
          })
          this.CheckData = {
            orderId: row.orderId,
            returnMsg: data&&data.length>0?data[0].changeMessage:'',
            returnTime: data&&data.length>0?data[0].createTime:'',
            remark:'',
            amount:row.payPrice||'',
            status:row.status==4?'0':'2',
            curStatus:row.status||''
          }
          this.CheckVisible = true
        }).catch(() => {
          this.CheckVisible = false
        })

      },
      returnSubmitForm(){
        this.$refs["CheckData"].validate(valid => {
          if (valid){
            if((this.CheckData.status==1||this.CheckData.status==3)&&!this.CheckData.remark){
              return this.$message.error('请输入拒绝理由')
            }
            let data = {
              orderId:this.CheckData.orderId,
              status:this.CheckData.status,
              amount:this.CheckData.amount,
              refundReason:this.CheckData.remark
            }
            pendingReturnApi(data).then(res=>{
              this.getList()
              this.CheckVisible = false
            }).catch(err=>{

            })
          }
        })
      },
      returnResetForm(){
        this.CheckData={};
        this.CheckVisible = false
      },
      // 立即退款
      refundhandleClose() {
        this.refundVisible = false
      },
      // 立即退款
      onOrderRefund(row) {
        console.log(row.payPrice)

        this.refundData = {
          orderId: row.orderId,
          amount: row.payPrice,
          type:'1'
        }
        this.maxAmount = row.payPrice;
        this.orderids = row.id
        this.refundVisible = true
      },

      // 立即退款提交
      refundhandlerSubmit() {
				console.log(this.refundData)
        if(this.refundData.amount>this.maxAmount){
          this.$message.error('退款金额不能高于付款价:'+this.maxAmount+'元')
        }else{
          orderRefundApi({ amount: this.refundData.amount, orderId: this.orderids, type: this.refundData.type}).then(data => {
            this.$message.success('操作成功')
            this.refundVisible = false
            this.getList()
          })
        }
      },
      // 发送
      sendOrder(row) {
        this.$refs.send.modals = true;
        this.$refs.send.getList();
        this.orderId = row.id;
      },
      // 订单删除
      handleDelete(row, idx) {
        if (row.isDel) {
          this.$modalSure().then(() => {
            orderDeleteApi({ id: row.id }).then(() => {
              this.$message.success('删除成功')
              this.tableData.data.splice(idx, 1)
            })
          })
        } else {
          this.$confirm('您选择的的订单存在用户未删除的订单，无法删除用户未删除的订单！', '提示', {
            confirmButtonText: '确定',
            type: 'error'
          })
        }
      },
      // 详情
      onOrderDetails(id) {
        this.orderId = id
        this.$refs.orderDetail.getDetail(id)
        this.$refs.orderDetail.dialogVisible = true
      },
      // 订单记录
      onOrderLog(id) {
        this.dialogVisibleJI = true
        this.LogLoading = true
        this.tableFromLog.oid = id
        orderLogApi( this.tableFromLog ).then(res => {
          this.tableDataLog.data = res.rows
          this.tableDataLog.total = res.totalRows
          this.LogLoading = false
        }).catch(() => {
          this.LogLoading = false
        })
      },

      //查看退货物流
      onReturnFlow(row){
        console.log(row)
        returnFlowApi({id:row.id}).then(res=>{
          this.LogisticsVisible = true;
          this.logisticsdata.arrlist = [];
          this.logisticsdata.arrlist = res.express.data
          if(res.express.data.length>0){
            this.logisticsdata.status = true
          }else{
            this.logisticsdata.status = false
          }
          this.logisticsdata.order = res.order;
          this.logisticsdata.reason = res.express.reason
        })

      },
      Logisticsclose(){
        this.LogisticsVisible = false
      },
      pageChangeLog(page) {
        this.tableFromLog.pageNo = page
        this.getList()
      },
      handleSizeChangeLog(val) {
        this.tableFromLog.limit = val
        this.getList()
      },
      handleClose() {
        this.dialogVisible = false
      },
      // 备注
      onOrderMark(row) {
        this.$prompt('订单备注', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputErrorMessage: '请输入订单备注',
          inputType: 'textarea',
          inputValue: row.mark,
          inputPlaceholder: '请输入订单备注',
          inputValidator: (value) => { if(!value) return '输入不能为空'}
        }).then(({value}) => {
          orderMarkApi({ mark : value, id: row.id}).then(() => {
            this.$message.success('操作成功')
            this.getList();
          })
        }).catch(() => {
          this.$message.info('取消输入')
        })
      },
      handleSelectionChange(val) {
        this.selectionList = val
        const data = []
        this.selectionList.map((item) => {
          data.push(item.id)
        })
        this.ids = data.join(',')
      },
      // 选择时间
      selectChange (tab) {
        this.timeVal = [];
        this.tableFrom.pageNo = 1
        this.getList();
      },
      // 具体日期
      onchangeTime (e) {
        this.timeVal = e;
        this.tableFrom.dateLimit = e ? this.timeVal.join(',') : ''
        this.tableFrom.pageNo = 1
        this.getList();
      },
      // 编辑
      edit(row) {
        this.dialogVisible = true
        this.orderId = row.id
        this.editData = {
          orderId: row.orderId,
          totalPrice: row.totalPrice,
          totalPostage: row.totalPostage,
          payPrice: row.payPrice,
          payPostage: row.payPostage,
          gainIntegral: row.gainIntegral,
        }
      },
      handlerSubmit(formValue) {
        orderUpdateApi(formValue, {id: this.orderId}).then(data => {
          this.$message.success('编辑数据成功')
          this.dialogVisible = false
          this.getList()
        })
      },
      // 列表
      getList() {
        this.listLoading = true
        if(this.tableFrom.status=='cardorder'){
          orderSubListApi().then(res=>{
            this.tableData.data = res.rows || []
            this.tableData.total = res.totalRows
            this.listLoading = false
          }).catch(()=>{
            this.listLoading = false
          })
        }else{
          orderListApi(this.tableFrom).then(res => {
            this.tableData.data = res.list.rows || []
            this.tableData.total = res.list.totalRows
            this.orderChartType = res.status
            const stat = res.top
            this.cardLists = [
              { name: '订单数量', count: stat.count },
              { name: '订单金额', count: stat.amount },
              { name: '微信支付金额', count: stat.weChatAmount },
              { name: '余额支付金额', count: stat.yueAmount }
            ]
            this.listLoading = false
          }).catch(() => {
            this.listLoading = false
          })
        }

      },
      pageChange(page) {
        this.tableFrom.pageNo = page
        this.getList()
      },
      handleSizeChange(val) {
        this.tableFrom.pageSize = val
        this.getList()
      },
    }
}
</script>

<style lang="scss" scoped>
  .demo-table-expand{
    /deep/label{
      width: 83px !important;
    }
  }
  .refunding{
    span{
      display: block;
    }
  }
  .selWidth{
    width: 300px;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
    font-size: 12px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .tabBox_tit {
    width: 60%;
    font-size: 12px !important;
    margin: 0 2px 0 10px;
    letter-spacing: 1px;
    padding: 5px 0;
    box-sizing: border-box;
  }
</style>
