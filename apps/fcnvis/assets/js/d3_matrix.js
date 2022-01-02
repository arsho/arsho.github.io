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
                                for (let j = i + 1; j < current_data.length; j++) {
                                    let value = parseFloat(current_data[j]);
                                    rows.push({
                                        "source": i + 1,
                                        "target": j + 1,
                                        "value": value
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
        let nodes = [];
        let min_value = data[0].value;
        let max_value = data[0].value;

        for (let i = 0; i < data.length; i++) {
            nodes.push(
                {
                    "id": i + 1,
                    "name": i.toString()
                }
            );
            min_value = Math.min(min_value, data[i].value);
            max_value = Math.max(max_value, data[i].value);
        }
        return {
            "links": data,
            "description": description,
            "nodes": nodes,
            "label": label
        }
    }

    function show_d3_network(data, div_container) {
        const graph_container = "#" + div_container;
        $(graph_container).empty();
        const matrix_width = 1000;
        // set the dimensions and margins of the graph
        const margin = {top: 20, right: 0, bottom: 20, left: 0},
            width = matrix_width - margin.left - margin.right,
            height = matrix_width - margin.top - margin.bottom;

        const svg = d3.select(graph_container)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                `translate(${margin.left}, ${margin.top})`);


        // Initialize the links
        const link = svg
            .selectAll("line")
            .data(data.links)
            .join("line")
            .style("stroke", "#aaa")

        // Initialize the nodes
        const node = svg
            .selectAll("circle")
            .data(data.nodes)
            .join("circle")
            .attr("r", 20)
            .style("fill", "#69b3a2")
            // .style("fill", "none");

        node.append("text")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(function (d) {
                return d.name;
            });

        // Let's list the force we wanna apply on the network
        const simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
            .force("link", d3.forceLink()                               // This force provides links between nodes
                .id(function (d) {
                    return d.id;
                })                // This provide  the id of a node
                .links(data.links)                                    // and this the list of links
            )
            .force("charge", d3.forceManyBody().strength(-1000))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
            .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
            .on("end", ticked);

        // This function is run at each iteration of the force algorithm, updating the nodes position.
        function ticked() {
            link
                .attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });

            node
                .attr("cx", function (d) {
                    return d.x + 6;
                })
                .attr("cy", function (d) {
                    return d.y - 6;
                });
        }
    }

    $(".graph_data_btn").on("click", function () {
        $("#graph").hide("slow");
        const id = $(this).attr("id");
        let dataset;
        if (id === "subject_1_time_1_dataset") {
            dataset = get_dataset("single_file");
        }
        $(".dataset_label").html(dataset.label);
        show_d3_network(dataset,
            "matrix_div");
        $("#graph").show("slow");
    });

});