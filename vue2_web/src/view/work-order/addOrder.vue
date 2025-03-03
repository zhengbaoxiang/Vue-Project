<!--
 * @Author: zbx
 * @Date: 2021-09-27 16:11:15
 * @LastEditTime: 2022-04-10 14:09:12
 * @LastEditors: zbx
 * @Description: 员工管理
 * @FilePath: \management\src\view\work-order\addOrder.vue
-->
<template>
	<div class="addOrder bgwhite">
		<p class="addTitle font18 center greyBorder">{{ title }}</p>

		<div class="formZone">
			<Form
				:model="pageForm"
				:rules="pageRule"
				:label-width="120"
				ref="pageForm"
			>
				<FormItem prop="workOrderTitle" label="工单标题">
					<Input
						placeholder="请输入标题"
						clearable
						style="width: 100%"
						maxlength="100"
						v-model="pageForm.workOrderTitle"
					/>
				</FormItem>
				<div class="optionZone">
					<FormItem
						prop="requirementType"
						label="需求类型"
						v-if="orderType === 1"
					>
						<Select
							v-model="pageForm.requirementType"
							placeholder="请选择"
							style="width: 150px"
						>
							<Option
								v-for="item in demandTypeList"
								:value="item.code"
								:key="item.code"
								>{{ item.name }}</Option
							>
						</Select>
					</FormItem>
					<FormItem
						prop="configType"
						label="配置类型"
						v-if="orderType === 2"
					>
						<Select
							v-model="pageForm.configType"
							placeholder="请选择"
							style="width: 150px"
						>
							<Option
								v-for="item in configTypeList"
								:value="item.code"
								:key="item.code"
								>{{ item.name }}</Option
							>
						</Select>
					</FormItem>
					<FormItem
						prop="targetSystem"
						label="涉及系统名称"
						v-if="pageForm.requirementType !== 0"
					>
						<Select
							v-model="pageForm.targetSystem"
							placeholder="请选择"
							style="width: 150px"
						>
							<Option
								v-for="item in systemTypeList"
								:value="item.code"
								:key="item.code"
								>{{ item.name }}</Option
							>
						</Select>
					</FormItem>

					<!-- <FormItem
						prop="originalSponsor"
						label="原需求发起人"
						v-if="orderType === 2 || orderType === 3"
					>
						<Select
							v-model="pageForm.originalSponsor"
							filterable
							placeholder="请选择"
							style="width: 220px"
						>
							<Option
								v-for="item in userList"
								:value="item.code"
								:key="item.code"
								>{{ item.name }}</Option
							>
						</Select>
					</FormItem> -->
					<FormItem
						prop="originalSponsor"
						label="原需求发起人"
						v-if="orderType === 2 || orderType === 3"
					>
						<Input
							placeholder="请输入"
							clearable
							maxlength="20"
							v-model="pageForm.originalSponsor"
						/>
					</FormItem>

					<FormItem prop="planDate" label="计划完成日期">
						<DatePicker
							type="date"
							placeholder="请选择"
							style="width: 150"
							@on-change="dateChange"
							v-model="pageForm.planDate"
						></DatePicker>
					</FormItem>
				</div>
				<FormItem prop="workDescription" label="需求描述">
					<Input
						v-model="pageForm.workDescription"
						maxlength="300"
						:rows="4"
						show-word-limit
						type="textarea"
						placeholder="请输入"
						style="width: 100%"
					/>
				</FormItem>
				<FormItem label="上传附件">
					<Upload
						ref="upload"
						type="drag"
						action=""
						accept
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
								<span class="fileName">
									{{ item.fileName || item.name }}</span
								>
								<span class="deleteIcon" title="删除">
									<Icon
										type="ios-trash-outline"
										@click="handleRemove(item)"
									></Icon>
								</span>
							</li>
						</ul>
					</div>
				</FormItem>
			</Form>
		</div>
		<div class="btnZone center">
			<Button
				type="primary"
				:loading="confirmLoading"
				class="ml10"
				@click="submit()"
				>提交</Button
			>
		</div>
	</div>
</template>
<script>

import { orderApi } from "@/api/workOrder";
import { userApi, roleApi, getDictItems } from "@/api/system";

import { fileApi } from "@/api/fileUpload";
import { formatDate } from "@/libs/util";
import { handleBLob } from "@/libs/exportExcel";

export default {
	props: {
		pkWorkOrder: {
			required: false,
			type: String,
			default: "",
		},
		orderType: {
			required: true,
			default: 0,
		},
	},
	data() {
		return {
			orderTypeList: [
				{},
				{
					title: "系统需求工单",
					apiName: "addRequire",
				},
				{
					title: "参数配置工单",
					apiName: "addConfig",
				},
				{
					title: "系统缺陷工单",
					apiName: "addMaintenance",
				},
			],
			title: "",
			apiName: "",
			uploadList: [],
			pageForm: {},
			// 弹窗页面表单规则
			pageRule: {
				workOrderTitle: [
					{
						required: true,
						message: "请输入标题",
						trigger: "blur",
						type: "string",
					},
				],
				requirementType: [
					{
						required: true,
						message: "请选择",
						trigger: "change",
						type: "number",
					},
				],
				configType: [
					{
						required: true,
						message: "请选择",
						trigger: "change",
						type: "number",
					},
				],
				targetSystem: [
					{
						required: true,
						message: "请选择",
						trigger: "change",
						type: "number",
					},
				],
				originalSponsor: [
					{
						required: false,
						message: "请输入发起人",
						trigger: "blur",
					},
				],
				planDate: [
					{
						required: true,
						message: "请选择",
						trigger: "change",
						type: "date",
					},
				],
				workDescription: [
					{
						required: true,
						message: "请输入描述",
						trigger: "blur",
					},
				],
			},
			// 确认按钮loading
			confirmLoading: false,

			demandTypeList: [],
			configTypeList: [],
			systemTypeList: [],
			userList: [],
		};
	},
	created() {
		// console.log('-->',this.$route,'<-');
		// const pkWorkOrder = this.$route.query.pkWorkOrder;
		const pkWorkOrder = this.pkWorkOrder;

		if (pkWorkOrder) {
			this.getDetail(pkWorkOrder);
		} else {
			// this.orderType = Number(this.$route.query.orderType);
			this.initial();
		}
	},
	methods: {
		getDetail(pkWorkOrder) {
			orderApi
				.getDetail({ pkWorkOrder: pkWorkOrder })
				.then((res) => {
					this.pageForm = res.data;
					const temp = res.data;
					this.pageForm = {
						...temp,
						planDate: new Date(temp.planDate),
					};
					this.uploadList = this.pageForm.files || [];
					this.orderType = this.pageForm.workOrderType;
					this.initial();
				})
				.catch((err) => {
					console.log("-->", err, "<-");
					this.pageForm = {};
					this.uploadList = [];
				});
		},

		initial() {
			this.title = this.orderTypeList[this.orderType].title;
			this.apiName = this.orderTypeList[this.orderType].apiName;
			//

			this.comGetDictItems("requirement_type").then((res) => {
				this.demandTypeList = res || [
                    {
                        code:'1495674184813617153',
                        name:'系统优化'
                    }
                ];
			});
			this.comGetDictItems("setting_type").then((res) => {
				this.configTypeList = res || [
                    {
                        code:'1495676870959144961',
                        name:'增加用户'
                    },
                    {
                        code:'1495677096029691906',
                        name:'变更权限'
                    },
                ];
			});
			this.comGetDictItems("involved_system").then((res) => {
				this.systemTypeList = res|| [
                    {
                        code:'1495675817496780802',
                        name:'费控系统'
                    },
                    {
                        code:'1495676044446375937',
                        name:'会计引擎'
                    },
                ];
			});

			// 获取用户数据
			userApi
				.matchAllUserList()
				.then((res) => {
					const list = res.data || [];
					list.forEach((item) => {
						item.code = item.pkUser;
						item.name = `${item.username}-${item.realname}`;
					});
					this.userList = list;
				})
				.catch((err) => {
					this.userList = [];
				});
		},
		comGetDictItems(key) {
			if (!key) return;

			return new Promise((resolve, reject) => {
				getDictItems(key)
					.then((res) => {
						const list = res.data || [];
						list.forEach((item) => {
							item.code = item.value;
							item.name = item.text;
						});
						resolve(list);
					})
					.catch((err) => {
						// reject([]);
						resolve(null);
					});
			});
		},

		dateChange(value) {
			console.log("-->", value, "<-");
			// this.pageForm.planDate = value;
		},
		handleUpload(file) {
			// 当前文件调接口上传，成功后，拿到fileId,再push
			const params = this.getFormData({
				pkWorkOrder: null,
				file: file,
			});
			console.log("-params->", file, "<-");
			console.log("-params->", params, "<-");

			this.upLoading = true;

			fileApi
				.upLoadFile(params)
				.then((res) => {
					// console.log("-->", res, "<-");
					file.fileId = res.data;
					this.uploadList.push(file);
					this.$Message.success("附件已上传");
					this.upLoading = false;
				})
				.catch((err) => {
					console.log("-->", err, "<-");
					this.upLoading = false;
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
						.deleteFile({ fileId: file.fileId })
						.then((res) => {
							this.uploadList.splice(index, 1);
							this.$Message.success("附件已删除");
							this.$Modal.remove();
						})
						.catch((err) => {
							this.$Modal.remove();
						});
				},
			});
		},
		downLoadFile(file) {
			fileApi
				.getFile({ fileId: file.fileId })
				.then((res) => {
					console.log("-下载->", res, "<-");
					handleBLob(res);
				})
				.catch((err) => {
					console.log("-->", err, "<-");
				});
		},
		getFormData(params) {
			let fdata = new FormData();
			for (let key in params) {
				params[key] && fdata.append(key, params[key]);
			}
			return fdata;
		},

		submit() {
			this.pageForm.fileIds = this.uploadList.map((item) => {
				return item.fileId;
			});

			console.log("-->", this.pageForm, "<-");

			this.$refs.pageForm.validate((v) => {
				if (v) {
					this.confirmLoading = true;
					// 区别接口todo
					orderApi[this.apiName]({
						...this.pageForm,
						planDate: formatDate(this.pageForm.planDate),
					})
						.then((res) => {
							this.confirmLoading = false;
							// goback
							// this.$router.go(-1);
							this.$emit("submitClick", {});
							this.$Message.success("提交成功");
						})
						.catch((err) => {
							console.log("-->", err, "<-");

							this.confirmLoading = false;
						});
				} else {
					console.log("校验失败");
				}
			});
		},
	},
	mounted() {},
};
</script>
<style  lang="less">
.addOrder {
	// height: 100%;
	padding: 0px;
	.addTitle {
		padding: 5px;
		font-weight: 700;
	}
	.formZone {
		padding: 20px 5px 0;
		width: 88%;
		.optionZone {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
		}
	}
	.btnZone {
		padding: 0 0 20px 120px;
		width: 88%;
	}
	.uploadList {
		ul {
			margin-left: 30px;
			height: 100px;
			overflow: auto;
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
				// .fileName {
				// 	text-decoration: underline;
				// 	cursor: pointer;
				// }
				.deleteIcon {
					display: inline-block;
					cursor: pointer;
				}
			}
		}
	}
}
</style>