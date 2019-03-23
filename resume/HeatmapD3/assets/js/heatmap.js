$(document).ready(function () {
    var chartWidth = $("#Chart").width();
    var chartHeight = 555;
    var padding = 30;
    var svgWidth = chartWidth - 80;
    var svgHeight = chartHeight - 150;
    var rectHeight = Math.floor(svgHeight / 12);
    var rectWidth = 0;
    var legendWidth = 60;
    var legendHeight = 20;


    var formatNumber = d3.format(".2f");
    var monthAr = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    var colorAr = ["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#ff0000", "#9e0142", "#770022"];

    var rangeAr = [];

    var colorArLen = colorAr.length;

    d3.json("assets/js/global-temperature.json", function (passedData) {
        var baseTemperature = passedData.baseTemperature;
        var dataAr = passedData.monthlyVariance;
        var distinctYear = [];

        var monthMin = d3.min(dataAr, function (d) {
            return d.month;
        });
        var monthMax = d3.max(dataAr, function (d) {
            return d.month;
        });
        var yearMin = d3.min(dataAr, function (d) {
            if ($.inArray(d.year, distinctYear) == -1) distinctYear.push(d.year);
            return d.year;
        });
        var yearMax = d3.max(dataAr, function (d) {
            return d.year;
        });

        var tempMin = d3.min(dataAr, function (d) {
            return d.variance + baseTemperature;
        });
        var tempMax = d3.max(dataAr, function (d) {
            return d.variance + baseTemperature;
        });

        var distinctYearLength = distinctYear.length;
        rectWidth = Math.floor(svgWidth / distinctYearLength);

        var svg = d3.select("#Chart")
            .append("svg")
            .attr("width", chartWidth)
            .attr("height", chartHeight);

        var xScale = d3.scale
            .linear()
            .domain([yearMin - 2, yearMax + 2])
            .range([95, svgWidth]);

        var yScale = d3.scale
            .linear()
            .domain([monthMin, monthMax])
            .range([20, svgHeight]);

        var colorScale = d3.scale
            .linear()
            .domain([tempMin - .5, tempMax + .5])
            .range([0, colorArLen]);

        var xAxis = d3.svg
            .axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(25);

        var diffRange = (tempMax - tempMin) / colorArLen;
        var tempVal = tempMin;
        for (i = 0; i < colorArLen + 1; i++) {
            rangeAr.push(formatNumber(tempVal));
            tempVal += diffRange;
        }

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                var tooltipString = "<strong>" + d.year + ": " + monthAr[d.month - 1] + "</strong><br><br>";
                tooltipString += "<p>Temperature: " + formatNumber(d.variance + baseTemperature) + "℃</p>";
                tooltipString += "<p>Variance " + d.variance + "</p>";
                return tooltipString;
            });


        var rect = svg.selectAll(".bar")
            .data(dataAr)
            .enter()
            .append("rect")
            .attr("x", function (d) {
                return xScale(d.year);
            })
            .attr("y", function (d) {
                return yScale(d.month);
            })
            .attr("width", function (d) {
                return rectWidth;
            })
            .attr("height", function (d) {
                return rectHeight + 2;
            })
            .attr("fill", function (d) {
                var temparature = baseTemperature + d.variance;
                var searchedPosition = Math.floor(colorScale(temparature));
                var colorValue = colorAr[searchedPosition];
                d.color = colorValue;
                return colorValue;
            })
            .attr("class", function (d) {
                var temparature = baseTemperature + d.variance;
                var searchedPosition = Math.floor(colorScale(temparature));
                var classValue = "bar class_" + searchedPosition;
                return classValue;
            })
            .style("cursor", "pointer")
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        var month = svg.selectAll(".y-label")
            .data(dataAr)
            .enter()
            .append("text")
            .attr("x", 30)
            .attr("y", function (d, i) {
                return (i * (rectHeight + 2)) + rectHeight / 2 + 25;
            })
            .text(function (d, i) {
                return monthAr[i];
            })
            .style("font-family", "verdana")
            .style("font-size", "11px")
            .style("font-weight", "bold")
            .style("text-anchor", "start");

        var colorLegend = svg.selectAll(".legend-color")
            .data(colorAr.reverse())
            .enter()
            .append("rect")
            .attr("x", function (d, i) {
                return svgWidth - ((i + 1) * legendWidth);
            })
            .attr("y", function (d) {
                return svgHeight + 80;
            })
            .attr("width", function (d) {
                return legendWidth;
            })
            .attr("height", function (d) {
                return legendHeight;
            })
            .attr("fill", function (d) {
                return d;
            })
            .attr("class", function (d, i) {
                var classValue = "bar_selector class_selector_" + (colorArLen - i);
                return classValue;
            })
            .style("cursor", "pointer");



        var colorLegendAll = svg.selectAll(".legend-color-all")
            .data(colorAr.reverse())
            .enter()
            .append("rect")
            .attr("x", function (d, i) {
                return svgWidth - (colorArLen * legendWidth) - ((i + colorArLen + 1) * rectWidth);
            })
            .attr("y", function (d) {
                return svgHeight + 80;
            })
            .attr("width", function (d) {
                return rectWidth;
            })
            .attr("height", function (d) {
                return legendHeight;
            })
            .attr("fill", function (d) {
                return d;
            })
            .attr("class", function (d, i) {
                var classValue = "bar_selector_all";
                return classValue;
            })
            .style("cursor", "pointer");



        var colorLegendText = svg.selectAll(".legend-text")
            .data(rangeAr.reverse())
            .enter()
            .append("text")
            .attr("x", function (d, i) {
                return svgWidth - (i * legendWidth);
            })
            .attr("y", function (d) {
                return svgHeight + 115;
            })
            .text(function (d) {
                return d + "℃";
            })
            .style("font-size", "14px")
            .style("text-anchor", "middle");

        var colorLegendAllText = svg
            .append("text")
            .attr("x", svgWidth + 2 * rectWidth - ((colorArLen + 1) * legendWidth))
            .attr("y", svgHeight + 115)
            .text("Show All")
            .style("font-size", "14px")
            .style("text-anchor", "end");

        var xAxisText = svg
            .append("text")
            .attr("x", svgWidth/2 - rectHeight)
            .attr("y", svgHeight+70)
            .text("Years")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .attr("fill", "#777777");

        var yAxisText = svg
            .append("text")
            .attr("x", -svgHeight / 2 - rectHeight)
            .attr("y", 15)
            .text("Months")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .attr("transform", "rotate(-90)")
            .attr("fill", "#777777");


        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (svgHeight + 35) + ")")
            .call(xAxis);

        svg.call(tip);

        $(".bar_selector").on("click", function() {
			$className = $(this).attr("class");
			$selectedClass = $className.split("bar_selector class_selector_")[1] - 1;
			$(".bar").css("opacity",0.2);
			$(".class_" + $selectedClass).css("opacity",1);
		});

		$(".bar_selector_all").on("click", function() {
			$(".bar").css("opacity",1);
		});

    });
});
