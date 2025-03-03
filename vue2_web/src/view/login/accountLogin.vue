<template>
	<div class="login">
		<div class="bgCon">
			<img :src="backImg" alt="图片出错了" class="ImgContent" />
			<!-- <div class="backgroundImg"></div> -->
		</div>
		<div class="login_m center">
			<!-- <img :src="emLogo" alt="" /> -->
			<p class="login_title">后台管理系统</p>
			<Card title="用户登录" class="login-card">
				<Form ref="pageForm" :model="pageForm" :rules="pageRule">
					<FormItem prop="username">
						<span class="icon-container">
							<Icon :size="18" type="md-person" />
						</span>
						<Input
							icon="md-contact"
							v-model="pageForm.username"
							placeholder="请输入用户名"
							@keyup.enter.native="login"
							style="width: 100%"
							size="large"
							clearable
						></Input>
					</FormItem>
					<FormItem prop="password">
						<span class="icon-container">
							<Icon :size="18" type="ios-lock-outline" />
						</span>
						<Input
							v-model="pageForm.password"
							placeholder="请输入密码"
							@keyup.enter.native="login"
							style="width: 100%"
							type="password"
							size="large"
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
					<div style="padding: 0 10px 10px; overflow: hidden">
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
							style="align-items: center; width: 100%"
							:loading="confirmLoading"
							size="large"
							>登录</Button
						>
					</div>
				</Form>
			</Card>
		</div>
	</div>
</template>

<script>
// import md5 from 'js-md5'
import backImg from "@/assets/images/back.jpg";
// import emLogo from "@/assets/images/em-logo.png";

import { mapActions } from "vuex";
import { setLocal, getLocal } from "@/libs/util";
import { getVcode } from "@/api/user";

export default {
	components: {},
	data() {
		return {
			backImg: backImg,
			// emLogo: emLogo,
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
			confirmLoading: false,
		};
	},
	methods: {
		...mapActions(["handleLogin"]),
		// 登录
		login() {
			console.log("rememberMe", this.rememberMe);
			this.$refs.pageForm.validate((v) => {
				if (v) {
					this.confirmLoading = true;
					this.handleLogin({
						...this.pageForm,
						// password:md5(this.pageForm.password) //密码加密
					})
						.then((res) => {
							this.confirmLoading = false;
							// 登录成功记住密码
							if (this.rememberMe) {
								const loginInfo = {
									username: this.pageForm.username,
									password: this.pageForm.password,
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
							this.confirmLoading = false;
							// this.getVcode(); //重新获取验证码
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
		// 跳转去忘记密码
		// jumpToRecover() {
		//     this.$router.push({
		//         name: 'recover'
		//     });
		// }
	},
	mounted() {
		const loginInfo = getLocal("loginInfo");
		// console.log('本地存储的',loginInfo);

		this.pageForm = {
			username: loginInfo.username || "zbx",
			password: loginInfo.password || "123456",
			code: "",
			key: "",
		};
		// this.getVcode();
	},
};
</script>

 <style lang="less" >
.login {
	height: 100%;
	.bgCon {
		height: 50%;
		div.backgroundImg {
			width: 100%;
			height: 100%;
			// background: url("../../assets/images/bg.gif");
			background-repeat: repeat;
			background-size: 220px 220px;
		}
		img.ImgContent {
            width: 100%;
			height: 100%;
			// filter: blur(1px);
		}
	}

	.login_m {
		/* 定位居中 */
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -35%);
		z-index: 2;
		img {
			width: 180px;
		}
		.login_title {
			font-size: 20px;
			font-weight: bolder;
			margin: 20px 0;
			color: #ffffff;
		}
		.login-card {
			width: 400px;
			margin: auto;
			text-align: left;
			border-radius: 10px;
			.ivu-card-body {
				padding: 24px 30px;
			}
			.ivu-form {
				.ivu-form-item-content {
					padding: 0 20px 0 40px;
					border: 1px solid #dcdee2;
					border-radius: 4px;
					.icon-container {
						position: absolute;
						left: 10px;
						top: 5px;
					}
					.ivu-input-wrapper {
						vertical-align: top;
						input {
							border: none;
							outline: none;
							box-shadow: none;
							width: 100%;
						}
					}
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
		}
	}
}
</style>
