<!--
 * @Date: 2021-10-09 09:35:17
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-22 09:29:13
 * @FilePath: \management\src\view\report\report.vue
-->
<template>
	<Layout class="home-contain">
		<Content class="home-Content">
			<div class="bottomChart clearfix" v-if="Loaded">
				<div class="outCard firstDataCon">
					<div class="cardZone cardClass clearfix">
						<p class="cardtitle">总体统计</p>
						<ul class="ulCon">
							<li class="dataCard">
								<p class="smallTitle">HTTP网络错误</p>
								<p class="numCon">
									<span class="numStr"
										>{{
											formatteTo3(
												totalStatistic.httpNetwork.num
											)
										}}
									</span>
									<span class="smallTitle"> 条</span>
								</p>
								<span class="dataIcon icon1"> </span>
							</li>
							<li class="dataCard">
								<p class="smallTitle">TCP网络错误</p>
								<p class="numCon">
									<span class="numStr"
										>{{
											formatteTo3(
												totalStatistic.tcpNetwork.num
											)
										}}
									</span>
									<span class="smallTitle"> 条</span>
								</p>
								<span class="dataIcon icon2"> </span>
							</li>
							<li class="dataCard">
								<p class="smallTitle">HTTP业务错误</p>
								<p class="numCon">
									<span class="numStr"
										>{{
											formatteTo3(
												totalStatistic.httpBusiness.num
											)
										}}
									</span>
									<span class="smallTitle"> 条</span>
								</p>
								<span class="dataIcon icon3"> </span>
							</li>
							<li class="dataCard">
								<p class="smallTitle">TCP业务错误</p>
								<p class="numCon">
									<span class="numStr"
										>{{
											formatteTo3(
												totalStatistic.tcpBusiness.num
											)
										}}
									</span>
									<span class="smallTitle"> 条</span>
								</p>
								<span class="dataIcon icon4"> </span>
							</li>
						</ul>
					</div>
				</div>
				<div class="outCard sevenDataCon">
					<div class="cardZone cardClass">
						<p class="cardtitle">中国地图</p>
						<div class="chartZone">
							<!-- <div id="chinaMap" class="echartContain"></div> -->
							<china-map :globalParams="globalParams"></china-map>
						</div>
					</div>
				</div>

				<div class="outCard cardClass secDataCon">
					<div class="cardZone leftPart">
						<p class="cardtitle">业务统计</p>
						<div class="chartZone">
							<div id="echartSubNode" class="echartContain"></div>
							<p class="totalNum">{{ subNodeStatisticTotal }}</p>
						</div>
					</div>
					<div class="cardZone rightPart">
						<p class="cardtitle">
							<span class="cardtitle">详细业务统计 </span>
							<span class="errorTimesTitle"> (错误次数)</span>
						</p>
						<div class="chartZone">
							<div
								id="echartLeafNode"
								class="echartContain"
							></div>
						</div>
					</div>
				</div>
				<div class="outCard thirdDataCon">
					<div class="cardZone cardClass">
						<p class="cardtitle">性能趋势图</p>
						<div class="chartZone">
							<div id="allTrend" class="echartContain"></div>
						</div>
					</div>
				</div>
				<div class="outCard fourDataCon">
					<div class="cardZone cardClass">
						<p class="cardtitle">趋势信息</p>
						<div class="operation">
							<label class="keli">颗粒度：</label>
							<Select
								v-model="intervalType"
								placeholder="展示数据"
								@on-change="timeDiffChange"
							>
								<Option
									v-for="item in intervalTypeList"
									:value="item.value"
									:key="item.value"
									>{{ item.label }}</Option
								>
							</Select>
							<Radio-group
								v-model="lineDataType"
								type="button"
								@on-change="chooseType"
							>
								<Radio :label="0">请求耗时</Radio>
								<Radio :label="1">100k耗时</Radio>
								<Radio :label="2">错误数</Radio>
							</Radio-group>
						</div>
						<div class="chartZone">
							<div id="trendInfo" class="echartContain"></div>
						</div>
					</div>
				</div>
				<div class="outCard fiveDataCon">
					<div class="cardZone cardClass">
						<p class="cardtitle">域名错误TOP5</p>
						<div class="chartZone">
							<div id="domainErr" class="echartContain"></div>
						</div>
					</div>
					<div class="cardZone cardClass">
						<p class="cardtitle">业务错误TOP5</p>
						<div class="chartZone">
							<div id="bussErr" class="echartContain"></div>
						</div>
					</div>
					<div class="cardZone cardClass">
						<p class="cardtitle">网络错误TOP5</p>
						<div class="chartZone">
							<div id="networkErr" class="echartContain"></div>
						</div>
					</div>
				</div>
				<div class="outCard sixDataCon">
					<div class="cardZone cardClass barCon">
						<p class="cardtitle">TOP20错误量用户</p>
						<div class="chartZone">
							<div id="errorUserBar" class="echartContain"></div>
						</div>
					</div>
					<!-- <div class="cardZone cardClass mapCon">
						<p class="cardtitle">中国地图</p>
						<div class="chartZone">
							<div id="chinaMap" class="echartContain"></div>
						</div>
					</div> -->
				</div>
			</div>
		</Content>
	</Layout>
</template>
<script>
import * as echarts from "echarts";
import { DateFormat, formatterPrize } from "@/libs/util";
import { overviewApi, rtAlsApi } from "@/api/chart-graphic";
import chinaMap from "./chinaMap.vue";
export default {
	components: { chinaMap },
	data() {
		return {
			// 查询参数
			globalParams: {},
			colorBy: [
				"#FF8533",
				"#6581FF",
				"#33CB88",
				"#FF5360",
				"#FFD045",
				"#fc8452",
				"#9a60b4",
				"#ea7ccc",
			],
			totalStatistic: {
				httpNetwork: {},
				tcpNetwork: {},
				httpBusiness: {},
				tcpBusiness: {},
			},
			subNodeStatisticTotal: null,

			intervalType: 5, // 趋势图的时间间隔
			// 1--每分钟，2--每刻钟  3--每半小时， 4-每小时， 5--每半天，6--每天
			intervalTypeList: [
				{
					value: 2,
					label: "15min",
				},
				{
					value: 4,
					label: "1h",
				},
				{
					value: 5,
					label: "6h",
				},
				{
					value: 6,
					label: "24h",
				},
			],
			lineDataType: 0,
			lineDataList: [],

			Loaded: false,
			timer: null,
		};
	},
	created() {},
	mounted() {
		this.lookUp();
	},
	methods: {
		handleSelect(value) {
			this.globalParams = value;
			this.lookUp();
		},
		// 查询
		lookUp() {
			this.Loaded = true;
			this.getDashBoard();
			// 中国地图 独立组件

			this.getNodeStatistic();
			this.getTrendDashboard();
			// 趋势信息图  有三种
			this.getTrendInfo();
			this.getThreeError();
			this.getUserErr();
		},
		formatteTo3(value) {
			return formatterPrize(value, 0);
		},
		// 总体统计
		getDashBoard() {
			overviewApi.dashboard({ ...this.globalParams }).then((res) => {
				this.totalStatistic = res.data;
			});
		},
		// 业务统计
		getNodeStatistic() {
			overviewApi
				.subNodeStatistic({ ...this.globalParams })
				.then((res) => {
					const list = res.data.nodeStatisticInfoList || [];
					this.subNodeStatisticTotal = formatterPrize(
						res.data.totalNum,
						0
					);
					const dataObj = {
						seriesName: "次级业务统计",
						dataList: list.map((item) => {
							return {
								value: item.num,
								name: item.nodeName,
								// name: item.nodeName + "  " + item.num + "条"
							};
						}),
					};
					this.drawPie(dataObj, "echartSubNode");
				});
			// 详情业务统计
			overviewApi
				.leafNodeStatistic({ ...this.globalParams })
				.then((res) => {
					const list = res.data.nodeStatisticInfoList || [];
					const dataObj = {
						axisData: list.map((item) => {
							return item.nodeName;
						}),

						values: list.map((item) => {
							return {
								value: item.num,
								name: item.nodeName,
							};
						}),
					};
					// console.log("->", dataObj, "<");
					this.drawBar(dataObj, "echartLeafNode", true);
				});
		},
		//性能趋势图
		getTrendDashboard() {
			overviewApi.trendDashboard({ ...this.globalParams }).then((res) => {
				const totalTrend = res.data.totalTrend || [];
				const httpNetwork = res.data.httpNetwork || [];
				const tcpNetwork = res.data.tcpNetwork || [];
				const httpBusiness = res.data.httpBusiness || [];
				const tcpBusiness = res.data.tcpBusiness || [];

				const axisData = httpNetwork.map((item) => {
					item.axisName = DateFormat(item.startTime, "dd日hh时");
					return item.axisName;
				});

				const dataList = [
					{
						seriesName: "总体统计",
						axisData: axisData,
						values: totalTrend.map((item) => {
							return item.num;
						}),
					},
					{
						seriesName: "HTTP网络错误",
						axisData: axisData,
						values: httpNetwork.map((item) => {
							return item.num;
						}),
					},
					{
						seriesName: "TCP网络错误",
						axisData: axisData,
						values: tcpNetwork.map((item) => {
							return item.num;
						}),
					},
					{
						seriesName: "HTTP业务错误",
						axisData: axisData,
						values: httpBusiness.map((item) => {
							return item.num;
						}),
					},
					{
						seriesName: "TCP业务错误",
						axisData: axisData,
						values: tcpBusiness.map((item) => {
							return item.num;
						}),
					},
				];

				this.drawLine(dataList, "allTrend");
			});
		},

		// 颗粒度更改
		timeDiffChange(value) {
			this.globalParams.intervalType = value;
			console.log("value", value);
			this.getTrendInfo();
		},
		// 趋势信息图
		getTrendInfo() {
			rtAlsApi
				.trend({
					...this.globalParams,
				})
				.then((res) => {
					const list = res.data.trends || [];

					const axisData = list.map((item) => {
						item.axisName = DateFormat(item.startTime, "dd日hh时");
						return item.axisName;
					});

					const dataList = [
						{
							seriesName: "请求耗时",
							axisData: axisData,
							values: list.map((item) => {
								return item.avgReqTime;
							}),
						},
						{
							seriesName: "100K耗时",
							axisData: axisData,
							values: list.map((item) => {
								return item.avg100K;
							}),
						},
						{
							seriesName: "错误数",
							axisData: axisData,
							values: list.map((item) => {
								return item.num;
							}),
						},
					];
					// 存下来
					this.lineDataList = dataList;
					// 选择一种数据，进行绘图
					this.chooseType(this.lineDataType);
					// this.drawLine(dataList, "trendInfo");
				});
		},
		// 筛选框选项更改
		chooseType(value) {
			this.lineDataType = value;
			// 根据显示类型，返回单个系列的数据
			const dataList = [this.lineDataList[value]];
			// console.log("->", dataList, "<");
			// 绘图
			this.drawLine(dataList, "trendInfo");

			// 动态图
			let values = dataList[0].values;
			let lastValue = values[0];

			console.log("->", dataList[0], "<");
			console.log("->", lastValue, "<");

			clearInterval(this.timer);
			this.timer = setInterval(() => {
				lastValue = lastValue + Math.random() * 100 - 50;
				lastValue = Math.round(lastValue);
				// values.shift();
				values.push(lastValue);

				dataList[0].values = values;
				dataList[0].axisData = values;

				// 重新绘图
				this.drawLine(dataList, "trendInfo");
			}, 500);
		},

		// 三种错误柱状图
		getThreeError() {
			overviewApi.domain({ ...this.globalParams }).then((res) => {
				const list = res.data.domains || [];
				const dataObj = {
					values: list.map((item) => {
						return {
							value: item.num,
							name: item.domain,
						};
					}),
				};
				this.drawHorBar(dataObj, "domainErr");
			});

			overviewApi.logicErrTop5({ ...this.globalParams }).then((res) => {
				const list = res.data || [];
				const dataObj = {
					values: list.map((item) => {
						return {
							value: item.num,
							name: item.msg,
						};
					}),
				};
				this.drawHorBar(dataObj, "bussErr");

				const tempList = dataObj.values;
				console.log("->", tempList, "<");

				// setInterval(() => {
				// 	tempList.forEach((item) => {
				// 		if (Math.random() > 0.7) {
				// 			item.value += Math.round(Math.random() * 50000);
				// 		} else {
				// 			item.value += Math.round(Math.random() * 4000);
				// 		}
				// 	});
				// 	dataObj.values = tempList;
				// 	this.drawHorBar(dataObj, "bussErr");
				// }, 3000);
			});

			overviewApi.netErrTop5({ ...this.globalParams }).then((res) => {
				const list = res.data || [];
				const dataObj = {
					values: list.map((item) => {
						return {
							value: item.num,
							name: item.msg,
						};
					}),
				};
				this.drawHorBar(dataObj, "networkErr");
			});
		},
		// top20 错误量 用户
		getUserErr() {
			rtAlsApi.getUserErr({ ...this.globalParams }).then((res) => {
				const list = res.data.users || [];
				const dataObj = {
					axisData: list.map((item) => {
						return "uid:" + item.uid;
					}),
					values: list.map((item) => {
						return {
							value: item.num,
							name: "uid:" + item.uid,
						};
					}),
				};

				this.drawBar(dataObj, "errorUserBar");
			});
		},

		drawLine(dataList, domId, showDataZoom) {
			const values = dataList[0].values;
			if (values && values.length === 0) return;

			const chartDom = document.getElementById(domId);
			const myChart = echarts.init(chartDom);
			const option = {
				grid: {
					left: "0%",
					right: "3%",
					bottom: "9%",
					top: "6%",
					containLabel: true,
				},
				tooltip: {
					show: true,
					trigger: "axis", // item 无阴影
					axisPointer: {
						type: "line", // line , cross ,shadow
						label: {
							show: true,
						},
					},
					showContent: true,
					alwaysShowContent: false, //
					triggerOn: "'mousemove|click'",

					showDelay: 0,
					confine: true,
					className: "echarts-tooltip echarts-tooltip-line",
					padding: [14, 13, 14, 13],
					textStyle: {
						fontFamily: "PingFangSC-Regular",
						fontSize: 14,
						fontWeight: 400,
						color: "#323233",
						width: 200,
						height: 30,
						lineHeight: 30,
					},
					// formatter: "{a}<br />{b}: {c}" //系列名，类目值，数据值
					// formatter:'{a0}: {c0}<br />{a1}: {c1}',
					formatter: (params) => {
						//  在 trigger 为 'axis' 的时候 为数组
						// console.log("->", params, "<");
						let str = `<p class="time">${params[0].name} </p>`;
						params.forEach((item) => {
							const value = formatterPrize(item.value, 0);
							str += `<p class="content">
                            <span class="circle" style="background:${item.color}"></span>
                            <span class="name">${item.seriesName}： </span>
                            <span class="value">${value}</span>
                            </p>`;
						});

						return str;
					},
				},
				color: this.colorBy,
				legend: {
					top: "top",
					right: 40, //"center",
					itemGap: 20,
					itemWidth: 30,
					itemHeight: 12,

					selectedMode: true,
					lineStyle: {
						width: 2,
					},
					textStyle: {
						fontFamily: "PingFangSC-Regular",
						fontSize: 12,
						color: "#323233",
						fontWeight: 400,
						padding: [3, 0, 0, 2],
						// width: 100,
						// height: 16,
						// lineHeight: 16,
						overflow: "truncate",
						ellipsis: "...",
					},
					// data: dataList.map(item => {
					//     return item.seriesName;
					// })
				},
				dataZoom: {
					//  type: 'inside',
					start: 10,
					end: 100,
					height: 25,
					backgroundStyle: "rgba(242,243,245,0.8)",
					borderColor: "rgba(242,243,245,0.4)",
					fillerColor: "rgba(255,102,0,0.06)",
					dataBackground: {
						lineStyle: {
							color: "rgba(110, 113, 111, 1)",
						},
					},
					selectedDataBackground: {
						lineStyle: {
							color: "rgba(255,102,0, 1)",
						},
					},
					moveHandleSize: 4,
					moveHandleStyle: {
						color: "rgba(255,102,0,0.06)",
					},
					emphasis: {
						moveHandleStyle: {
							color: "rgba(255,102,0,0.6)",
						},
					},
				},
				xAxis: {
					type: "category",
					boundaryGap: true,
					axisLine: {
						show: false,
					},
					axisTick: {
						show: false,
					},
					splitLine: {
						show: false,
					},
					data: dataList[0].axisData,
					axisLabel: {
						margin: 9.5,
						rotate: -45,
						color: "#323233",
						fontFamily: "PingFangSC-Regular",
						fontSize: 12,
						fontWeight: 400,
					},
				},
				yAxis: {
					type: "value",
					axisLabel: {
						fontFamily: "DINAlternate-Bold",
						color: "#323233",
						fontWeight: 700,
					},
				},
				series: dataList.map((item, index) => {
					return {
						type: "line",
						smooth: true, // 圆滑
						name: item.seriesName,
						data: item.values,
						showSymbol: false,
						showAllSymbol: false,
					};
				}),
				animationDuration: 2000, //初始时动画时长，默认1000
				animationDurationUpdate: 1000,
				animationEasing: "linear",
				animationEasingUpdate: "linear",
			};
			myChart.setOption(option, { notMerge: true });
		},
		drawBar(dataObj, domId, formatLabel = false) {
			const values = dataObj.values.map((item) => {
				return item.value;
			});
			if (values.length === 0) return;

			const chartDom = document.getElementById(domId);
			const myChart = echarts.init(chartDom);
			const option = {
				grid: {
					left: "0%",
					right: "6%",
					bottom: "3%",
					top: "3%",
					containLabel: true,
				},
				tooltip: {
					show: true,
					trigger: "axis", // item 无阴影
					showDelay: 0,
					axisPointer: {
						type: "shadow",
					},
					showContent: true,

					alwaysShowContent: false,
					confine: true,
					borderColor: "#333",
					borderWidth: 0,
					// formatter: '{a}<br />{b}: {c}'
					formatter: (params) => {
						let item = {};
						if (params.length) {
							//trigger: "axis"
							item = params[0];
						} else {
							item = params; //  trigger:item
						}
						return `类别：${item.name} <br /> 次数： ${item.value}
                        `;
					},
				},
				color: this.colorBy,
				legend: {},
				xAxis: {
					type: "category",
					boundaryGap: true,
					axisLine: {
						show: false,
					},
					axisTick: {
						show: false,
					},
					splitLine: {
						show: false,
					},
					data: dataObj.axisData,

					axisLabel: {
						interval: 0, //设置成 0 强制显示所有标签;auto
						margin: 15,
						rotate: -45,
						fontFamily: "PingFangSC-Regular",
						color: "#323233",
						fontWeight: 400,
						formatter: function (value) {
							if (!formatLabel) return value;
							var ret = ""; //拼接加\n返回的类目项
							var maxLength = 8; //每项显示文字个数
							var valLength = value.length; //X轴类目项的文字个数
							var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
							if (rowN > 1) {
								//如果类目项的文字大于4,
								for (var i = 0; i < rowN; i++) {
									var temp = ""; //每次截取的字符串
									var start = i * maxLength; //开始截取的位置
									var end = start + maxLength; //结束截取的位置
									//这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
									temp = value.substring(start, end) + "\n";
									ret += temp; //凭借最终的字符串
								}
								return ret;
							} else {
								return value;
							}
						},
					},
				},

				yAxis: {
					type: "value",
					axisLabel: {
						fontFamily: "DINAlternate-Bold",
						color: "#323233",
						fontWeight: 700,
					},
				},
				series: [
					{
						type: "bar",
						barWidth: 16,
						itemStyle: {},
						data: dataObj.values,
					},
				],
			};
			myChart.setOption(option, { notMerge: false });
		},
		drawHorBar(dataObj, domId) {
			const values = dataObj.values.map((item) => {
				return item.value;
			});
			if (values.length === 0) return;
			const maxValue = Math.max(...values);

			const chartDom = document.getElementById(domId);
			const myChart = echarts.init(chartDom);
			const option = {
				grid: {
					left: "0%",
					right: "7%",
					bottom: "3%",
					top: "5%",
					containLabel: true,
				},
				tooltip: {
					show: true,
					trigger: "item",
					confine: true,
					alwaysShowContent: false,
					borderColor: "#333",
					borderWidth: 0,
					// formatter: '{a}<br />{b}: {c}'
					formatter: (params) => {
						// console.log('params',params);
						let value = params.data.originValue || params.value;
						return `类别：${
							params.data.name || params.name
						} <br /> 次数： ${value}
                        `;
					},
				},
				color: this.colorBy,
				legend: {},
				yAxis: {
					type: "category",
					boundaryGap: true,
					inverse: true,
					axisLine: {
						show: false,
					},
					axisTick: {
						show: false,
					},
					splitLine: {
						show: false,
					},
					data: ["NO.1", "NO.2", "NO.3", "NO.4", "NO.5", ""],
					axisLabel: {
						interval: 0, //设置成 0 强制显示所有标签;auto
						fontSize: 14,
						fontFamily: "DINAlternate-Bold",
						color: "#323233",
						fontWeight: 700,
					},
					animationDurationUpdate: 300,
				},
				xAxis: {
					type: "value",
					splitNumber: 3,
					// max:"dataMax",
					axisLabel: {
						fontFamily: "DINAlternate-Bold",
						color: "#323233",
						fontWeight: 700,
					},
				},

				series: [
					{
						type: "bar",
						stack: "total",
						realtimeSort: true, //实时排序
						barWidth: 12,
						color: "#F7F8FA",
						data: dataObj.values.map((item) => {
							return {
								value: 0,
								originValue: item.value,
								name: item.name,
							};
						}),
						label: {
							show: true,
							position: ["0", "-12"],
							formatter: (params) => {
								let name = params.name.substring(0, 25);
								return `${name}`;
							},
						},
					},
					{
						type: "bar",
						barWidth: 12,
						realtimeSort: true, //实时排序
						stack: "total",
						showBackground: true,
						backgroundStyle: {
							color: "#F7F8FA",
						},
						data: dataObj.values.map((item) => {
							const leftP = (100 * maxValue) / item.value + 1;
							return {
								value: item.value,
								originValue: item.value,
								name: item.name,
								//单独设置每个数据的标签位置
								label: {
									position: [leftP + "%", "-12"], //"right",
									position: "right",
								},
							};
						}),
						label: {
							show: true,
							// formatter: (params) => {
							// 	let value = params.data.originValue;
							// 	return `${value}条`;
							// },
							valueAnimation: true,
							animationDurationUpdate: 300,
						},
						animationDurationUpdate: 3000,
					},
				],
				animationDuration: 0, //初始时动画时长，默认1000
				animationDurationUpdate: 3000,
				animationEasing: "linear",
				animationEasingUpdate: "linear",
			};
			myChart.setOption(option, { notMerge: false });
		},
		drawPie(dataObj, domId) {
			const chartDom = document.getElementById(domId);
			const myChart = echarts.init(chartDom);
			const option = {
				grid: {
					left: "3%",
					right: "4%",
					bottom: "3%",
					containLabel: true,
				},
				color: this.colorBy,

				tooltip: {
					trigger: "item",
					borderColor: "#333",
					borderWidth: 0,
					formatter: "类别：{b}<br />次数: {c}",
				},
				legend: {
					type: "plain", //scroll
					bottom: "20%",
					left: "left", //"center",
					width: 300, //"90%"
					orient: "horizontal",
					padding: [0, 0, 0, 70],
					itemGap: 12,
					itemHeight: 12,
					itemWidth: 12,
					selectedMode: true,
					textStyle: {
						fontFamily: "PingFangSC-Regular",
						fontSize: 14,
						color: "#323233",
						fontWeight: 400,
						padding: [0, 0, 0, 5],
						width: 110,
						height: 20,
						overflow: "truncate",
						ellipsis: "...",
					},
					icon: "circle",
					borderRadius: 5,
				},
				series: [
					{
						name: dataObj.seriesName,
						type: "pie",
						radius: ["45%", "55%"],
						center: ["50%", "40%"],
						label: {
							show: false,
							position: "center", // center  inside
							formatter: "{c}",
						},
						emphasis: {
							scale: true,
						},
						data: dataObj.dataList,
					},
				],
			};
			myChart.setOption(option, { notMerge: true });
		},
	},
	beforeRouteLeave(to, from, next) {
		console.log("->", "beforeRouteLeave", "<");
		clearInterval(this.timer);
        next()
	},
};
</script>

<style lang="less">
.home-contain {
	position: relative;
	width: 100%;
	color: #323233;

	.home-Content {
		margin: 0;
		.bottomChart {
			.cardClass {
				position: relative;
				background: #ffffff;
				box-shadow: 0 2px 8px 0 rgba(200, 201, 204, 0.5);
				border-radius: 4px;
				-webkit-transition: all 0.2s ease-in-out;
				transition: all 0.2s ease-in-out;
				height: 100%;
			}
			.outCard {
				margin-top: 24px;
				.cardZone {
					margin: 0;
					padding: 24px 24px 0;
					.cardtitle {
						font-family: "PingFangSC-Semibold";
						font-size: 20px;
						color: #323233;
						font-weight: 600;
					}
				}
			}
			.chartZone {
				// border: 0.5px solid red;
				position: relative;
				margin-top: 10px;
				height: ~"calc(100% - 45px)";
				.chinaMap {
					height: 100%;
				}
				.echartContain {
					background-color: #fff;
					// border: 1px solid rgb(70, 62, 62);
					height: 100%;
				}
			}
			.firstDataCon .ulCon {
				margin: 24px 0 40px;
				display: flex;
				justify-content: space-between;

				.dataCard {
					height: 120px;
					width: 24%;
					padding: 24px;
					background: #f7f8fa;
					border-radius: 4px;

					position: relative;
					.smallTitle {
						font-family: "PingFangSC-Medium";
						font-size: 14px;
						color: #323233;
						font-weight: 500;
					}
					.numCon .numStr {
						// font-family: "DIN-Medium";
						font-family: "DINAlternate-Bold";
						font-size: 32px;
						font-weight: 500;
					}
					.dataIcon {
						position: absolute;
						right: 40px;
						top: 20px;
						display: block;
						width: 80px;
						height: 80px;
						background-image: url("../../assets/design/icon-1@2x.png");
						background-repeat: no-repeat;
						background-size: contain;
					}
					.icon2 {
						background-image: url("../../assets/design/icon-2@2x.png");
					}
					.icon3 {
						background-image: url("../../assets/design/icon-3@2x.png");
					}
					.icon4 {
						background-image: url("../../assets/design/icon-4@2x.png");
					}
				}
			}
			.secDataCon {
				display: flex;
				height: 647px;
				.leftPart {
					width: 430px;
					.totalNum {
						position: absolute;
						top: 37%;
						width: 100%;
						text-align: center;
						font-family: "DINAlternate-Bold";
						font-size: 20px;
						color: #323233;
						font-weight: 700;
					}
				}
				.rightPart {
					flex: 1;
				}
				.errorTimesTitle {
					font-family: "PingFangSC-Regular";
					font-size: 14px;
					color: #969799;
					line-height: 28px;
					font-weight: 400;
				}
			}
			.thirdDataCon {
				height: 540px;
			}
			.fourDataCon {
				height: 615px;
				.operation {
					position: absolute;
					right: 25px;
					top: 25px;
					.keli {
						font-family: "PingFangSC-Regular";
						font-size: 14px;
						color: #323233;
						font-weight: 400;
					}
					.ivu-select {
						width: 160px;
						height: 32px;
						margin-right: 24px;
					}
					.ivu-radio-group {
						.ivu-radio-group-item {
							width: 80px;
						}
						.ivu-radio-wrapper-checked {
							background: rgba(255, 102, 0, 0.1);
						}
					}
				}
			}
			.fiveDataCon {
				height: 462px;
				display: flex;
				justify-content: space-between;
				.cardZone {
					width: 32%;
				}
			}
			.sixDataCon {
				height: 654px;
				display: flex;
				justify-content: space-between;
				& > div {
					width: 100%;
				}
				// .barCon {
				// 	width: 66%;
				// }
				// .mapCon {
				// 	width: 32%;
				// }
			}
			.sevenDataCon {
				height: 800px;
				& > div {
					width: 100%;
				}
			}
		}
	}
	.echarts-tooltip-line {
		color: rgb(238, 11, 11);
		p.content {
			padding: 0 10px 0 18px;
			margin: 3px 0;
			height: 20px;
			line-height: 20px;
			display: flex;
			// width: 180px;
			justify-content: space-between;
			position: relative;
			span {
				text-align: left;
			}
			span.circle {
				position: absolute;
				left: 2px;
				top: 5px;
				border-radius: 50%;
				width: 10px;
				height: 10px;
			}
		}
	}
}
</style>
