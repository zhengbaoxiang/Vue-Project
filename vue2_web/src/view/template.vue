<!--
 * @Descripttion: 通用模板
 * @version: 2.0.0
 * @Author: zbx
 * @Date: 2021-11-18 15:41:51
 * @LastEditors: zbx
 * @LastEditTime: 2023-08-21 18:00:30
-->
<template>
	<div class="templateC">
		<div style="padding: 20px 0">
			<Form inline>
				<FormItem>
					员工姓名:
					<Input
						placeholder="请输入"
						style="width: 130px"
						clearable
						v-model="pageInfo.data.name"
					/>
				</FormItem>
				<FormItem>
					满意度:
					<Select
						placeholder="请选择"
						style="width: 100px"
						v-model="pageInfo.data.comment"
						clearable
					>
						<Option :value="0">未评价</Option>
						<Option :value="1">非常满意</Option>
						<Option :value="2">满意</Option>
						<Option :value="3">不满意</Option>
					</Select>
				</FormItem>
				<FormItem>
					发起人:
					<Select
						v-model="pageInfo.data.senderId"
						placeholder="请选择"
						style="width: 130px"
						clearable
						filterable
					>
						<Option
							v-for="item in userList"
							:value="item.code"
							:key="item.code"
							>{{ item.name }}</Option
						>
					</Select>
				</FormItem>
				<FormItem>
					时间范围:
					<DatePicker
						type="daterange"
						split-panels
						placeholder="请选择时间范围"
						@on-change="dateSelect"
						style="width: 220px"
						v-model="daterange"
						format="yyyy-MM-dd"
					></DatePicker>
				</FormItem>

				<FormItem>
					<!-- accept="image/png, image/jpeg"  -->
					<Upload action="image/upload" :before-upload="beforeUpload" multiple>
						<Button style="width: 150px" type="primary"
							>点击上传</Button
						>
						<p>{{ fileObj.fileName }}</p>
					</Upload>
				</FormItem>

				<Button
					type="primary"
					icon="md-search"
					class="ml10"
					@click="lookUp"
					>查询</Button
				>
				<Button class="ml10" @click="reset">重置</Button>
				<Button type="warning" class="ml10" @click="toAdd">新增</Button>
				<Button
					type="success"
					class="ml10"
					@click="exportExcel"
					:loading="exportLoading"
					>导出</Button
				>
				<Button type="error" class="ml10" @click="regTest">正则</Button>
				<Button type="error" class="ml10 test" @click="htmlCapture"
					>转图片</Button
				>
				<Button class="ml10" @click="getApi">getApi</Button>
				<Button class="ml10" @click="getFileList">getFileList</Button>
			</Form>
		</div>
		<Table
			:data="tableList"
			:columns="tableColumn"
			:loading="tableLoading"
			stripe
			border
			max-height="750"
		>
			<template slot="operate" slot-scope="{ row }">
				<Button
					type="warning"
					@click="toEdit(row)"
					icon="md-create"
				></Button>
				<Button
					type="error"
					@click="del(row)"
					class="ml10"
					icon="ios-trash-outline"
				></Button>
			</template>
		</Table>
		<div style="padding: 20px 0; text-align: right">
			<Page
				:current="pageInfo.pageNum"
				:page-size="pageInfo.pageSize"
				:total="pageInfo.total"
				show-elevator
				show-total
				show-sizer
				:page-size-opts="[10, 20, 30, 40, 50]"
				@on-change="changePage"
				@on-page-size-change="changePageSize"
			></Page>
		</div>
	
		<Modal
			v-model="showPageModal"
			:title="pageForm.id ? '编辑' : '新增'"
			:mask-closable="false"
			class="modalClass"
		>
			<Form
				:model="pageForm"
				:rules="pageRule"
				:label-width="120"
				ref="pageForm"
			>
				<FormItem prop="name" label="名称">
					<Input
						v-model="pageForm.name"
						placeholder="请输入"
						style="width: 300px"
					/>
				</FormItem>
				<FormItem prop="country" label="国家">
					<Input
						v-model="pageForm.country"
						placeholder="请输入"
						style="width: 300px"
					/>
				</FormItem>
				<FormItem prop="alexa" label="alexa">
					<Input
						v-model="pageForm.alexa"
						placeholder="请输入"
						style="width: 300px"
					/>
				</FormItem>

				<!-- <FormItem prop="url" label="类型">
					<Select
						v-model="pageForm.url"
						placeholder="请选择"
						style="width: 300px"
					>
						<Option
							v-for="item in userList"
							:value="item.code"
							:key="item.code"
							>{{ item.name }}</Option
						>
					</Select>
				</FormItem> -->
				<!-- <FormItem prop="belongDate" label="所属日期">
					<DatePicker
						type="date"
						placeholder="请选择日期"
						style="width: 300px"
						@on-change="dateChange"
						v-model="pageForm.belongDate"
					></DatePicker>
				</FormItem> -->

				<FormItem prop="url" label="备注">
					<Input
						v-model="pageForm.url"
						maxlength="300"
						:rows="4"
						show-word-limit
						type="textarea"
						placeholder="简要说明"
						style="width: 300px"
					/>
				</FormItem>
			</Form>
			<template slot="footer">
				<Button @click="closePageModal">关闭</Button>
				<Button
					@click="confirmPage"
					type="primary"
					:loading="confirmLoading"
					>确定</Button
				>
			</template>
		</Modal>
        <div>
			<img :src="base64Str" alt="" style="max-height: 600px" />
		</div>
		<div>{{ res.data }}</div>
		<div>{{ res }}</div>
        <div class="imgListCon">
            <img :src="'http://localhost:8094/nodeApi/test/getFile/?id=' + item.id"  :alt="item.filename" 
            v-for="item in fileList" :key="item.id"
            style="width: 200px;height:150px"
            >
        </div>
	</div>
</template>
<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import { convertToImage } from "@/libs/util";
import { handleBLob } from "@/libs/exportExcel";
import { testApi } from "@/api/test";
export default {
	computed: {
		// 映射 this.auth 为 store.state.user.auth
		...mapState({
            // 获取模块数据，必须加上模块名；使用箭头函数简洁
			auth: (state) => state.user.auth,
			// userName: (state) => state.user.userName,
			// 直接传字符串参数 'userName' 等同于 `state => state.userName`
			userName1: "userName",
			// 为了能够使用 `this` 获取局部状态，必须使用常规函数
			countPlusLocalState(state) {
				return state.count + this.localCount;
			},
		}),

		// 把 `this.userName` 映射为 `this.$store.getters.userName`
		...mapGetters(["userName"]),
		...mapGetters({
			userName2: "userName",
		}),
		// 自定义计算属性
		selfname() {
			return "user:" + this.userName;
		},
	},
	data() {
		return {
			// 表格列表
			tableList: [],
			// 表格配置
			tableColumn: [
				{
					align: "center",
					title: "id",
					key: "id",
					minWidth: 40,
				},
				{
					align: "center",
					title: "名称",
					key: "name",
					minWidth: 80,
				},
				{
					align: "center",
					title: "类型",
					key: "country",
					minWidth: 80,
				},
				{
					align: "center",
					title: "alexa",
					key: "alexa",
					minWidth: 40,
				},
				{
					align: "center",
					title: "备注",
					key: "url",
					minWidth: 100,
				},
				{
					align: "center",
					title: "操作",
					slot: "operate",
					fixed: "right",
					minWidth: 60,
				},
			],
			// 表格loading
			tableLoading: false,
			// 查询信息
			pageInfo: {
				pageNum: 1,
				pageSize: 10,
				total: 0,
				data: {},
			},
			// 页面表单
			pageForm: {
				subjectId: null,
				taxItem: "",
				beforeCont: "",
				afterCont: "",
				alterationId: null,
				majorName: "",
				taxSubjectCode: "",
			},
			// 页面表单规则
			pageRule: {
				userName: [
					{
						required: true,
						message: "请输入",
						trigger: "blur",
					},
				],
				userCode: [
					{
						required: true,
						message: "请选择",
						trigger: "change",
					},
				],

				belongDate: [
					{
						required: true,
						message: "请选择",
						trigger: "blur",
						type: "string",
					},
				],
				remark: [
					{
						required: false,
						message: "请输入",
						trigger: "blur",
					},
				],
			},
			// 展示页面modal
			showPageModal: false,
			// 确认按钮loading
			confirmLoading: false,
			// 导出loading
			exportLoading: false,
			daterange: [],
			userList: [
				{
					code: "111",
					name: "张三",
				},
				{
					code: "222",
					name: "李四",
				},
			],
			base64Str: null,
			fileObj: {},
			res: {},
            localCount:0,
            fileList:[]
		};
	},
	methods: {
		// 将 `this.handleLogin()` 映射为 `this.$store.dispatch('handleLogin')`
		...mapActions(["handleLogin"]),
		...mapActions({
			handleLogin2: "handleLogin",
		}),

		// 将 `this.setUserInfo(val)` 映射为 `this.$store.commit('setUserInfo',val)`
		...mapMutations(["setUserInfo"]),
		...mapMutations({
			setToken2: "setToken",
		}),
		// 获取表格数据
		getTableList() {
			this.tableLoading = true;
			testApi
				.getList(this.pageInfo)
				.then((res) => {
					this.tableList = res.data.list || [];
					this.pageInfo.total = res.data.total || 0;
					this.tableLoading = false;
				})
				.catch((err) => {
					this.$Message.error(err.msg);
					this.tableLoading = false;
					this.tableList = [
						{
							id: 123,
							userName: "邱淑芬",
							userCode: "111",
							belongDate: "2021-01-22",
							remark: "备注不需要特别长",
						},
					];
				});
		},
		regTest() {
			try {
				// 需双重转义 或中括号包裹
				const urlReg = new RegExp("([?]token=([A-z0-9%]+))#/", "ig");
				// const urlReg = /(\?token=([A-z0-9%]+))#\//ig
				const str =
					" http://172.31.227.198:8111/kbadminmgr/?token=QUU1NTVDQkVBMzZDODAyQzRCQ0E5QjZERjg0RTc3NjFDRDc2MTBEMDIwODNERjFGODIyOTNBMDUzRTk4QzJDQw%3D%3D#/ ";

				console.log("-urlReg->", urlReg, "<-");
				console.log("-test->", urlReg.test(str), "<-");

				console.log("-RegExp.$1->", RegExp.$1, "<-");
				console.log("-RegExp.$2->", RegExp.$2, "<-");

				urlReg.lastIndex = 0; // 属性 用于规定下次匹配的起始位置,不重置，则继续向后匹配，返回null
				const execResult = urlReg.exec(str);
				console.log("-execResult->", execResult, "<-");

				//  第一个是匹配值，后边是括号分组内容
				// exp=[
				//     0: "?token=QUU1NTVDQkVBMzZDODAyQzRCQ0E5QjZERjg0RTc3NjFDRDc2MTBEMDIwODNERjFGODIyOTNBMDUzRTk4QzJDQw%3D%3D#/",
				//     1: "?token=QUU1NTVDQkVBMzZDODAyQzRCQ0E5QjZERjg0RTc3NjFDRDc2MTBEMDIwODNERjFGODIyOTNBMDUzRTk4QzJDQw%3D%3D"
				//     2: "QUU1NTVDQkVBMzZDODAyQzRCQ0E5QjZERjg0RTc3NjFDRDc2MTBEMDIwODNERjFGODIyOTNBMDUzRTk4QzJDQw%3D%3D"
				//     ]

				// 全局匹配g仅返回所有匹配的值，无法获取子表达式分组内容，非全局匹配则跟exec一致，会返回子表达式分组内容
				console.log("-str-match->", str.match(urlReg), "<-");

				console.log("-replace->", str.replace(urlReg, "aaa"), "<-");
			} catch (error) {
				console.log("-->", error, "<-");
			}
		},
		htmlCapture() {
			// 调用函数，取到截图的二进制数据，对图片进行处理（保存本地、展示等）
			let element = document.body;
			// element = document.getElementsByClassName('ivu-table-wrapper')[0]
			convertToImage(element).then((base64) => {
				// console.log("-convertToImage>", base64, "<");
				this.base64Str = base64;
			});
		},
		getApi() {
			const params = {
				id: 3,
			};
			testApi.getDetail(params).then((res) => {
                this.res = res;
			});
		},
        getFileList (){
            testApi.getFilelist().then((res) => {
                console.log("->", res, "<");
				this.fileList = res.data.list;
			});
        },
		// 时间组件改变值
		dateSelect(value) {
			console.log("dateSelect", value, this.daterange);
			this.daterange = value;

			this.pageInfo.data.startTime = this.daterange[0];
			this.pageInfo.data.endTime = this.daterange[1];
		},
		dateChange(value) {
			// console.log("-->", value, "<-");
			// console.log("-->", formatDate(value), "<-");
			this.pageForm.belongDate = value;
		},
		// 导出
		exportExcel() {
			//接口拿blob
			const params = {
				// fileName: "123.jpg",
				// fileName: "123.html",
				fileName: "1234.xls",
				// fileName: "123.zip",
			};
			testApi
				.getFile(params)
				.then((res) => {
					handleBLob(res);
				})
				.catch((err) => {
					console.log("->", err, "<");
				});
		},
		beforeUpload(file) {
			console.log("-beforeUpload-->", file, "<---");
			this.fileObj.fileName = file.name;
			this.fileObj.file = file;
			// const reader = new FileReader();
			// reader.onload = (event) => {
			// 	const insideSrc = event.srcElement.result;
			// };
			// reader.readAsDataURL(file);
			const formdata = this.getFormData(this.fileObj);
			testApi
				.uploadFile(formdata)
				.then((res) => {
					console.log("->", res, "<");
					this.$Message.success("成功");
				})
				.catch((err) => {
					console.log("->", err, "<");
				});

			return false;
		},
		getFormData(params) {
			let fdata = new FormData();
			for (let key in params) {
				params[key] && fdata.append(key, params[key]);
			}
			return fdata;
		},

		// 去新增
		toAdd() {
			this.pageForm = {
				id: null,
			};
			this.$refs.pageForm.resetFields();
			this.showPageModal = true;
		},
		// 去编辑
		toEdit(r = {}) {
			this.pageForm = {
				...r,
				otherPer: "asdfj",
			};
			this.$refs.pageForm.resetFields();
			this.showPageModal = true;
		},
		// 添加
		add() {
			this.confirmLoading = true;
			testApi
				.add({
					...this.pageForm,
				})
				.then((res) => {
					this.$Message.success(res.msg);
					this.confirmLoading = false;
					this.showPageModal = false;
					this.getTableList();
				})
				.catch((err) => {
					this.confirmLoading = false;
				});
		},
		// 编辑
		edit() {
			this.confirmLoading = true;
			testApi
				.update({
					...this.pageForm,
				})
				.then((res) => {
					this.$Message.success("编辑成功");
					this.confirmLoading = false;
					this.showPageModal = false;
					this.getTableList();
				})
				.catch((err) => {
					this.confirmLoading = false;
				});
		},
		// 确认
		confirmPage() {
			this.$refs.pageForm.validate((v) => {
				if (v) {
					// 编辑
					if (this.pageForm.id) {
						this.edit();
						// 添加
					} else {
						this.add();
					}
				}
			});
		},
		// 关闭弹窗
		closePageModal() {
			this.showPageModal = false;
		},
		// 删除
		del(r) {
			this.$Modal.confirm({
				title: "提示",
				content: "确定删除此条数据吗？",
				loading: true,
				onOk: () => {
					testApi
						.delete({ id: r.id })
						.then((res) => {
							this.$Message.success("删除成功");
							this.$Modal.remove();
							this.getTableList();
						})
						.catch((err) => {
							this.$Modal.remove();
						});
				},
			});
		},
		// 切换页面
		changePage(p) {
			this.pageInfo.pageNum = p;
			this.getTableList();
		},
		// 且页面大小
		changePageSize(ps) {
			this.pageInfo.pageSize = ps;
			this.pageInfo.pageNum = 1;
			this.getTableList();
		},
		// 查询
		lookUp() {
			this.pageInfo.pageNum = 1;
			this.getTableList();
		},
		// 重置
		reset() {
			this.pageInfo.pageNum = 1;
			this.getTableList();
		},
	},
	mounted() {
		this.getTableList();
	},
};
</script>

<style lang="less">
.templateC {
	.test {
		color: rgb(0, 4, 255);
		// 直接使用变量是报错的，当前文件未定义，需要导入混入index.less或者config中共享之后才能用
		// color: @primary-color;
		color: @myprimary;
		color: @color-t;
	}
}
</style>