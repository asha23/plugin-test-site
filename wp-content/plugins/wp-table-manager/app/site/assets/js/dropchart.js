function drawChart() {
	var defaultConfig = {	"dataUsing": "row",
							"switchDataUsing": true, 
							"useFirstRowAsLabels": false,
							"width": 500, "height": 375, 
							"scaleShowGridLines": false
						};
	for(var i=0; i < DropCharts.length; i++) {
		var DropChart = DropCharts[i];
        var value_unit = DropChart.currency_symbols;
        var unit_symbols = (DropChart.unit_symbols) ? DropChart.unit_symbols : 0;
        var thousand_symbols = DropChart.thousand_symbols;
        var decimal_symbols = DropChart.decimal_symbols;
        var places = DropChart.places;
        var string = (parseInt(unit_symbols) === 1) ? "(Number(value).toFixed(" + places + ")).toString().replace(/\\./g, '" + decimal_symbols + "').replace(/\\B(?=(\\d{3})+(?!\\d))/g, '" + thousand_symbols + "') + ' " + value_unit + "'" : "'" + value_unit + "' + (Number(value).toFixed(" + places + ")).toString().replace(/\\./g, '" + decimal_symbols + "').replace(/\\B(?=(\\d{3})+(?!\\d))/g, '" + thousand_symbols + "')";
        if (value_unit === '') {
            string = "Number(value)";
        }

        DropChart.config.scaleLabel = "<%= " + string + "%>";
        DropChart.config.tooltipTemplate = "<%if (label){%><%=label%>: <%}%><%= " + string + "%>";
        DropChart.config.multiTooltipTemplate = "<%= datasetLabel %>: <%= " + string + "%>";

		var chartConfig = jQuery.extend({},defaultConfig, DropChart.config);
		var ctx = jQuery("#chartContainer"+DropChart.id+ " .canvas").get(0).getContext("2d");
		switch (DropChart.type) {
			case 'PolarArea':
				DropChart.chart = new Chart(ctx).PolarArea(DropChart.data, chartConfig);
				break;

			case 'Pie':
				DropChart.chart = new Chart(ctx).Pie(DropChart.data, chartConfig);
				break;

			case 'Doughnut':
				DropChart.chart = new Chart(ctx).Doughnut(DropChart.data, chartConfig);
				break;

			case 'Bar':
				DropChart.chart = new Chart(ctx).Bar(DropChart.data, chartConfig);
				break;

			case 'Radar':
				DropChart.chart = new Chart(ctx).Radar(DropChart.data, chartConfig);
				break;

			case 'Line':
			default:
				DropChart.chart = new Chart(ctx).Line(DropChart.data, chartConfig);
				break;
		}
	}
}

jQuery(document).ready(function(){
	Chart.defaults.global.responsive = true;
        //Chart.defaults.global.animation = false;
	Chart.defaults.global.multiTooltipTemplate = "<%= datasetLabel %>: <%= value %>";	
	drawChart();
})