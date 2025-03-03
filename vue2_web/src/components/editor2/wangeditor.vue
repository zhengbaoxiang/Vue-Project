<!--
 * @Date: 2022-07-15 14:45:09
 * @LastEditors: zbx
 * @LastEditTime: 2022-07-29 10:20:21
 * @descript: 文件描述
-->
<template>
	<div class="editor-wrapper" style="border: 1px solid #ccc">
		<div :id="toolbarId" style="border-bottom: 1px solid #ccc"></div>
		<div :id="editorId" style="height: 600px; overflow-y: hidden"></div>
	</div>
</template>

<script>
import "@wangeditor/editor/dist/css/style.css";
import { createEditor, createToolbar, DomEditor } from "@wangeditor/editor";

// import Editor from "wangeditor";
// import "wangeditor/release/wangEditor.min.css";
import { oneOf } from "@/libs/tools";

export default {
	name: "wangEditor",
	props: {
		workNumber: {
			type: String,
			default: "",
		},
		alarmId: {
			type: String,
			default: "",
		},
		value: {
			type: String,
			default: "",
		},
		readOnly: {
			type: Boolean,
			default: false,
		},
		/**
		 * 绑定的值的类型, enum: ['html', 'text']
		 */
		valueType: {
			type: String,
			default: "html",
			validator: (val) => {
				return oneOf(val, ["html", "text"]);
			},
		},
		/**
		 * @description 设置change事件触发时间间隔
		 */
		changeInterval: {
			type: Number,
			default: 200,
		},
		/**
		 * @description 是否开启本地存储
		 */
		cache: {
			type: Boolean,
			default: true,
		},
	},
	computed: {
		editorId() {
			return `editor${this._uid}`;
		},
		toolbarId() {
			return `toolbar${this._uid}`;
		},
	},
	methods: {
		initial() {
			const editorConfig = {
				placeholder: "请输入内容",
				readOnly: this.readOnly,
				autoFocus: true,
				scroll: true,
				maxLength: 1000,
				onMaxLength: (editor) => {
					this.$Message.destroy();
					this.$Message.error("字数超过限制");
				},
				onCreated: (editor) => {
					// 不需要在这里设置默认值，会换行
					let html = this.value || "";
					// editor.clear();
					// editor.setHtml(html);
					// editor.insertText(html);
					// editor.dangerouslyInsertHtml(html);
				},
				onChange: (editor) => {
					// 当编辑器选区、内容变化时，即触发
					// console.log("content", editor.children);
					const html = editor.getHtml();
					// const text = editor.getText();
					// console.log("html>", html);
					// console.log("text>", text);
					this.$emit("on-change", { html });
				},
				MENU_CONF: {},
			};
			editorConfig.MENU_CONF["uploadImage"] = {
				// form-data fieldName ，默认值 'wangeditor-uploaded-image'
				fieldName: "file",
				// 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
				meta: {
					alarmId: this.alarmId,
					workNumber: this.workNumber,
				},
				metaWithUrl: false, // 将 meta 拼接到 url 参数中，默认 false
				withCredentials: true, // 跨域是否传递 cookie ，默认为 false
				// 自定义增加 http  header
				// headers: {
				//     Accept: 'text/x-json',
				//     otherKey: 'xxx'
				// },

				maxFileSize: 3 * 1024 * 1024, // 1M
				maxNumberOfFiles: 1,
				allowedFileTypes: ["image/*"],
				base64LimitSize: 5 * 1024, // 5kb

				server: "/api/alarmResult/uploadPic",
				// 回调函数
				onBeforeUpload(file) {
					// file 选中的文件，格式如 { key: file }
					console.log("-onBeforeUpload>", file);
					return file;
					// 可以 return
					// 1. return file 或者 new 一个 file ，接下来将上传
					// 2. return false ，不上传这个 file
				},
				// 如果你的服务端 response body 无法按照上文规定的格式，则无法插入图片，提示失败。
				// 但你可以使用 customInsert 来自定义插入图片,使用后不触发以下回调
				onSuccess(file, res) {
					console.log(`${file.name} 上传成功`, res);
				},
				// 单个文件上传失败
				onFailed(file, res) {
					console.log(`${file.name} 上传失败`, res);
				},
				// 上传错误，或者触发 timeout 超时
				onError(file, err, res) {
					console.log(`${file.name} 上传出错`, err, res);
				},

				// 自定义插入图片
				// customInsert(res, insertFn) {
				// 	// res 即服务端的返回结果
				// 	// 从 res 中找到 url alt href ，然后插图图片
				// 	insertFn(url, alt, href);
				// },

				// 不使用sever,自定义上传
				// async customUpload(file, insertFn) {
				//     // 1 file 即选中的文件
				//     // 2 自己实现上传，并得到图片 url alt href
				//     // 3 最后插入图片
				//     insertFn(url, alt, href)
				// }
			};

			// 创建编辑器
			const editor = createEditor({
				selector: "#" + this.editorId,
				config: editorConfig,
				mode: "simple", // default 或  'simple' 参考下文
				html: this.value || "", // 在创建时就设置好默认值
			});

			// 工具栏配置
			const toolbarConfig = {
				toolbarKeys: [
					"header1",
					"header2",
					"header3",
					"|",
					"bold",
					"underline",
					"italic",
					"color",
					"bgColor",
					"clearStyle",
					"|",
					"justifyLeft",
					"justifyRight",
					"justifyCenter",
					"|",
					// "insertLink",
					// {
					// 	key: "group-image",
					// 	title: "图片",
					// 	iconSvg:
					// 		'<svg viewBox="0 0 1024 1024"><path d="M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z"></path></svg>',
					// 	menuKeys: ["insertImage", "uploadImage"],
					// },
					"uploadImage",
					// "insertVideo",
					// "insertTable",
					// "codeBlock",
					"undo",
					"redo",
					"fullScreen",
				],
				// insertKeys: {
				// 	index: 15, // 插入的位置，基于当前的 toolbarKeys
				// 	keys: ["uploadImage"],
				// },
			};

			// 创建工具栏
			const toolbar = createToolbar({
				editor,
				selector: "#" + this.toolbarId,
				config: toolbarConfig,
				mode: "simple", // default 或 'simple' 参考下文
			});

			console.log("-getConfig>", toolbar.getConfig());

			// const toolbarKeys = toolbar.getConfig().toolbarKeys
			// const menuKey = editor.getAllMenuKeys()
			// console.log('-toolbarKeys>',toolbarKeys)
			// console.log('-menuKey>',menuKey)
		},
	},
	mounted() {
		this.initial();
	},
};
</script>

<style lang="less">
.editor-wrapper {
	z-index: 100 !important;
	height: 100%;
}
</style>
