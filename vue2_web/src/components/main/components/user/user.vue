<!--
 * @Date: 2022-04-07 11:16:03
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-08 13:08:22
 * @FilePath: \management\src\components\main\components\user\user.vue
-->
<template>
	<div class="user-avatar-dropdown">
		<div style="display: inline-block; padding: 0 20px">
			<fullscreen v-model="isFullscreen" style="margin-right: 10px" />

			<!-- <Badge >
        <Icon type="md-notifications" size="25" />
        <Icon type="md-flower"   size="25"/>
      </Badge> -->
		</div>
		<Dropdown @on-click="handleClick">
			<!-- <Avatar :src="userAvatar" /> -->
			<span>{{ userName }} {{ roleName ? `(${roleName})` : "" }}</span>
			<Icon :size="18" type="md-arrow-dropdown"></Icon>
			<DropdownMenu slot="list">
				<!-- <DropdownItem name="resetPsw" style="border-top: 1px solid #eee;">修改密码</DropdownItem>  -->
				<DropdownItem name="logout">退出登录</DropdownItem>
			</DropdownMenu>
		</Dropdown>
		<reset-modal ref="resetModal" @confirm="logout" />
	</div>
</template>

<script>
import "./user.less";
import { mapActions, mapState, mapMutations } from "vuex";
import resetModal from "./resetPsw/resetPsw.vue";
import Fullscreen from "../fullscreen";

export default {
	name: "User",
	components: {
		resetModal,
		Fullscreen,
	},
	props: {
		userAvatar: {
			type: String,
			default: "",
		},
		messageUnreadCount: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			isFullscreen: false,
		};
	},
	computed: {
		...mapState({
			userName: (state) => state.user.userName,
			roleName: (state) => state.user.roleName,
		}),
	},
	methods: {
		...mapActions(["handleLogOut"]),
		...mapMutations(["setToken"]),
		logout() {
			this.handleLogOut().then((token) => {
				// console.log('here', token);
				// console.log('here-getToken()', getToken());

				// 1 cas登录，调登出地址自动返回
				// var url = `${this.$config.authHost}/cas/logoutV2?authServiceId=${this.$config.authServiceId}&token=${token}`;
				// window.location.href = url;

				// 2 账号登录，直接返回普通登录页，
				this.$router.push({
					name: "login",
				});
			});
		},
		message() {
			this.$router.push({
				name: "message_page",
			});
		},
		handleClick(name) {
			switch (name) {
				case "logout":
					this.logout();
					break;
				case "message":
					this.message();
					break;
				case "resetPsw":
					this.$refs.resetModal.resetPsw();
					break;
			}
		},
	},
};
</script>
