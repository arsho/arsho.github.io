
function password_requirement() {
    $("html").hide();
    let password = prompt('Enter Password to access the tool', '');
    if (password !== 'uab') {
        alert("Password is incorrect. Try again after reloading the page.");
    } else {
        $("html").show();
    }
}

$(document).ready(function () {

        $(window).scroll(function () {
            if ($(this).scrollTop() > 50) {
                $('#back-to-top').fadeIn();
            } else {
                $('#back-to-top').fadeOut();
            }
        });
        // scroll body to 0px on click
        $('#back-to-top').on("click", function () {
            $('body,html').animate({
                scrollTop: 0
            }, 400);
            return false;
        });
        $("#container").show();
        $("#graph").hide();

        function get_file_data(datafile) {
            var rows = [];
            $.ajax({
                url: 'datafiles/' + datafile,
                type: "GET",
                async: false,
                success: function (data) {
                    let lines = data.split("\n");
                    if (lines.length > 1) {
                        for (let i = 0; i < lines.length; i++) {
                            let line = lines[i].trim();
                            if (line !== "") {
                                let current_data = line.split("\t");
                                if (current_data !== "") {
                                    for (let j = 0; j < current_data.length; j++) {
                                        rows.push({
                                            "x": i + 1,
                                            "y": j + 1,
                                            "value": parseFloat(current_data[j])
                                        });
                                    }
                                }
                            }
                        }
                    }
                },
            });
            return rows;
        }

        function get_dataset(dataset_type) {
            let data, datafile, description, label;
            if (dataset_type === "single_file") {
                datafile = 'dfc_2500_subject_1_time_1.txt';
                description = 'Subject 1 time 1 data';
                label = ": Dataset from Subject 1 time 1";
            }
            data = get_file_data(datafile);
            return {
                "data": data,
                "description": description,
                "label": label
            }
        }

        function show_d3_graph(data, description, labels,
                               max_value, min_value,
                               div_container) {
            const graph_container = "#" + div_container;
            $(graph_container).empty();
            // set the dimensions and margins of the graph
            const margin = {top: 20, right: 0, bottom: 20, left: 0},
                width = 1200 - margin.left - margin.right,
                height = 1200 - margin.top - margin.bottom;

            // append the svg object to the body of the page
            const svg = d3.select(graph_container)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);


            const x_labels = Array.from(new Set(data.map(d => d.x)))
            const y_labels = Array.from(new Set(data.map(d => d.y)))

            // Build X scales and axis:
            const x = d3.scaleBand()
                .range([0, width])
                .domain(x_labels)
                .padding(0.05);

            // Build Y scales and axis:
            const y = d3.scaleBand()
                .range([height, 0])
                .domain(y_labels)
                .padding(0.05);

            // Build color scale
            const myColor = d3.scaleSequential()
                .interpolator(d3.interpolateInferno)
                .domain([min_value, max_value]);

            // create a tooltip
            const tooltip = d3.select(graph_container)
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "0px")
                .style("padding", "2px")

            // Three function that change the tooltip when user hover / move / leave a cell
            const mouseover = function (event, d) {
                tooltip
                    .style("opacity", 1)
                d3.select(this)
                    .style("stroke", "black")
                    .style("opacity", 1)
            }
            const mousemove = function (event, d) {
                const [mouse_x, mouse_y] = d3.pointer(event);
                tooltip
                    .html("(" + d.y + ", " + d.x + ")<br>Value: " + d.value)
                    .style("left", (mouse_x) + "px")
                    .style("top", (mouse_y) + "px")
            }
            const mouseleave = function (event, d) {
                tooltip
                    .style("opacity", 0)
                d3.select(this)
                    .style("stroke", "none")
                    .style("opacity", 0.8)
            }

            // add the squares
            svg.selectAll()
                .data(data, function (d) {
                    return d.x + ':' + d.y;
                })
                .join("rect")
                .attr("x", function (d) {
                    return x(d.x)
                })
                .attr("y", function (d) {
                    return y(d.y)
                })
                .attr("rx", 0)
                .attr("ry", 0)
                .attr("width", x.bandwidth())
                .attr("height", y.bandwidth())
                .style("fill", function (d) {
                    return myColor(d.value)
                })
                .style("stroke-width", 4)
                .style("stroke", "none")
                .style("opacity", 0.8)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
        }


        $(".graph_data_btn").on("click", function () {
            $("#graph").hide("slow");
            const id = $(this).attr("id");
            let dataset;
            if (id === "subject_1_time_1_dataset") {
                dataset = get_dataset("single_file");
            }
            $(".dataset_label").html(dataset.label);
            let nodes_label = [];
            let min_value = dataset.data[0].value;
            let max_value = dataset.data[0].value;

            for (let i = 0; i < dataset.data.length; i++) {
                nodes_label.push(i.toString());
                min_value = Math.min(min_value, dataset.data[i].value);
                max_value = Math.max(max_value, dataset.data[i].value);
            }
            show_d3_graph(dataset.data, dataset.description,
                nodes_label, max_value, min_value,
                "visualization_div");
            $("#graph").show("slow");
        });

    }
)
;