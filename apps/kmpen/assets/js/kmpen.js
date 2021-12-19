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
        var rows = {};
        var columns = [];
        $.ajax({
            url: 'datafiles/' + datafile,
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
                                row.a1bg = current_data[3];
                                row.group1 = current_data[4];
                                row.group2 = current_data[5];
                                const group = row.group1 + " + " + row.group2;
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


    function get_dataset(dataset_type) {
// A1BG-S-KMinput.txt  : is tab separated file. It has following columns.
// 1.       Barcode: Patient ID
// 2.       Time: Time in days
// 3.       Status: patient life status (death=0, alive=1)
// 4.       A1BG: Expression value of A1BG gene in cancer patients
// 5.       ExpressionLevel:  is Group1, dividing patients based on A1BG expression level
// 6.       Sex: id Group2, dividing patients based on patient’s gender
//
// A1BG-R-KMinput.txt  : is tab separated file. It has following columns.
// 1.       Barcode: Patient ID
// 2.       Time: Time in days
// 3.       Status: patient life status (death=0, alive=1)
// 4.       A1BG: Expression value of A1BG gene in cancer patients
// 5.       ExpressionLevel:  is Group1, dividing patients based on A1BG expression level
// 6.       Race: id Group2, dividing patients based on patient’s race

        let data, datafile, description, label;
        if (dataset_type === "race_dataset") {
            datafile = 'A1BG-R-KMinput.txt';
            description = 'Effect of A1BG expression level & race on KIRC patient survival dataset';
            label = ": Dataset from A1BG expression level & race on KIRC patient survival dataset";
        } else if (dataset_type === "gender_dataset") {
            datafile = 'A1BG-S-KMinput.txt';
            description = 'Effect of A1BG expression level & gender on KIRC patient survival dataset';
            label = ": Dataset from A1BG expression level & gender on KIRC patient survival dataset";
        }
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
            "x": dataset[0].time,
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
        return {"normal_data": normal_data, "point_radius_data": point_radius_data};
    }

    function show_data(rows, columns) {

        let empty_tables = '<div class="row">';
        let table_id = 1;
        for (const group in rows) {
            let id = "datatable_" + parseInt(table_id);
            empty_tables += '<div class="col-12 col-md-6 mb-5">';
            empty_tables += '<table id="' + id + '" class="table table-sm table-bordered table-striped caption-top table-responsive-md">';
            empty_tables += '<caption class="card-subtitle text-center p-2 mb-2 bg-dark bg-gradient text-white">';
            empty_tables += 'Dataset: ' + group;
            empty_tables += '</caption>';
            empty_tables += '<thead class="table-light">';
            empty_tables += '<tr>';
            for (let i = 0; i < columns.length; i++) {
                empty_tables += '    <th>' + columns[i] + '</th>';
            }
            empty_tables += '</tr>';
            empty_tables += '</thead>';
            empty_tables += '<tbody>';
            empty_tables += '</tbody>';
            empty_tables += '</table>';
            empty_tables += '</div>';
            table_id++;
        }
        empty_tables += '</div>';

        $("#data_tables").html(empty_tables);
        table_id = 1;
        for (const group in rows) {
            let dataset = rows[group];
            let id = "datatable_" + parseInt(table_id);
            var table_data = [];
            for (let i = 0; i < dataset.length; i++) {
                let current_row = [];
                const row = dataset[i];
                for (const key in row) {
                    current_row.push(row[key]);
                }
                table_data.push(current_row);
            }
            var table = $('#' + id).DataTable();
            table.clear();
            table.rows.add(table_data).draw();
            table_id++;
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

    $(".graph_data_btn").on("click", function () {
        $("#graph").hide();
        const id = $(this).attr("id");
        let dataset;
        if (id === "race_dataset") {
            dataset = get_dataset("race_dataset");
        } else if (id === "gender_dataset") {
            dataset = get_dataset("gender_dataset");
        }
        $(".dataset_label").html(dataset.label);
        show_data(dataset.data.rows, dataset.data.columns);
        show_graph(dataset.data.rows, dataset.description);
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

});