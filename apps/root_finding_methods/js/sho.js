/*
jQuery For Root Finding method;
Developed by: Ahmedur Rahman Shovon;
Website: arshovon.com;
*/

$(document).ready(function () {
    /*Initially hide all resultsheet functionality*/
    $('#bisec').hide();
    $('#falsepos').hide();
    $('#newtonraphson').hide();
    $('#secant').hide();
    $('.advanceMenuBtn').hide();
    $('div#advanceMenu').hide();

    /*Global Variables*/
    $lowpos = -100;
    $hipos = 100;
    $lowposval = 0;
    $hiposval = 0;
    $eps = .000001;
    $eq = "";

    /*Plus button functionality*/
    $(".advanceMenuBtn").live('click', function () {
        $(".advanceMenuBtn").toggle('slow');
        $(".closeMenuBtn").toggle('slow');
        $("div#advanceMenu").slideToggle("slow");
    });

    /*Minus button functionality*/
    $(".closeMenuBtn").live('click', function () {
        $(".advanceMenuBtn").toggle('slow');
        $(".closeMenuBtn").toggle('slow');
        $("div#advanceMenu").slideToggle("slow");
    });

    /* Home button funcionality */

    $('#equation').live('click', function () {
        window.location.reload();
    });

    /*Save button functionality*/
    $('#saveeq').live('click', function () {
        $('#formshow').slideUp('slow');
        $('.advanceMenuBtn').show();
        $('#bisec').show();
        $('#falsepos').show();
        $('#newtonraphson').show();
        $('#secant').show();

        $eq = $('#eq').val();
        $eq = $eq.replace(/\s+/g, "");

        for ($i = 16; $i >= -16; $i--) {
            $tmpval = funcVal($eq, $i);
            if ($tmpval < 0) {
                $lowpos = $i;
                $lowposval = $tmpval;
            } else if ($tmpval > 0) {
                $hipos = $i;
                $hiposval = $tmpval;
            } else {
                if ($hipos == 100) {
                    $hipos = $i + 1;
                } else ($lowpos == -100)
                {
                    $lowpos = $i - 1;
                }

            }
            if (($lowpos != -100) && ($hipos != 100)) {
                if ($lowpos != 0 && $hipos != 0)
                    break;
            }
        }

        funcBisec($eq, $lowpos, $hipos);
        funcFalsePos($eq, $lowpos, $hipos);
        funcNewtonRaphson($eq, $lowpos, $hipos);
        funcSecant($eq, $lowpos, $hipos);
    });

    /*This function returns the value of the equation for given input*/
    function funcVal($giveneq, $givenval) {
        $giveneq = $giveneq.replace(/x/g, $givenval);
        $retVal = eval($giveneq);
        return $retVal;
    }

    /*This function returns the value of the first derivation of the equation for a given input*/
    function derive($eq, $x0) {
        $delta = 0.000001; // or similar
        $x1 = $x0 - $delta;
        $x2 = $x0 + $delta;
        $y1 = funcVal($eq, $x1);
        $y2 = funcVal($eq, $x2);
        return (($y2 - $y1) / ($x2 - $x1));
    }


    /*This function inserts root finding iterative process using Bisection method*/
    function funcBisec($eq, $lowpos, $hipos) {
        $a = $lowpos;
        $b = $hipos;
        $err = 100;
        $htmlstr = "<table class=\"shotable\"><tr><th>Iteration</th><th>a</th><th>b</th><th>x<sub>m</sub></th><th>x<sub>m</sub><sup>\'</sup></th><th>Error</th></tr>";
        $it = 1;
        while ($err > 0.0001) {
            $htmlstr += "<tr><td>" + $it + "</td>";
            $it++;
            $htmlstr += "<td>" + $a.toFixed(5) + "</td>";
            $htmlstr += "<td>" + $b.toFixed(5) + "</td>";
            $xm = ($a + $b) / 2.0;
            $fa = funcVal($eq, $a);
            $fb = funcVal($eq, $b);
            $fxm = funcVal($eq, $xm);
            if ($fxm == 0) {
                $xmp = $xm;
                $htmlstr += "<td>" + $xm.toFixed(5) + "</td>";
                $htmlstr += "<td>" + $xmp.toFixed(5) + "</td>";
                $err = 0;
                $htmlstr += "<td>" + $err.toFixed(5) + "</td></tr>";
                break;
            }
            if (($fa * $fxm) <= 0) {
                $a = $a;
                $b = $xm;
            } else {
                $b = $b;
                $a = $xm;
            }
            $xmp = ($a + $b) / 2.0;
            $err = (($xmp - $xm) / $xmp) * 100.0;
            if ($err < 0)
                $err *= -1;
            $htmlstr += "<td>" + $xm.toFixed(5) + "</td>";
            $htmlstr += "<td>" + $xmp.toFixed(5) + "</td>";
            $htmlstr += "<td>" + $err.toFixed(5) + "</td></tr>";
        }

        $htmlstr += "<tfoot><tr><td colspan=\"6\">Root of " + $eq + "=0 using bisection method=" + ($xmp + $eps).toFixed(5) + "</td></tr></tfoot>";
        $htmlstr += "</table>";
        $('#bisecres').html($htmlstr);
    }


    /*This function inserts root finding iterative process using False Position method*/
    function funcFalsePos($eq, $lowpos, $hipos) {
        $a = $lowpos;
        $b = $hipos;
        $err = 100;
        $htmlstr = "<table class=\"shotable\"><tr><th>Iteration</th><th>a</th><th>b</th><th>x<sub>m</sub></th><th>x<sub>m</sub><sup>\'</sup></th><th>Error</th></tr>";
        $it = 1;
        while ($err > 0.0001) {
            $htmlstr += "<tr><td>" + $it + "</td>";
            $it++;
            $htmlstr += "<td>" + $a.toFixed(5) + "</td>";
            $htmlstr += "<td>" + $b.toFixed(5) + "</td>";
            $fa = funcVal($eq, $a);
            $fb = funcVal($eq, $b);
            $xm = (($a * $fb) - ($b * $fa)) / ($fb - $fa);
            $fxm = funcVal($eq, $xm);
            if ($fxm == 0) {
                $xmp = $xm;
                $htmlstr += "<td>" + $xm.toFixed(5) + "</td>";
                $htmlstr += "<td>" + $xmp.toFixed(5) + "</td>";
                $err = 0;
                $htmlstr += "<td>" + $err.toFixed(5) + "</td></tr>";
                break;
            }
            if (($fa * $fxm) <= 0) {
                $a = $a;
                $b = $xm;
            } else {
                $b = $b;
                $a = $xm;
            }
            $fa = funcVal($eq, $a);
            $fb = funcVal($eq, $b);
            $xmp = (($a * $fb) - ($b * $fa)) / ($fb - $fa);
            $err = (($xmp - $xm) / $xmp) * 100.0;
            if ($err < 0)
                $err *= -1;
            $htmlstr += "<td>" + $xm.toFixed(5) + "</td>";
            $htmlstr += "<td>" + $xmp.toFixed(5) + "</td>";
            $htmlstr += "<td>" + $err.toFixed(5) + "</td></tr>";
        }
        $htmlstr += "<tfoot><tr><td colspan=\"6\">Root of " + $eq + "=0 using false position method=" + ($xmp + $eps).toFixed(5) + "</td></tr></tfoot>";
        $htmlstr += "</table>";
        $('#falseposres').html($htmlstr);
    }


    /*This function inserts root finding iterative process using Newton-Raphson method*/
    function funcNewtonRaphson($eq, $lowpos, $hipos) {
        $a = $hipos;
        $b = $hipos;
        $xmp = $a;
        $err = 100;
        $htmlstr = "<table class=\"shotable\"><tr><th>Iteration</th><th>x<sub>n</sub></th><th>f(x<sub>n</sub>)</th><th>f(x<sub>n</sub><sup>\'</sup>)</th><th>x<sub>n+1</sub></th><th>Error</th></tr>";
        $it = 1;
        while ($err > 0.0001) {
            $htmlstr += "<tr><td>" + $it + "</td>";
            $it++;
            $xm = $xmp;
            $fxm = funcVal($eq, $xm);
            if ($fxm == 0) {
                $xmp = $xm;
                $htmlstr += "<td>" + $xm.toFixed(5) + "</td>";
                $htmlstr += "<td>" + $fxm.toFixed(5) + "</td>";
                $htmlstr += "<td>" + $fxm.toFixed(5) + "</td>";
                $htmlstr += "<td>" + $xmp.toFixed(5) + "</td>";
                $err = 0;
                $htmlstr += "<td>" + $err.toFixed(5) + "</td></tr>";
                break;
            }
            $fxmp = derive($eq, $xm);
            $xmp = $xm - ($fxm / $fxmp);
            $err = (($xmp - $xm) / $xmp) * 100.0;
            if ($err < 0)
                $err *= -1;
            $htmlstr += "<td>" + $xm.toFixed(5) + "</td>";
            $htmlstr += "<td>" + $fxm.toFixed(5) + "</td>";
            $htmlstr += "<td>" + $fxmp.toFixed(5) + "</td>";
            $htmlstr += "<td>" + $xmp.toFixed(5) + "</td>";
            $htmlstr += "<td>" + $err.toFixed(5) + "</td></tr>";
        }

        $htmlstr += "<tfoot><tr><td colspan=\"6\">Root of " + $eq + "=0 using Newton-Raphson method=" + ($xmp + $eps).toFixed(5) + "</td></tr></tfoot>";
        $htmlstr += "</table>";
        $('#newtonraphsonres').html($htmlstr);
    }

    /*This function inserts root finding iterative process using Secant method*/
    function funcSecant($eq, $lowpos, $hipos) {
        $a = $lowpos;
        $b = $hipos;
        $err = 100;
        $htmlstr = "<table class=\"shotable\"><tr><th>Iteration</th><th>x<sub>i-1</sub></th><th>x<sub>i</sub></th><th>x<sub>i+1</sub></th><th>f(x<sub>i+1</sub>)</th><th>Error</th></tr>";
        $it = 1;
        $xmp = 0;
        while ($err > 0.0001) {
            $htmlstr += "<tr><td>" + $it + "</td>";
            $it++;
            $htmlstr += "<td>" + $a.toFixed(5) + "</td>";
            $htmlstr += "<td>" + $b.toFixed(5) + "</td>";
            $fa = funcVal($eq, $a);
            $fb = funcVal($eq, $b);
            $xm = (($a * $fb) - ($b * $fa)) / ($fb - $fa);
            $fxm = funcVal($eq, $xm);
            if ($fxm == 0) {
                $xmp = $xm;
                $htmlstr += "<td>" + $xm.toFixed(5) + "</td>";
                $htmlstr += "<td>" + $fxm.toFixed(5) + "</td>";
                $err = 0;
                $htmlstr += "<td>" + $err.toFixed(5) + "</td></tr>";
                break;
            }
            $err = (($xm - $xmp) / $xm) * 100.0;
            if ($err < 0)
                $err *= -1;
            $a = $b;
            $b = $xm;
            $xmp = $xm;
            $htmlstr += "<td>" + $xm.toFixed(5) + "</td>";
            $htmlstr += "<td>" + $fxm.toFixed(5) + "</td>";
            $htmlstr += "<td>" + $err.toFixed(5) + "</td></tr>";
        }
        $htmlstr += "<tfoot><tr><td colspan=\"6\">Root of " + $eq + "=0 using false position method=" + ($xmp + $eps).toFixed(5) + "</td></tr></tfoot>";
        $htmlstr += "</table>";
        $('#secantres').html($htmlstr);
    }


    /*Minimize button functionality for each result table*/
    $('#minibisec').live('click', function () {
        $('#bisec').slideUp('slow');
    });
    $('#minifalsepos').live('click', function () {
        $('#falsepos').slideUp('slow');
    });
    $('#mininewtonraphson').live('click', function () {
        $('#newtonraphson').slideUp('slow');
    });
    $('#minisecant').live('click', function () {
        $('#secant').slideUp('slow');
    });


    /*Scrolling effect for each result table*/
    $('#showbisec').live('click', function () {
        $('#bisec').slideDown('slow');
        $('html,body').animate({scrollTop: $("#bisec").offset().top - 70}, 'slow');
    });
    $('#showfalsepos').live('click', function () {
        $('#falsepos').slideDown('slow');
        $('html,body').animate({scrollTop: $("#falsepos").offset().top - 70}, 'slow');
    });
    $('#shownewtonraphson').live('click', function () {
        $('#newtonraphson').slideDown('slow');
        $('html,body').animate({scrollTop: $("#newtonraphson").offset().top - 70}, 'slow');
    });
    $('#showsecant').live('click', function () {
        $('#secant').slideDown('slow');
        $('html,body').animate({scrollTop: $("#secant").offset().top - 70}, 'slow');
    });


    /*Extra Functionality*/

    /*Click function for my website*/
    $('#rib').click(function () {
        window.location.assign("https://arshovon.com/")
    });
    // Tooltip only Text
    $('#rib').hover(function () {
        // Hover over code
        var title = $(this).attr('title');
        if (title != "") {
            $(this).data('tipText', title).removeAttr('title');
            $('<p class="tooltip"></p>')
                .text(title)
                .appendTo('body')
                .fadeIn('slow');
        }
    }, function () {
        // Hover out code
        $(this).attr('title', $(this).data('tipText'));
        $('.tooltip').remove();
    }).mousemove(function (e) {
        var s = $(this).attr('id');
        if (s == "rib") {
            var mousex = e.pageX - 140; //Get X coordinates
            var mousey = e.pageY + 35; //Get Y coordinates
        } else {
            var mousex = e.pageX - 65; //Get X coordinates
            var mousey = e.pageY + 22; //Get Y coordinates
        }
        $('.tooltip')
            .css({top: mousey, left: mousex})

    });
});
/*
E Balagurusamy
--------------
x*x-4*x-10=0
Root: 5.741657387 and -1.741657387

x*x+x-2=0
Root: -2 and  1

x*x-x-2=0
Root: 2 and  -1

x*x-3*x+2=0
Root: 2 and 1

x*x*x-4*x*x+x+6=0
Root: 3 and -1 and 2 

*/

/*
Sastry
------
x*x*x-2*x-5=0
Root: 2.09455 and -1.0472757 and -1.0472757

x*x*x-x-1=0
Root= 1.324717957 and -0.662358978 and -0.662358978
*/
