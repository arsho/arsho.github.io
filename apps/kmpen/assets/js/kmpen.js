const CHART_COLORS = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

const DATASET_1 = [
    [6, 1, 1],
    [12, 1, 1],
    [21, 1, 1],
    [27, 1, 1],
    [32, 1, 1],
    [39, 1, 1],
    [43, 1, 1],
    [43, 1, 1],
    [46, 1, 0],
    [89, 1, 1],
    [115, 1, 0],
    [139, 1, 0],
    [181, 1, 0],
    [211, 1, 0],
    [217, 1, 0],
    [261, 1, 1],
    [263, 1, 1],
    [270, 1, 1],
    [295, 1, 0],
    [311, 1, 1],
    [335, 1, 0],
    [346, 1, 0],
    [365, 1, 0]
];
const DATASET_2 = [
    [9, 2, 1],
    [13, 2, 1],
    [27, 2, 1],
    [38, 2, 1],
    [45, 2, 0],
    [49, 2, 1],
    [49, 2, 1],
    [79, 2, 0],
    [93, 2, 1],
    [118, 2, 0],
    [126, 2, 1],
    [159, 2, 0],
    [211, 2, 0],
    [218, 2, 1],
    [229, 2, 0],
    [263, 2, 0],
    [298, 2, 0],
    [301, 2, 1],
    [333, 2, 1],
    [346, 2, 0],
    [353, 2, 0],
    [362, 2, 0],
];

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

    function get_dataset(dataset_type, number_of_groups) {
        var dataset = [];
        // data: Time, Group/Factor, Outcome/Censor
        if (dataset_type === "random") {
            for (let i = 0; i < number_of_groups; i++) {
                let current_dataset = [];
                let group_number = i + 1;
                for (let j = 0; j < getRandomInt(15, 45); j++) {
                    current_dataset.push([getRandomInt(1, 500), group_number, getRandomInt(0, 1)]);
                }
                dataset.push(current_dataset);
            }
        } else {
            dataset.push(DATASET_1);
            dataset.push(DATASET_2);
        }
        for (let i = 0; i < dataset.length; i++) {
            dataset[i].sort(function (a, b) {
                return a[0] - b[0];
            });
        }
        return dataset;
    }

    function get_km_data(dataset) {
        let time_flag = {};
        let normal_data = [];
        let censor_data = [];
        let number_of_alive = dataset.length;
        let current_probability = 1.0;
        for (let i = 0; i < dataset.length; i++) {
            const current_time = dataset[i][0];
            const censor = dataset[i][2];
            let death_count = 0;
            if (censor === 1) {
                if (time_flag[current_time]) {
                    continue;
                } else {
                    time_flag[current_time] = true;
                    for (let j = i; j < dataset.length; j++) {
                        if (dataset[j][0] !== current_time) {
                            break;
                        } else if (dataset[j][2] === 1) {
                            death_count++;
                        }
                    }
                    current_probability = current_probability * (1.0 - (death_count / number_of_alive));
                    number_of_alive -= death_count;
                }
            } else {
                number_of_alive--;
                censor_data.push({
                    "x": current_time,
                    "y": current_probability
                });
            }
            normal_data.push({
                "x": current_time,
                "y": current_probability
            });
        }
        return {"normal_data": normal_data, "censor_data": censor_data};
    }

    function show_data(datasets) {

        let empty_tables = '<div class="row">';
        for (let i = 0; i < datasets.length; i++) {
            let id = "datatable_" + i;
            empty_tables += '<div class="col-12 col-md-6 mb-4">';
            empty_tables += '<table id="' + id + '" class="table table-sm table-bordered table-striped caption-top table-responsive-md">';
            empty_tables += '<caption class="card-subtitle text-center p-2 mb-2 bg-dark bg-gradient text-white">';
            empty_tables += 'Dataset: ' + parseInt(i + 1);
            empty_tables += '</caption>';
            empty_tables += '<thead class="table-light">';
            empty_tables += '<tr>';
            empty_tables += '    <th>Subject</th>';
            empty_tables += '    <th>Time</th>';
            empty_tables += '    <th>Group</th>';
            empty_tables += '    <th>Censor</th>';
            empty_tables += '</tr>';
            empty_tables += '</thead>';
            empty_tables += '<tbody>';
            empty_tables += '</tbody>';
            empty_tables += '</table>';
            empty_tables += '</div>';
        }
        empty_tables += '</div>';

        $("#data_tables").html(empty_tables);

        for (let i = 0; i < datasets.length; i++) {
            let dataset = datasets[i];
            let id = "datatable_" + i;
            var data_with_index = [];
            for (let i = 0; i < dataset.length; i++) {
                let current_row = [i + 1];
                for (let j = 0; j < dataset[i].length; j++) {
                    current_row.push(dataset[i][j]);
                }
                data_with_index.push(current_row);
            }
            var table = $('#' + id).DataTable();
            table.clear();
            table.rows.add(data_with_index).draw();
        }
    }

    function show_graph(datasets) {
        let chart_data = [];
        let default_colors = [CHART_COLORS.green, CHART_COLORS.red,
            CHART_COLORS.purple, CHART_COLORS.blue,
            CHART_COLORS.yellow, CHART_COLORS.orange];
        for (let i = 0; i < datasets.length; i++) {
            let dataset = datasets[i];
            let km_data = get_km_data(dataset);
            let normal_data = km_data["normal_data"];
            let censor_data = km_data["censor_data"];
            let color_1, color_2;
            if (datasets.length <= 3) {
                color_1 = default_colors[i * 2];
                color_2 = default_colors[i * 2 + 1];
            } else {
                color_1 = getRandomColors();
                color_2 = getRandomColors();
            }
            const line_chart_data = {
                type: 'line',
                label: 'Group ' + parseInt(i + 1),
                backgroundColor: color_1,
                borderColor: color_1,
                data: normal_data,
                fill: false,
                stepped: 'after',
                radius: 0,
                hitRadius: 0,
                borderWidth: 3,
            };
            const scatter_chart_data = {
                type: 'scatter',
                label: 'Group ' + parseInt(i + 1) + ' - Censored',
                backgroundColor: color_2,
                borderColor: color_2,
                data: censor_data,
                radius: 7,
                hoverRadius: 7,
                borderWidth: 3,
                hoverBorderWidth: 3,
                pointStyle: 'cross',
            };
            chart_data.push(scatter_chart_data);
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
                        labels: {
                            usePointStyle: true,
                        },
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
                            text: 'Time'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        min: 0.0,
                        max: 1.1,
                        ticks: {
                            stepSize: 0.1 // this worked as expected
                        },
                        title: {
                            display: true,
                            align: 'center',
                            text: 'Survival'
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
        let dataset, dataset_label;
        if (id === "random_dataset") {
            dataset = get_dataset("random", getRandomInt(1, 4));
            dataset_label = ": Random dataset";
        } else {
            dataset = get_dataset("default_dataset");
            dataset_label = ": Dataset from <a target='_blank' href='https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3059453/'>Goel, et al.: Understanding survival analysis</a>";
        }

        $("#dataset_label").html(dataset_label);

        show_data(dataset);
        show_graph(dataset);
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
                var pdf = new jsPDF();
                const pdf_max_width = 620;
                if (current_chart.width > pdf_max_width) {
                    current_chart.resize(pdf_max_width, pdf_max_width * (1 / aspect_ratio));
                }
                canvas_data = current_chart.toBase64Image('image/jpeg', 1);
                pdf.addImage(canvas_data, 'JPEG', 0, 0);
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