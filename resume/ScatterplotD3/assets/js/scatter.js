$(document).ready(function () {
    var chartWidth = $("#Chart").width();
    var chartHeight = 555;
    var padding = 30;
    var svgWidth = chartWidth;
    var svgHeight = chartHeight;
    d3.json("assets/js/cyclist-data.json", function (passedData) {
        var dataAr = passedData;
        var secondsMin = d3.min(dataAr, function (d) {
            return d.Seconds;
        });
        var secondsMax = d3.max(dataAr, function (d, i) {
            return d.Seconds;
        });
        var placeMin = d3.min(dataAr, function (d, i) {
            return d.Place;
        });
        var placeMax = d3.max(dataAr, function (d, i) {
            return d.Place;
        });
        var svg = d3.select("#Chart")
                .append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight);

        var xScale = d3.scale
                .linear()
                .domain([secondsMax + 10, secondsMin - 15])
                .range([padding + 10, svgWidth - padding * 2]);

        var yScale = d3.scale
                .linear()
                .domain([placeMax + 2, 0])
                .range([svgHeight - padding * 2, padding]);

        var xAxis = d3.svg
                .axis()
                .scale(xScale)
                .orient("bottom");

        var yAxis = d3.svg
                .axis()
                .scale(yScale)
                .orient("left");


        var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function (d) {
                    var tooltipString = "<strong>" + d.Name + ": " + d.Nationality + "</strong><br>";
                    tooltipString += "<p>Year: " + d.Year + ", Time: " + d.Time + "</p>";
                    tooltipString += "<p>" + d.Doping + "</p>";
                    return tooltipString;
                });


        var circle = svg.selectAll("circle")
                .data(dataAr)
                .enter()
                .append("circle")
                .attr("cx", function (d) {
                    return xScale(d.Seconds);
                })
                .attr("cy", function (d) {
                    return yScale(d.Place);
                })
                .attr("r", function (d) {
                    return 5;
                })
                .attr("fill", function (d) {
                    if (d.Doping == "")
                        return "green";
                    else
                        return "red";

                })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);


        var text = svg.selectAll("text")
                .data(dataAr)
                .enter()
                .append("text")
                .text(function (d) {
                    return d.Place + ". " + d.Name + ", " + d.Seconds;
                })
                .attr("x", function (d) {
                    return xScale(d.Seconds) + 10;
                })
                .attr("y", function (d) {
                    return yScale(d.Place) + 5;
                })
                .attr("font-size", "12px")
                .attr("fill", "black")
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);

        var legendGreenCircle = svg.append("circle")
                .attr("cx", svgWidth - 160)
                .attr("cy", svgHeight / 2)
                .attr("r", 5)
                .attr("fill", "green");

        var legendGreenLabel = svg.append("text")
                .attr("x", svgWidth - 153)
                .attr("y", (svgHeight / 2) +3)
                .text(" - No doping allegations")
                .style("font-size", "12px")
                .attr("fill", "black")

        var legendRedCircle = svg.append("circle")
                .attr("cx", svgWidth - 160)
                .attr("cy", (svgHeight / 2) + 35)
                .attr("r", 5)
                .attr("fill", "red");

        var legendGreenLabel = svg.append("text")
                .attr("x", svgWidth - 153)
                .attr("y", (svgHeight / 2) + 38)
                .text(" - Riders with doping allegations")
                .style("font-size", "12px")
                .attr("fill", "black")

        svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + (svgHeight - padding * 2) + ")")
                .call(xAxis);

        svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + (padding + 10) + ",0)")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -padding)
                .attr("dy", -20)
                .style("font-size", "12px")
                .attr("fill", "black")
                .attr("font-weight", "bold")
                .style("text-anchor", "end")
                .text("Ranking");
        svg.call(tip);

    });
});