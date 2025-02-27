<!--
 * @Date: 2022-02-24 15:59:42
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-06 11:17:09
 * @FilePath: \后台系统通用\src\view\login\SSOLogin.vue
-->
 <style lang="less">
</style>
<template>
	<div class="login">
		<img :src="imgsrc" alt="图片出错了" style="width: 100%" />
		<!-- <Card title="登录方式" class="choose-login" v-if="!accountLogin">
			<Row style="padding-top: 10px">
				<i-col span="12" style="text-align: center">
					<Button
						type="info"
						size="large"
						@click="checkTicket"
						class="btnst"
						:loading="confirmLoading"
						>SSO登录</Button
					>
				</i-col>
				<i-col span="12" style="text-align: center">
					<Button
						type="info"
						size="large"
						@click="toAccountLogin"
						class="btnst"
						:loading="confirmLoading"
						>账户密码登录</Button
					>
				</i-col>
			</Row>
		</Card> -->
		<div class="login_m center" v-if="accountLogin">
			<Card title="用户登录" class="login-card">
				<Form
					:label-width="100"
					ref="pageForm"
					:model="pageForm"
					:rules="pageRule"
				>
					<FormItem label="用户名" prop="username">
						<Input
							icon="md-contact"
							v-model="pageForm.username"
							placeholder="请输入用户名"
							@keyup.enter.native="login"
							style="width: 200px"
							clearable
						></Input>
					</FormItem>
					<FormItem label="密码" prop="password">
						<Input
							v-model="pageForm.password"
							placeholder="请输入密码"
							@keyup.enter.native="login"
							style="width: 200px"
							type="password"
							password
						></Input>
					</FormItem>
					<!-- <FormItem prop="code" label="验证码">
						<div
							class="flex"
							style="align-items: center; width: 200px"
						>
							<Input
								v-model="pageForm.code"
								@keyup.enter.native="login"
								placeholder="请输入验证码"
								class="flex-item"
							></Input>
							<img
								:src="vcodePic"
								alt="验证码"
								@click="getVcode"
								class="code-img"
							/>
						</div>
					</FormItem> -->
					<div style="padding: 0 40px 10px 40px; overflow: hidden">
						<!-- <a 
                        href="javascript:;"
                        style="float: right"
                        @click="jumpToRecover" 
                    >忘记密码</a> -->
						<Checkbox v-model="rememberMe" style="float: right"
							>记住密码</Checkbox
						>
					</div>
					<div style="text-align: center">
						<Button
							class="login-btn"
							type="info"
							@click="login"
							style="align-items: center; width: 200px"
							:loading="confirmLoading"
							>登录</Button
						>
					</div>
				</Form>
			</Card>
		</div>
	</div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import config from "@/config";

import imgsrc from "@/assets/images/df_info.gif";

import { getLocal, setLocal } from "@/libs/util";
import { getVcode } from "@/api/user";

export default {
	data() {
		return {
			imgsrc: imgsrc,
			accountLogin: false,

			ticket: null,
			loginUrl: config.loginUrl,
			confirmLoading: false,

			pageForm: {},
			pageRule: {
				username: [
					{
						required: true,
						message: "请输入用户名",
						trigger: "blur",
					},
				],
				password: [
					{
						required: true,
						message: "请输入密码",
						trigger: "blur",
					},
				],
				code: [
					{
						required: false,
						message: "验证码不能为空",
						trigger: "blur",
					},
				],
			},
			// 记住密码
			rememberMe: true,
			// 验证图
			vcodePic: "",
		};
	},
	computed: {	},
	created() {
		this.getTicket();
	},
	methods: {
		...mapActions(["handleTicketLogin", "handleLogin"]),
		getTicket() {
			// console.log("-location->", location, "<-");
			const search = window.location.search || "";
			const urlReg = new RegExp("ticket=[A-Za-z0-9]+", "ig");

			let match = urlReg.exec(search);
            console.log('-exec-match->',match,'<-');
			if (match) {
				this.ticket = match[0].split("=")[1];
				setLocal("ticket", this.ticket);
                //  this.checkTicket();
			} else {
				this.ticket = getLocal("ticket");
			}
			console.log("-getTicket->", this.ticket, "<-");

			// 自动调接口校验,关闭这个则手动点击按钮登录
			this.checkTicket();
			return;
		},
		// 调接口校验
		checkTicket(ticket) {
			console.log("-checkTicket->", this.ticket, "<-");
			if (this.ticket) {
				//调接口验证,此接口相当于登录接口
				this.ticketLogin(this.ticket);
				// window.open(this.loginUrl, "_self");
			} else {
				window.open(this.loginUrl, "_self");
			}
		},
		// 登录
		ticketLogin(ticket) {
			this.confirmLoading = true;
			// this.$Spin.show();
			this.handleTicketLogin(ticket)
				.then((res) => {
					this.confirmLoading = false;
					// this.$Spin.hide();
					this.$router.push({
						path: "/",
					});
				})
				.catch((err) => {
					this.confirmLoading = false;
					// this.$Spin.hide();
					console.log("-->", err, "<-");
				});
		},
		toAccountLogin() {
			this.accountLogin = true;
		},

		//账密登录
		login() {
			console.log("rememberMe", this.rememberMe);

			this.$refs.pageForm.validate((v) => {
				if (v) {
					this.confirmLoading = true;
					this.handleLogin({
						...this.pageForm,
						// password:md5(this.pageForm.password)
					})
						.then((res) => {
							this.confirmLoading = false;

							// 登录成功记住密码
							if (this.rememberMe) {
								const loginInfo = {
									username: this.pageForm.username,
									password: this.pageForm.password,
									key: this.pageForm.key,
									code: this.pageForm.code,
								};
								setLocal("loginInfo", loginInfo);
							} else {
								setLocal("loginInfo", "");
							}

							this.$router.push({
								path: "/",
							});
						})
						.catch((err) => {
							this.$Message.error(err.msg);
							this.confirmLoading = false;

							// this.getVcode();
						});
				} else {
					console.log("校验失败");
					// this.getVcode();
				}
			});
		},
		// 获取验证码
		getVcode() {
			getVcode({
				oldKey: this.pageForm.key || null,
			})
				.then((res) => {
					this.vcodePic = res.data.image;
					this.pageForm.key = res.data.key;
				})
				.catch((err) => {
					this.$Message.error(err.msg);
				});
		},
	},
	mounted() {
		const loginInfo = getLocal("loginInfo");
		this.pageForm = {
			username: loginInfo.username || "",
			password: loginInfo.password || "",
		};
	},
};
</script>

<style scoped lang="less">
.choose-login {
	width: 320px;
	height: 150px;
	/* position: absolute; */
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	margin: auto;
}

.login_m {
	/* 定位居中 */
	position: fixed;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	z-index: 2;
	img {
		width: 180px;
	}
	.login_logo {
		font-size: 20px;
		font-weight: bolder;
		margin: 20px 0;
		color: #ffffff;
	}
	.login-card {
		width: 400px;
		height: 300px;
		/* position: absolute; */
		margin: auto;
		text-align: left;
		.code-img {
			width: 120px;
			height: 40px;
		}
	}
}

.btnst {
	background-color: #ea5404;
	border-color: #ea5404;
}
.btnst:hover {
	opacity: 0.9;
}
</style>
