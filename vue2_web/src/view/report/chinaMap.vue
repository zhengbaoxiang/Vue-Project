<template>
	<div id="chinaMap" ref="chinaMap" class="echartContain"></div>
</template>
<script>
import * as echarts from "echarts";
import geoJson from "@/static/china.json";
import { rtAlsApi } from "@/api/chart-graphic";
export default {
	props: {
		globalParams: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	data() {
		return {
			isLoading: false,
		};
	},
	created() {},
	mounted() {
		this.lookUp();
	},
	methods: {
		// 查询
		lookUp() {
			// 中国地图
			this.provinceInfo();
		},
		// 获取地区/各省统计信息
		provinceInfo() {
			// console.log("geoJson", geoJson);
			echarts.registerMap("china", geoJson);
			rtAlsApi
				.provinceInfo({
					...this.globalParams,
				})
				.then((res) => {
					const list = (res.data && res.data.provinces) || [];
					let data = list.map((item) => {
						item.name = item.provinceName;
						return {
							name: item.provinceName,
							provinceId: item.provinceId,
							value: item.avgReqTime,
						};
					});
					this.drawMap(data, "chinaMap");
				});
		},
		drawMap(data, domId) {
			// const chartDom = document.getElementById(domId);
			const chartDom = this.$refs.chinaMap;
			const myChart = echarts.init(chartDom);

			const option = {
				tooltip: {
					trigger: "item",
					borderColor: "#333",
					borderWidth: 0,
					// formatter: '{b}<br/>{c} (毫秒)'
					formatter: (params) => {
						if (!params.data) return null;
						return `${params.name}<br/>请求耗时：${
							params.value || 0
						} (毫秒)`;
					},
				},
				// grid: {
				//     left: '0%',
				//     right: '0%',
				//     bottom: '0%',
				//     containLabel: true
				// },
				// visualMap: {
				// 	type: "piecewise",
				// 	splitNumber: 3, // 如果设置了 visualMap-piecewise.pieces 或者 visualMap-piecewise.categories，则 splitNumber 无效
				// 	pieces: [
				// 		{ min: 80, label: ">80ms" },
				// 		{ gte: 40, lte: 80, label: "40ms~80ms" },
				// 		{ lt: 40, label: "<40ms" },
				// 	],
				// 	inverse: true,
				// 	itemHeight: 12,
				// 	itemWidth: 12,
				// 	// text: ['80ms', '0'], //当有 text 时，label不显示。
				// 	textGap: 5,
				// 	itemGap: 20,
				// 	itemSymbol: "circle",
				// 	realtime: false,
				// 	calculable: false,
				// 	inRange: {
				// 		color: ["#FFDCC4", "#FF6600", "#C24A00"],
				// 	},
				// 	outOfRange: {
				// 		color: "#eee",
				// 	},
				// 	bottom: 20,
				// 	left: 20,
				// 	orient: "horizontal",
				// },
				visualMap: {
					show: false,
					min: 0,
					max: 2000,
					inRange: {
						color: [
							"#fff7e7",
							"#fff3e7",
							"#ffe7c6",
							"#ffd78c",
							"#ffae10",
							"#b57500",
							// "#f46d43",
							// "#d73027",
							// "#a50026",
						],
					},
					text: ["错误量", ""],
					textStyle: {
						color: "#333",
					},
					calculable: true,
					itemHeight: 120,
				},
				series: {
					name: "省份",
					type: "map",
					map: "china",
					roam: true, // 如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
					center: [104.5, 34],
					scaleLimit: {
						max: 4,
						min: 0.9,
					},
					zoom: 1.6,
					emphasis: {
						itemStyle: {
							areaColor: "#fff",
						},
						label: {
							show: true,
							formatter: (params) => {
								let name =
									params.name && params.name.slice(0, 2);
								if (name === "黑龙") {
									return "黑龙江";
								} else if (name === "内蒙") {
									return `内蒙古`;
								}
								return name;
							},
						},
					},
					select: {
						itemStyle: {
							areaColor: "#fff",
						},
					},
					label: {
						show: true,
						position: "inside",
						// position: ['50%', '50%'],
						rotate: 0,
						offset: [0, 0],
						formatter: (params) => {
							let name = params.name && params.name.slice(0, 2);
							if (name === "黑龙") {
								return "黑龙江";
							} else if (name === "内蒙") {
								return `内蒙古`;
							}
							return name;
						},
					},
					data: data,
					// 自定义名称映射
					nameMap: {
						// '上海市': 'Shanghai',
						// "山西省": 'Shanxi',
						// "陕西省": 'Shaanxi',
						// "内蒙古自治区": 'Nei Mongol',
						// "广西壮族自治区":'Guangxi',
						// "宁夏回族自治区":'Ningxia',
						// "西藏自治区":'Xizang',
						// "新疆维吾尔自治区":'Xinjiang',
						// "贵州省":'Guizhou',
					},
				},
			};
			myChart.setOption(option, { notMerge: true });
		},
	},
};
</script>

<style lang="less">
.chinaMap {
	width: 1005;
	height: 100%;
}
</style>
