const CHART_COLORS = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

function getRandomInt(min_value, max_value) {
    min_value = Math.ceil(min_value);
    max_value = Math.floor(max_value);
    return Math.floor(Math.random() * (max_value - min_value + 1) + min_value);
}

function getRandomColors() {
    const r = getRandomInt(0, 255);
    const g = getRandomInt(0, 255);
    const b = getRandomInt(0, 255);
    return "rgba(" + r + "," + g + "," + b + ", 1.0)";
}

function get_pdf_size(points, unit) {
    // Unit table from https://github.com/MrRio/jsPDF/blob/ddbfc0f0250ca908f8061a72fa057116b7613e78/jspdf.js#L791
    var multiplier;
    switch (unit) {
        case 'pt':
            multiplier = 1;
            break;
        case 'mm':
            multiplier = 72 / 25.4;
            break;
        case 'cm':
            multiplier = 72 / 2.54;
            break;
        case 'in':
            multiplier = 72;
            break;
        case 'px':
            multiplier = 96 / 72;
            break;
        case 'pc':
            multiplier = 12;
            break;
        case 'em':
            multiplier = 12;
            break;
        case 'ex':
            multiplier = 6;
        default:
            throw ('Invalid unit: ' + unit);
    }
    return points * multiplier;
}

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
                                        "x": i+1,
                                        "y": j+1,
                                        "v": parseFloat(current_data[j])
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

    function show_graph(rows, chart_title) {
        let chart_data = [];
        let default_colors = [CHART_COLORS.green, CHART_COLORS.red,
            CHART_COLORS.purple, CHART_COLORS.blue,
            CHART_COLORS.yellow, CHART_COLORS.orange];
        let color_index = 0;
        for (const group in rows) {
            let dataset = rows[group];
            let km_data = get_km_data(dataset);
            let normal_data = km_data["normal_data"];
            let point_radius_data = km_data["point_radius_data"];
            let current_chart_color;

            if (Object.keys(rows).length <= 12) {
                current_chart_color = default_colors[color_index];
                color_index++;
            } else {
                current_chart_color = getRandomColors();
            }
            const line_chart_data = {
                type: 'line',
                label: group + ' (n=' + parseInt(rows[group].length) + ')',
                backgroundColor: current_chart_color,
                borderColor: current_chart_color,
                data: normal_data,
                fill: false,
                stepped: true,
                radius: point_radius_data,
                hitRadius: 0,
                hoverRadius: 4,
                borderWidth: 2,
                hoverBorderWidth: 2,
                pointStyle: 'cross',
            };
            chart_data.push(line_chart_data);
        }

        const canvas_background_plugin = {
            id: 'custom_canvas_background_color',
            beforeDraw: (chart) => {
                const ctx = chart.canvas.getContext('2d');
                ctx.save();
                ctx.globalCompositeOperation = 'destination-over';
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, chart.width, chart.height);
                ctx.restore();
            }
        };

        const config = {
            data: {datasets: chart_data},
            options: {
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            boxWidth: 15,
                            padding: 15
                        }
                    },
                    title: {
                        display: true,
                        text: chart_title,
                        padding: {
                            top: 10,
                            bottom: 10
                        },
                        font: {
                            size: 18
                        }
                    }
                },
                animation: false,
                responsive: true,
                scales: {
                    x: {
                        type: 'linear',
                        beginAtZero: true,
                        grace: '0%',
                        title: {
                            display: true,
                            align: 'center',
                            text: 'Time (days)'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        min: 0.0,
                        max: 1.1,
                        ticks: {
                            stepSize: 0.1
                        },
                        title: {
                            display: true,
                            align: 'center',
                            text: 'Survival Probability'
                        }
                    }
                },
            },
            plugins: [canvas_background_plugin],
        };
        Chart.defaults.color = '#000';
        const ctx = document.getElementById('kmgraph').getContext('2d');

        const old_chart = Chart.getChart(ctx);
        if (typeof old_chart !== 'undefined') {
            old_chart.destroy();
        }
        new Chart(ctx, config);

    }

    function show_matrix_graph(records, chart_title) {
        const canvas_background_plugin = {
            id: 'custom_canvas_background_color',
            beforeDraw: (chart) => {
                const ctx = chart.canvas.getContext('2d');
                ctx.save();
                ctx.globalCompositeOperation = 'destination-over';
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, chart.width, chart.height);
                ctx.restore();
            }
        };
        let number_of_nodes = Math.ceil(Math.sqrt(records.length));
        const data = {
            datasets: [{
                label: 'My Matrix',
                data: records,
                backgroundColor(context) {
                    const value = context.dataset.data[context.dataIndex].v;
                    const alpha = value;
                    const r = 0, g = 128, b = 0;
                    return "rgba(" + r + "," + g + "," + b + ", " + alpha + ")";
                },
                borderColor(context) {
                    const value = context.dataset.data[context.dataIndex].v;
                    const alpha = value;
                    const r = 0, g = 108, b = 0;
                    return "rgba(" + r + "," + g + "," + b + ", " + alpha + ")";
                },
                borderWidth: 1,
                width: ({chart}) => (chart.chartArea || {}).width / number_of_nodes - 1,
                height: ({chart}) => (chart.chartArea || {}).height / number_of_nodes - 1
            }]
        };

        const config = {
            type: 'matrix',
            data: data,
            options: {
                plugins: {
                    legend: false,
                    tooltip: {
                        callbacks: {
                            title() {
                                return '';
                            },
                            label(context) {
                                const v = context.dataset.data[context.dataIndex];
                                return ['x: ' + v.x, 'y: ' + v.y, 'value: ' + v.v];
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: chart_title,
                        padding: {
                            top: 10,
                            bottom: 10
                        },
                        font: {
                            size: 18
                        }
                    }
                },
                animation: false,
                responsive: true,
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        offset: true,
                        ticks: {
                            stepSize: 1
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            },
            plugins: [canvas_background_plugin],
        };

        Chart.defaults.color = '#000';
        const ctx = document.getElementById('matrix_graph').getContext('2d');

        const old_chart = Chart.getChart(ctx);
        if (typeof old_chart !== 'undefined') {
            old_chart.destroy();
        }
        new Chart(ctx, config);
    }

    $(".graph_data_btn").on("click", function () {
        $("#graph").hide();
        const id = $(this).attr("id");
        let dataset;
        if (id === "subject_1_time_1_dataset") {
            dataset = get_dataset("single_file");
        }
        $(".dataset_label").html(dataset.label);
        show_matrix_graph(dataset.data, dataset.description);
        $("#graph").show("slow");
    });

    $(".download_chart").on("click", function () {
        const id = $(this).attr("id");
        let canvas_data, filename;
        const ctx = document.getElementById('matrix_graph').getContext('2d');
        const current_chart = Chart.getChart(ctx);
        if (typeof current_chart !== 'undefined') {
            if (id === "jpeg_btn") {
                canvas_data = current_chart.toBase64Image('image/jpeg', 1);
                filename = "matrix_graph.jpg";
            } else if (id === "png_btn") {
                canvas_data = current_chart.toBase64Image();
                filename = "matrix_graph.png";
            } else if (id === "pdf_btn") {
                const aspect_ratio = current_chart.width / current_chart.height;
                filename = "matrix_graph.pdf";
                var pdf = new jsPDF('l', 'pt', 'a4');
                const pdf_width = pdf.internal.pageSize.width;
                const pdf_width_px = get_pdf_size(pdf_width, 'px');
                if (current_chart.width > pdf_width_px) {
                    current_chart.resize(pdf_width, pdf_width * (1.0 / aspect_ratio));
                }
                canvas_data = current_chart.toBase64Image();
                pdf.addImage(canvas_data, 'PNG', 0, 20);
                pdf.save(filename);
                current_chart.resize();
            }
        }
        if (id !== "pdf_btn") {
            let temp_link = document.createElement('a');
            temp_link.href = canvas_data;
            temp_link.download = filename;
            temp_link.click();
        }
    });

});