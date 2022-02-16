$(document).ready(function () {
    Chart.register(ChartDataLabels);
    let default_colors = [CHART_COLORS.green, CHART_COLORS.red,
        CHART_COLORS.purple, CHART_COLORS.blue, CHART_COLORS.yellow,
        CHART_COLORS.orange];

    function set_subject_options() {
        let dfc_2500_total_subjects = 316;
        let dfc_1400_total_subjects = 10;
        let subjects = '';
        for (var i = 1; i <= dfc_2500_total_subjects; i++) {
            subjects += "<option value='" + i + "'>Subject " + i + "</option>";
        }
        subjects = '';
        for (var i = 1; i <= dfc_1400_total_subjects; i++) {
            subjects += "<option value='" + i + "'>Subject " + i + "</option>";
        }
        $("#subject_id_2500").html(subjects);
        $("#subject_id_1400").html(subjects);
    }

    set_subject_options();
    $("#graph").hide();

    function get_json_data(data_path) {
        var rows = [];
        $.ajax({
            url: data_path,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                rows = data;
            },
        });
        return $.parseJSON(rows);
    }

    function get_specific_dataset(selected_subjects, data_path, data_label, fixed_color, color_start) {
        var datasets = [];

        for (let i = 0; i < selected_subjects.length; i++) {
            let current_chart_color;
            if (fixed_color) {
                current_chart_color = default_colors[color_start];
                color_start++;
            } else {
                current_chart_color = getRandomColors();
            }

            let subject_id = selected_subjects[i];
            var chart_data = [];
            var data_path = data_path + '/subject_' + subject_id + '.json';
            var rows = get_json_data(data_path);
            for (var j = 0; j < rows.length; j++) {
                chart_data.push({
                    x: parseFloat(rows[j][0]),
                    y: parseFloat(rows[j][1]),
                    label: j + 1
                });
            }
            let subject_data = {
                label: data_label + 'Subject ' + subject_id.toString(),
                data: chart_data,
                borderColor: current_chart_color,
                backgroundColor: current_chart_color,
                pointStyle: 'circle',
                borderWidth: 1,
                pointRadius: 8,
                hoverRadius: 0,
                hoverBorderWidth: 1
            };
            datasets.push(subject_data);
        }
        return datasets;
    }

    function get_datasets(subjects_2500, subjects_1400) {
        let dfc_2500_data_path = 'dfc_2500_subjects_mds';
        let dfc_2500_data_label = 'DFC 2500: ';
        let dfc_1400_data_path = 'dfc_1400_subjects_mds';
        let dfc_1400_data_label = 'DFC 1400: ';
        let fixed_color = false;
        let color_start = 0;
        if (subjects_1400.length + subjects_2500.length <= 6) {
            fixed_color = true;
        }
        let dfc_2500_dataset = get_specific_dataset(subjects_2500,
            dfc_2500_data_path, dfc_2500_data_label,
            fixed_color, color_start);
        let dfc_1400_dataset = get_specific_dataset(subjects_1400,
            dfc_1400_data_path, dfc_1400_data_label,
            fixed_color, subjects_2500.length);
        return dfc_2500_dataset.concat(dfc_1400_dataset);
    }

    function show_graph(datasets, chart_title) {
        Chart.defaults.color = '#000';
        const canvas_background_plugin = {
            id: 'custom_canvas_background_color', beforeDraw: (chart) => {
                const ctx = chart.canvas.getContext('2d');
                ctx.save();
                ctx.globalCompositeOperation = 'destination-over';
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, chart.width, chart.height);
                ctx.restore();
            }
        };

        const config = {
            type: 'bubble', data: {
                datasets: datasets,
            }, options: {
                animation: false, responsive: true, plugins: {
                    datalabels: {
                        font: {
                            size: 9,
                        }, formatter: function (value) {
                            return Math.round(value.label);
                        }, offset: 2, padding: 0
                    }, legend: {
                        position: 'top',
                    }, title: {
                        display: true, text: chart_title, padding: {
                            top: 10, bottom: 10
                        }, font: {
                            size: 18
                        }
                    }, tooltip: {
                        callbacks: {
                            label: function (context) {
                                let label = "Timeframe " + context.raw.label;
                                return label;
                            }
                        }
                    },
                }
            }, plugins: [canvas_background_plugin],
        };

        const ctx = document.getElementById('visualization_div').getContext('2d');

        const old_chart = Chart.getChart(ctx);
        if (typeof old_chart !== 'undefined') {
            old_chart.destroy();
        }
        new Chart(ctx, config);
    }

    $(".download_chart").on("click", function () {
        const id = $(this).attr("id");
        let canvas_data, filename;
        const ctx = document.getElementById('visualization_div').getContext('2d');
        const current_chart = Chart.getChart(ctx);
        filename_base = 'mds_graph';
        if (typeof current_chart !== 'undefined') {
            if (id === "jpeg_btn") {
                canvas_data = current_chart.toBase64Image('image/jpeg', 1);
                filename = filename_base + ".jpg";
            } else if (id === "png_btn") {
                canvas_data = current_chart.toBase64Image();
                filename = filename_base + ".png";
            } else if (id === "pdf_btn") {
                const aspect_ratio = current_chart.width / current_chart.height;
                filename = filename_base + ".pdf";
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
    $(".graph_data_btn").on("click", function () {
        var subjects_2500 = $('#subject_id_2500 option:selected')
            .toArray().map(item => item.value);
        var subjects_1400 = $('#subject_id_1400 option:selected')
            .toArray().map(item => item.value);
        var datasets = get_datasets(subjects_2500, subjects_1400);
        $("#graph").hide();
        show_graph(datasets, "MDS for selected subjects");
        $("#graph").show("slow");
    });

});