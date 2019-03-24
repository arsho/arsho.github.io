$(document).ready(function () {
	/*Wow.js starts*/
	new WOW().init();
	/*Wow.js ends*/
	
    $("html").niceScroll({
        scrollspeed: 51,
        mousescrollstep: 45
    });

    $(function () {
        $('a.page-scroll').on('click', function (event) {
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top - 55
            }, 1000);
            event.preventDefault();
        });
    });

    /*Tooltip starts*/
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })
    /*Tooltip ends*/
    /*Fullscreen starts*/
// mozfullscreenerror event handler
    function errorHandler() {
        alert('mozfullscreenerror');
    }
    document.documentElement.addEventListener('mozfullscreenerror', errorHandler, false);

// toggle full screen
    function toggleFullScreen() {
        if (!document.fullscreenElement && // alternative standard method
                !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    }

    $("#fullScreenBtn").on("click", function () {
        toggleFullScreen();
    });
    /*Fullscreen ends*/

    /*D3.js starts*/
    $ChartDiv = $("#Chart");
    var ChartDivWidth = $ChartDiv.width();
    var windowHeight = window.innerHeight;
    var ChartDivHeight = windowHeight * .6;

    console.log(windowHeight);
    var monthsAr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var formatMoney = d3.format("$.2f");

    d3.json("assets/js/GDP-data.json", function (passeddata) {

        data = passeddata.data;
        var margin = {top: 30, right: 30, bottom: 30, left: 60},
        width = ChartDivWidth - margin.left - margin.right,
                height = ChartDivHeight - margin.top - margin.bottom;

        var barWidth = Math.ceil(width / data.length);

        minDate = new Date(data[0][0]);
        maxDate = new Date(data[274][0]);

        var x = d3.time.scale()
                .domain([minDate, maxDate])
                .range([0, width]);

        var y = d3.scale.linear()
                .range([height, 0])
                .domain([0, d3.max(data, function (d) {
                        return d[1];
                    })]);

        var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .ticks(d3.time.years, 5);

        var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(10, "");



        var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function (d) {
                    var currentDate = new Date(d[0]);
                    var currentYear = currentDate.getFullYear();
                    var currentMonth = monthsAr[currentDate.getMonth()];
                    return "<strong>" + formatMoney(d[1]) + " billion</strong><br/><span>" + currentYear + " - " + currentMonth + "</span>";
                });

        var svg = d3.select("#Chart").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.call(tip);


        d3.select("#description")
                .append("text")
                .text(passeddata.description);

        svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

        svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Gross Domestic Product, USA");

        svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function (d) {
                    return x(new Date(d[0]));
                })
                .attr("width", barWidth)
                .attr("y", function (d) {
                    return y(d[1]);
                })
                .attr("height", function (d) {
                    return height - y(d[1]);
                })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);

    });

    /*D3.js ends*/
});
