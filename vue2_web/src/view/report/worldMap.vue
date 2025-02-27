<template>
<div class="mapCon">
	<div id="worldMap" ref="worldMap" style="width:100%;height:100%"></div>
</div>
</template>
<script>
import * as echarts from "echarts";
import geoJson from "@/static/china.json";
import worldGeoJson from "@/static/eckert3-world.json";
import worldData from "@/static/worldData.json";
import { rtAlsApi } from "@/api/chart-graphic";
export default {
	data() {
		return {
			myChart: null,
		};
	},
	created() {},
	mounted() {
		this.initial();
	},
    destroyed(){
        window.removeEventListener("resize")
    },
	methods: {
		initial() {
			// console.log("geoJson", geoJson);
			// echarts.registerMap("china", geoJson);
			echarts.registerMap("world", worldGeoJson);
			this.myChart = echarts.init(this.$refs.worldMap);

             window.addEventListener("resize", (e) => {
				try {
					this.myChart && this.myChart.resize();
				} catch (error) {
					console.log("->", error);
				}
			});

			this.getData();
		},
		getData() {
			// rtAlsApi
			// 	.provinceInfo().then((res) => {
			// 		const list = (res.data && res.data.provinces) || [];
			// 		let data = list.map((item) => {
			// 			return {
			// 				name: item.provinceName,
			// 				value: item.avgReqTime,
			// 				itemStyle: {
			// 					"background-color": `${item.colorStr}`,
			// 				},
			// 			};
			// 		});
			// 		this.drawMap(data, "worldMap");
			// 	});
			let data = worldData.data;
			this.drawMap(data, "worldMap");
		},
		drawMap(data, domId) {
			// const chartDom = document.getElementById(domId);
			// const chartDom = this.$refs.worldMap;
			// this.myChart = echarts.init(chartDom);
			const option = {
				tooltip: {
					trigger: "item",
					borderColor: "#333",
					borderWidth: 0,
					formatter: (params) => {
						if (!params.data) return null;
						return `${params.name}<br/>数据：${
							params.value || 0
						} (单位)`;
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
				// 		{ min: 9999, label: ">9999" },
				// 		{ gte: 3000, lte: 9999, label: "1000~9999" },
				// 		{ lt: 3000, label: "<1000" },
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
					show: true,
					min: 0,
					max: 9999,
					inRange: {
						color: [
							"#fff7e7",
							"#fff3e7",
							"#ffe7c6",
							"#ffd78c",
							"#ffae10",
							"#f46d43",
							"#d73027",
							"#a50026",
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
					name: "国家",
					type: "map",
					map: "world",
					roam: true, // 如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
					center: [480, -210],
					scaleLimit: {
						max: 8,
						min: 0.4,
					},
					zoom: 1.2,
					emphasis: {
						itemStyle: {
							areaColor: "#fff",
						},
						label: {
							show: true,
							formatter: (params) => {
								if (!params.data) return null;
								let name = params.name;
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
						show: false,
						position: "inside",
						// position: ['50%', '50%'],
						rotate: 0,
						offset: [0, 0],
						formatter: (params) => {
							let name = params.name;
							if (!name) {
								console.log("-无name>", params);
								return "";
							} else if (!params.data) {
								// console.log('-无data>',params)
								return "";
							}
							return name;
						},
					},
					data: data,
					// 自定义名称映射
					nameMap: worldData.nameMap,
				},
			};
			this.myChart.setOption(option, { notMerge: true });
		},
	},
};
</script>

<style lang="less">
.mapCon {
	border: 1px solid grey;
    margin: 10px;
    width:~'calc(100% - 20px)';
    height:~'calc(100% - 20px)';
}
</style>
