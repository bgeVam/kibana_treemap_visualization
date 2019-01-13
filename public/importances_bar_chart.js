import * as CanvasJS from './canvasjs';


export function get_chart(html_thing, data) {
  return new CanvasJS.Chart(html_thing, {
	animationEnabled: true,
	axisX:{
		interval: 1
	},
	axisY2:{
		interlacedColor: "rgba(1,77,101,.2)",
		gridColor: "rgba(1,77,101,.1)",
		title: "Top 10 Important Prediction Features"
	},
	data: [{
		type: "bar",
		name: "importances",
		axisYType: "secondary",
		color: "#014D65",
		dataPoints: data
	}]
});
}
