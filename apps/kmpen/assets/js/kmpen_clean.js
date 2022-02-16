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

function apply_password_protection() {
    $("html").hide();
    let password = prompt('Enter Password to access the tool', '');
    if (password !== 'uab') {
        alert("Password is incorrect. Try again after reloading the page.");
    } else {
        $("html").show();
    }
}

$(document).ready(function () {
    $("#container").show();
    $("#graph").hide();

    function get_file_data(datafile) {
        var rows = {};
        var columns = [];
        $.ajax({
            url: datafile,
            type: "GET",
            async: false,
            success: function (data) {
                let lines = data.split("\n");
                if (lines.length > 2) {
                    for (let i = 0; i < lines.length; i++) {
                        let line = lines[i].trim();
                        if (line !== "") {
                            let current_data = line.split("\t");
                            if (current_data !== "") {
                                if (i === 0) {
                                    columns = current_data;
                                    continue;
                                }
                                let row = {};
                                row.barcode = current_data[0];
                                row.time = parseInt(current_data[1]);
                                row.status = parseInt(current_data[2]);
                                row.gene = current_data[3];
                                row.groups = [];
                                for (let j = 4; j < current_data.length; j++) {
                                    row.groups.push(current_data[j]);
                                }
                                const group = row.groups.join("+");
                                if (!rows.hasOwnProperty(group)) {
                                    rows[group] = [];
                                }
                                if (row.time < 0) {
                                    continue;
                                }
                                rows[group].push(row);
                            }
                        }
                    }
                }
            },
        });

        for (const group in rows) {
            rows[group].sort(function (a, b) {
                return a.time - b.time;
            });
        }
        return {"rows": rows, "columns": columns};
    }

    function read_p_value(datafile, genename) {
        genename = "\"" + genename + "\"";
        var p_value = 0.0;
        $.ajax({
            url: datafile,
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
                                if (i === 0) {
                                    continue;
                                }
                                if (current_data[1] == genename) {
                                    p_value = parseFloat(current_data[2]);
                                    break;
                                }
                            }
                        }
                    }
                }
            },
        });

        return p_value;
    }

    function get_p_value(ctype, genename, exp) {
        let p_value, p_value_file;
        let relative_url_path = 'datafiles/multiple/';
        let p_value_file_name_ar = ['Survival', ctype, 'Exp'];
        if (exp != '')
            p_value_file_name_ar.splice(3, 0, exp);
        p_value_file = p_value_file_name_ar.join('-') + '.txt';
        p_value_file = relative_url_path + p_value_file;
        p_value = read_p_value(p_value_file, genename);
        if (p_value < 0.0001) {
            p_value = 'p < 0.0001';
        } else if (p_value >= 0.1) {
            p_value = 'p = ' + p_value.toFixed(2);
        } else if (p_value >= 0.01) {
            p_value = 'p = ' + p_value.toFixed(3);
        } else {
            p_value = 'p = ' + p_value.toFixed(4);
        }
        return p_value;
    }

    function get_dataset(ctype, genename, exp) {
        let data, datafile, description, label;
        let relative_url_path = 'datafiles/multiple/';
        let datafile_name_ar = [genename, 'Exp', ctype, 'KMinput.txt'];
        description = 'Effect of ' + genename + ' expression level on ' + ctype + ' patient survival dataset';
        if (exp != '')
            datafile_name_ar.splice(2, 0, exp);
        description = 'Effect of ' + genename + ' expression level & ' + exp + ' on ' + ctype + ' patient survival dataset';
        datafile = datafile_name_ar.join('-');
        datafile = relative_url_path + datafile;
        label = get_p_value(ctype, genename, exp);
        data = get_file_data(datafile);
        return {
            "data": data,
            "description": description,
            "label": label
        }
    }

    function get_km_data(dataset) {
        let time_flag = {};
        let normal_data = [];
        let point_radius_data = [];
        let number_of_alive = dataset.length;
        let current_probability = 1.0;
        normal_data.push({
            "x": 0,
            "y": current_probability
        });
        for (let i = 0; i < dataset.length; i++) {
            const current_time = dataset[i].time;
            const is_alive = dataset[i].status;
            let death_count = 0;
            if (is_alive === 0) {
                if (time_flag[current_time]) {
                    continue;
                } else {
                    time_flag[current_time] = true;
                    for (let j = i; j < dataset.length; j++) {
                        if (dataset[j].time !== current_time) {
                            break;
                        } else if (dataset[j].status === 0) {
                            death_count++;
                        }
                    }
                    current_probability = current_probability * (1.0 - (death_count / number_of_alive));
                    number_of_alive -= death_count;
                }
                point_radius_data.push(0);
            } else {
                number_of_alive--;
                point_radius_data.push(4);
            }
            normal_data.push({
                "x": current_time,
                "y": current_probability
            });

        }
        return {
            "normal_data": normal_data,
            "point_radius_data": point_radius_data
        };
    }

    function show_graph(rows, chart_title, chart_subtitle) {
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
                            bottom: 5
                        },
                        font: {
                            size: 18
                        }
                    },
                    subtitle: {
                        display: true,
                        text: chart_subtitle,
                        font: {
                            size: 14
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

    $(".graph_data_btn").on("click", function () {
        $("#graph").hide();

        const ctype = $(this).attr("ctype");
        const genename = $(this).attr("genename");
        const exp = $(this).attr("exp");
        let dataset = get_dataset(ctype, genename, exp);
        show_graph(dataset.data.rows, dataset.description, dataset.label);
        $("#graph").show("slow");
    });

    $(".download_chart").on("click", function () {
        const id = $(this).attr("id");
        let canvas_data, filename;
        const ctx = document.getElementById('kmgraph').getContext('2d');
        const current_chart = Chart.getChart(ctx);
        if (typeof current_chart !== 'undefined') {
            if (id === "jpeg_btn") {
                canvas_data = current_chart.toBase64Image('image/jpeg', 1);
                filename = "km_graph.jpg";
            } else if (id === "png_btn") {
                canvas_data = current_chart.toBase64Image();
                filename = "km_graph.png";
            } else if (id === "pdf_btn") {
                const aspect_ratio = current_chart.width / current_chart.height;
                filename = "km_graph.pdf";
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
    $(".graph_data_btn").first().trigger( "click" );
});