<!--
 * @Date: 2021-10-09 09:35:17
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-10 14:09:59
 * @FilePath: \management\src\view\work-order\orderDetail.vue
-->
<template>
	<div class="orderDetail">
		<div class="progress center mb20">
			<Steps :current="currentProcess">
				<Step
					v-for="(item, index) in approvalChartList"
					:key="index"
					:title="item.approvalLinkName"
				>
					<template slot="icon">
						<Icon
							type="ios-checkmark-circle-outline"
							v-if="item.linkStatus === 2"
						/>
						<Icon type="ios-ionic" v-if="item.linkStatus === 1" />
						<Icon
							type="ios-radio-button-off"
							v-if="item.linkStatus === 0"
						/>
						<Icon
							type="ios-alert-outline"
							v-if="
								item.linkStatus === -1 || item.linkStatus === 3
							"
						/>
					</template>
					<template slot="content">
						<p>
							{{ item.approverName }}
						</p>
						<p>
							{{ item.approvalTime }}
						</p>
					</template>
				</Step>
			</Steps>
		</div>
		<div class="basicInfo">
			<span class="font18">{{ orderDetail.workOrderNo }}</span>
			<span class="font18 ml20">{{ orderDetail.workOrderTitle }}</span>
			<Row>
				<Col span="14">
					<span> 当前责任人: </span>
					<span>{{ orderDetail.currentProcessor }}</span>
				</Col>

				<Col span="8" offset="2">
					当前状态: {{ orderDetail.currentNode }}
				</Col>
			</Row>

			<Row v-if="orderDetail.workOrderType === 1">
				<Col span="14">
					<span> 需求类型: </span>
					<span>{{ orderDetail.requirementTypeName }}</span>
				</Col>

				<Col span="8" offset="2">
					涉及系统名称: {{ orderDetail.targetSystemName }}
				</Col>
			</Row>

			<Row v-if="orderDetail.workOrderType === 2">
				<Col span="8">
					<span> 配置类型: </span>
					<span>{{ orderDetail.configTypeName }}</span>
				</Col>
				<Col span="8">
					涉及系统名称: {{ orderDetail.targetSystemName }}
				</Col>
				<Col span="8">
					原需求发起人: {{ orderDetail.originalSponsor }}
				</Col>
			</Row>

			<Row v-if="orderDetail.workOrderType === 3">
				<Col span="14">
					涉及系统名称: {{ orderDetail.targetSystemName }}
				</Col>
				<Col span="8" offset="2">
					原需求发起人: {{ orderDetail.originalSponsor }}
				</Col>
			</Row>

			<Row>
				<Col span="14"> 计划完成日期: {{ orderDetail.planDate }}</Col>
				<Col span="8" offset="2">
					已投入工时:
					<span
						class="costTime"
						@click="openCostTimeList"
						title="填报工时"
						>{{ orderDetail.costTime || 0 }} H
					</span>
				</Col>
			</Row>
			<Row>
				<Col span="4"> 需求描述: </Col>
				<Col span="20"> {{ orderDetail.workDescription }}</Col>
			</Row>
			<Row>
				<Col span="4"> 上传附件: </Col>
				<Col span="20">
					<Upload
						ref="upload"
						type="drag"
						action=""
						:before-upload="handleUpload"
					>
						<div style="padding: 20px 0">
							<Icon
								type="ios-cloud-upload"
								size="52"
								style="color: #3399ff"
							></Icon>
							<p>点击或拖动文件至此</p>
						</div>
					</Upload>
					<div class="uploadList" v-if="uploadList.length">
						<p>已上传文件列表:</p>
						<ul>
							<li
								class="fileCard"
								v-for="(item, index) in uploadList"
								:key="index"
							>
								<span
									class="fileName font12"
									@click="downLoadFile(item)"
								>
									{{ item.fileName || item.name }}</span
								>
								<!-- <span class="deleteIcon" title="删除">
									<Icon
										type="ios-trash-outline"
										@click="handleRemove(item)"
									></Icon>
								</span> -->
							</li>
						</ul>
					</div>
				</Col>
			</Row>
		</div>

		<Divider />
		<div class="btns">
			<Button type="success" @click="openReview" v-if="isShowApproval"
				>审批</Button
			>
			<!--本人提交单子，被驳回，处于 自由态，可编辑后再次提交 -->
			<!-- v-if="orderDetail.originalSponsor === pkUser &&  orderDetail.workflowStatus === 0" -->
			<Button
				type="warning"
				class="ml10"
				@click="editOrder(orderDetail)"
				v-if="
					orderDetail.senderId === pkUser &&
					[0, -1].includes(orderDetail.workflowStatus)
				"
				>更改</Button
			>
			<!-- <Button
				type="success"
				@click="reSubmit"
                class="ml10"
				:loading="modalLoading"
                v-if="orderDetail.originalSponsor === pkUser &&  orderDetail.workflowStatus === 0"
				
				>提交</Button
			> -->
			<Button class="ml10" @click="openNote">提交备注</Button>
		</div>

		<div class="tabsCon">
			<Tabs>
				<TabPane label="备注日志">
					<ul class="logCon">
						<li v-for="(item, index) in noteList" :key="index">
							<p class="name fontW700">
								<span>{{ item.userInfo }}</span>
							</p>
							<p
								class="replyContent"
								style="white-space: pre-wrap"
								v-html="item.content"
							></p>
							<p class="operate">
								<span class="mr20">{{ item.createTime }}</span>
								<span
									class="mr20 cursorPointer"
									@click="reply(item)"
									>回复</span
								>
								<span
									class="mr20 cursorPointer"
									@click="delNote(item)"
									v-if="item.createBy === pkUser"
									>删除</span
								>
							</p>
							<ul
								class="replyCon"
								v-if="item.child && item.child.length > 0"
							>
								<li
									v-for="(subItem, subIndex) in item.child"
									:key="subIndex"
								>
									<p class="nameContent font14">
										<span>{{ subItem.userInfo }}</span>
										<span
											class="receiverName ml15"
											v-show="subItem.receiverName"
										>
											回复@{{
												subItem.receiverName
											}}</span
										>:
										<span
											style="white-space: pre-wrap"
											class="subContent"
											>{{ subItem.content }}</span
										>
									</p>
									<p class="operate">
										<span class="mr20">{{
											subItem.createTime
										}}</span>
										<span
											class="mr20 cursorPointer"
											@click="reply(subItem)"
											>回复</span
										>
										<span
											class="mr20 cursorPointer"
											@click="delNote(subItem)"
											v-if="subItem.createBy === pkUser"
											>删除</span
										>
									</p>
								</li>
							</ul>
						</li>
					</ul>
				</TabPane>
				<TabPane label="审批流程">
					<Table
						:data="approvalProcessList"
						:columns="approvalColumn"
						border
						max-height="750"
						class="mb10"
					>
					</Table>
				</TabPane>
			</Tabs>
		</div>

		<Modal v-model="reviewModal" title="审核">
			<Form
				:model="pageForm"
				:rules="pageRule"
				:label-width="120"
				ref="pageForm"
			>
				<FormItem prop="ccPersonList" label="抄送">
					<Select
						v-model="pageForm.ccPersonList"
						filterable
						multiple
						placeholder="请选择"
						style="width: 300px"
					>
						<Option
							v-for="item in allUserList"
							:value="item.code"
							:key="item.code"
							>{{ item.name }}</Option
						>
					</Select>
				</FormItem>
				<FormItem prop="approvalComments" label="审批意见">
					<Input
						v-model="pageForm.approvalComments"
						maxlength="300"
						:rows="4"
						show-word-limit
						type="textarea"
						placeholder="请输入"
						style="width: 300px"
					/>
				</FormItem>
			</Form>

			<div slot="footer">
				<Button type="success" :loading="modalLoading" @click="agree"
					>同意</Button
				>
				<Button type="error" :loading="modalLoading" @click="refuse"
					>拒绝</Button
				>
			</div>
		</Modal>

		<Modal v-model="noteModal" title="备注">
			<p v-if="noteObj.receiverName">
				回复 {{ noteObj.receiverName }} ：
			</p>
			<Input
				v-model="noteObj.content"
				maxlength="300"
				:rows="4"
				show-word-limit
				type="textarea"
				placeholder="请输入"
				style="width: 100%"
			/>
			<div slot="footer">
				<Button type="success" :loading="modalLoading" @click="saveNote"
					>保存</Button
				>
			</div>
		</Modal>
		<Modal
			v-model="manHourModal"
			title="工时详情"
			:width="800"
			class="manHourModal"
		>
			<manHour
				v-if="manHourModal"
				:currentPkWorkOrder="currentPkWorkOrder"
			></manHour>
			<div slot="footer" class="center">
				<Button
					type="primary"
					:loading="modalLoading"
					@click="manHourModal = false"
					>确定</Button
				>
			</div>
		</Modal>

		<Modal
			v-model="addModal"
			title=""
			footer-hide
			:width="1000"
			class="addModal"
		>
			<addOrder
				v-if="addModal"
				:pkWorkOrder="currentPkWorkOrder"
				:orderType="orderType"
				@submitClick="closeRefresh"
			></addOrder>
		</Modal>
	</div>
</template>
<script>
import { mapState } from "vuex";

import manHour from "@/view/work-order/manHour";
import addOrder from "@/view/work-order/addOrder";

import { fileApi } from "@/api/fileUpload";
import { orderApi, workflow, remarkApi } from "@/api/workOrder";
import { userApi } from "@/api/system";

import { handleBLob } from "@/libs/exportExcel";

export default {
	props: {
		currentPkWorkOrder: {
			type: "",
			required: true,
		},
	},
	computed: {
		...mapState({
			pkUser: (state) => state.user.userInfo.pkUser,
		}),
	},
	components: {
		manHour,
		addOrder,
	},
	watch: {
		currentPkWorkOrder(value) {
			console.log("--watch>", value, "<-");
			this.initial();
		},
	},
	data() {
		return {
			currentProcess: 0,
			approvalChartList: [],
			// 订单详情对象
			orderDetail: {},
			// 附件列表
			uploadList: [],
			isShowApproval: true, // 是否需要审核

			// modal
			modalLoading: false,
			reviewModal: false,
			pageForm: {},
			pageRule: {
				approvalComments: [
					{
						required: false,
						message: "请输入",
						trigger: "blur",
					},
				],
			},
			allUserList: [],

			approvalColumn: [
				{
					align: "center",
					title: "节点名称",
					key: "approvalLinkName",
					minWidth: 80,
				},
				{
					align: "center",
					title: "审批人",
					key: "approverName",
					minWidth: 150,
				},
				{
					align: "center",
					title: "审批时间",
					key: "approvalTime",
					minWidth: 100,
				},
				{
					align: "center",
					title: "操作结果",
					key: "approvalResult",
					minWidth: 60,
				},
				{
					align: "center",
					title: "审批意见",
					key: "approvalComments",
					minWidth: 100,
				},
			],
			approvalProcessList: [],

			noteList: [],
			noteModal: false,
			noteObj: {},
			manHourModal: false,
			addModal: false,
			orderType: 0,
		};
	},
	created() {
		this.initial();
	},
	mounted() {
		console.log("--detail-mounted>", "<-");
	},
	methods: {
		initial() {
			if (!this.currentPkWorkOrder) return;
			console.log("-currentPkWorkOrder->", this.currentPkWorkOrder, "<-");

			this.getDetail();
			this.isApprover();

			this.queryFlowChart();
			this.queryApprovalHistory();
			this.getNoteList();
		},
		getDetail() {
			orderApi
				.getDetail({ pkWorkOrder: this.currentPkWorkOrder })
				.then((res) => {
					this.orderDetail = res.data;
					this.uploadList = this.orderDetail.files || [];
				})
				.catch((err) => {
					console.log("-->", err, "<-");
					this.orderDetail = {};
					this.uploadList = [];
				});
		},
		isApprover() {
			workflow
				.isApprover({ pkWorkOrder: this.currentPkWorkOrder })
				.then((res) => {
					this.isShowApproval = res.data;
				})
				.catch((err) => {
					console.log("-->", err, "<-");
				});
		},

		handleUpload(file) {
			// 当前文件调接口上传，成功后，拿到fileId,再push
			const params = this.getFormData({
				pkWorkOrder: this.orderDetail.pkWorkOrder,
				file: file,
			});
			console.log("-params-file>", file, "<-");
			console.log("-params->", params, "<-");

			fileApi
				.upLoadFile(params)
				.then((res) => {
					console.log("-->", res, "<-");
					this.uploadList.push(file);
					this.$Message.success("附件已上传");
				})
				.catch((err) => {
					this.$Message.error(err.msg);
				});

			return false;
		},
		handleRemove(file) {
			const index = this.uploadList.indexOf(file);
			console.log("-->", file, "<-");
			console.log("-->", index, "<-");

			this.$Modal.confirm({
				title: "提示",
				content: "确定删除此条数据吗？",
				loading: true,
				onOk: () => {
					fileApi
						.deleteFile({
							fileId: file.fileId,
							pkWorkOrder: this.orderDetail.pkWorkOrder,
						})
						.then((res) => {
							this.uploadList.splice(index, 1);
							this.$Message.success("附件已删除");
							this.$Modal.remove();
						})
						.catch((err) => {
							this.$Message.error(err.msg);
							this.$Modal.remove();
						});
				},
			});
		},
		downLoadFile(file) {
			console.log("-->", file, "<-");

			fileApi
				.getFile({ fileId: file.fileId })
				.then((res) => {
					console.log("-下载->", res, "<-");
					handleBLob(res);
				})
				.catch((err) => {
					this.$Message.error(err.msg);
				});
		},
		getFormData(params) {
			let fdata = new FormData();
			for (let key in params) {
				params[key] && fdata.append(key, params[key]);
			}
			return fdata;
		},

		//工时
		openCostTimeList() {
			this.manHourModal = true;
		},

		// 查询审批流程图和列表
		queryFlowChart() {
			workflow
				.queryFlowChart({ pkWorkOrder: this.currentPkWorkOrder })
				.then((res) => {
					const list = res.data;
					this.approvalChartList = list;
					this.currentProcess = this.approvalChartList.findIndex(
						(item) => {
							return item.linkStatus === 1;
						}
					);
					console.log("-findIndex->", this.currentProcess, "<-");
				})
				.catch((err) => {
					console.log("-->", err, "<-");
					this.approvalChartList = [];
				});
		},
		queryApprovalHistory() {
			workflow
				.queryApprovalHistory({ pkWorkOrder: this.currentPkWorkOrder })
				.then((res) => {
					const list = res.data;
					this.approvalProcessList = list;
				})
				.catch((err) => {
					console.log("-->", err, "<-");
					this.approvalProcessList = [];
				});
		},

		openReview() {
			this.pageForm = {
				pkWorkOrder: this.currentPkWorkOrder,
				ccPersonList: [],
				approvalComments: "",
			};
			this.reviewModal = true;
			this.matchAllUserList();
		},
		// 获取所有用户列表，用于选择抄送 getAllUserList
		matchAllUserList() {
			userApi
				.matchAllUserList()
				.then((res) => {
					const list = res.data || [];
					list.forEach((item) => {
						item.code = item.pkUser;
						item.name = `${item.username}-${item.realname}`;
					});
					this.allUserList = list;
				})
				.catch((err) => {
					this.allUserList = [];
				});
		},
		agree() {
			this.modalLoading = true;
			this.pageForm.ccPersons = this.pageForm.ccPersonList.join(",");
			workflow
				.approve(this.pageForm)
				.then((res) => {
					this.$Message.success("操作成功");
					this.modalLoading = false;
					this.reviewModal = false;
					this.initial();
				})
				.catch((err) => {
					this.modalLoading = false;
					this.reviewModal = false;
				});
		},
		refuse() {
			this.modalLoading = true;
			this.pageForm.ccPersons = this.pageForm.ccPersonList.join(",");

			workflow
				.reject(this.pageForm)
				.then((res) => {
					this.$Message.success("操作成功");
					this.modalLoading = false;
					this.reviewModal = false;
					this.initial();
				})
				.catch((err) => {
					this.modalLoading = false;
					this.reviewModal = false;
				});
		},

		editOrder(r) {
			console.log("-->", r, "<-");
			this.orderType = r.workOrderType;
			this.addModal = true;

			// this.$router.push({
			// 	name: "addOrder",
			// 	query: {
			// 		orderType: r.workOrderType,
			// 		pkWorkOrder: r.pkWorkOrder,
			// 	},
			// });
		},
		closeRefresh() {
			this.addModal = false;
			this.initial();
		},
		// reSubmit 驳回后再次提交
		reSubmit() {},

		// 备注
		getNoteList() {
			remarkApi
				.getList({ pkWorkOrder: this.currentPkWorkOrder })
				.then((res) => {
					const list = res.data;
					list.forEach((item) => {
						item.id = item.pkRemark;
					});
					this.noteList = list;
				})
				.catch((err) => {
					console.log("-->", err, "<-");
					this.noteList = [];
				});
		},
		// 新增备注
		openNote() {
			this.noteObj = {
				pkWorkOrder: this.currentPkWorkOrder,
				content: "",
				rootRemarkId: null,
				replyId: null,
			};
			this.noteModal = true;
		},
		// 回复备注
		reply(r) {
			this.noteObj = {
				pkWorkOrder: this.currentPkWorkOrder,
				content: "",
				rootRemarkId: r.rootRemarkId || r.pkRemark,
				replyId: r.pkRemark,

				receiverName: r.userInfo,
			};
			this.noteModal = true;
		},
		saveNote() {
			this.modalLoading = true;
			remarkApi
				.add(this.noteObj)
				.then((res) => {
					this.$Message.success("操作成功");
					this.modalLoading = false;
					this.noteModal = false;
					this.getNoteList();
				})
				.catch((err) => {
					this.modalLoading = false;
					this.noteModal = false;
				});

			// 调接口
		},
		delNote(r) {
			this.$Modal.confirm({
				title: "提示",
				content: "确定删除此条数据吗？",
				loading: true,
				onOk: () => {
					remarkApi
						.delete({
							remarkId: r.pkRemark,
						})
						.then((res) => {
							this.$Message.success("删除成功");
							this.$Modal.remove();
							this.getNoteList();
						})
						.catch((err) => {
							this.$Modal.remove();
						});
				},
			});
		},
	},
};
</script>

<style  lang="less" >
.orderDetail {
	height: 100%;
	overflow: auto;
	.ivu-col {
		margin-top: 8px;
		margin-bottom: 8px;
	}
	.progress {
		box-sizing: border-box;
		padding-left: 0px;
		.ivu-steps-item:last-child {
			-webkit-box-flex: 1;
			flex: 1;
		}
		.ivu-steps-content {
			padding: 10px 5px;
			text-align: center;
		}
	}
	.basicInfo {
		.costTime {
			cursor: pointer;
			text-decoration: underline;
			color: #f60;
		}
	}
	.uploadList {
		ul {
			margin-left: 30px;
			height: 100px;
			overflow: auto;
			// border: 1px dashed grey;
			& > li {
				height: 24px;
				box-sizing: border-box;

				span {
					display: inline-block;
					height: 24px;
					line-height: 24px;
					vertical-align: top;
				}
				.deleteIcon {
					display: none;
					margin-left: 10px;
					font-size: 18px;
				}
			}

			& > li:hover {
				// border: 1px dashed grey;
				.fileName {
					text-decoration: underline;
					cursor: pointer;
				}
				.deleteIcon {
					display: inline-block;
					cursor: pointer;
				}
			}
		}
	}
	.btns {
		text-align: right;
	}

	.logCon {
		& > li {
			// padding: 15px;
			padding: 22px 0 14px 0;
			border-top: 1px solid #e5e9ef;
			.replyContent {
				line-height: 20px;
				padding: 2px;
				font-size: 14px;
				text-shadow: none;
				overflow: hidden;
				word-wrap: break-word;
				word-break: break-word;
				// white-space: pre-wrap;
			}
			.operate {
				color: #99a2aa;
				line-height: 14px;
				margin-top: 6px;
				font-size: 12px;
			}
			.replyCon {
				margin-left: 30px;
				& > li {
					padding: 10px 0;
				}
			}
		}
	}
}
.manHourModal {
	.ivu-modal-body {
		height: 500px;
		overflow: auto;
	}
}
</style>

