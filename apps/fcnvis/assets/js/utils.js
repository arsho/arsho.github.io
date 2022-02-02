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
})