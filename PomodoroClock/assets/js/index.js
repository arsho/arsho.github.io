$(document).ready(function () {
    var curSession, curBreak, sessionVal, breakVal, sessionValTemp, breakValTemp, sessionCheck, breakCheck, timer, fillPercent, fillColor, pauseCheck;

    function init() {
        curSession = parseInt($("#sessionTimeShow").html());
        sessionVal = curSession * 60;
        sessionValTemp = sessionVal;
        minVal = parseInt(sessionValTemp / 60);
        secVal = parseInt(sessionValTemp % 60);
        minVal = minVal < 10 ? "0" + minVal : minVal;
        secVal = secVal < 10 ? "0" + secVal : secVal;
        $("#clockStatusSpan").html("Session");
        $("#clockTimeSpan").html(minVal + ":" + secVal);
        fillPercent = "0%";
        $("#fillDiv").css("height", fillPercent);

    }

    init();


    $(".btn-setting").on("click", function () {
        $thisId = $(this).attr("id");
        $curSessionTime = parseInt($("#sessionTimeShow").html());
        $curBreakTime = parseInt($("#breakTimeShow").html());
        $curSessionTime = parseInt($curSessionTime);
        $curBreakTime = parseInt($curBreakTime);
        switch ($thisId) {
            case "sessionPlusBtn":
                $curSessionTime++;
                break;
            case "sessionMinusBtn":
                if ($curSessionTime > 1)
                    $curSessionTime--;
                break;
            case "breakPlusBtn":
                $curBreakTime++;
                break;
            case "breakMinusBtn":
                if ($curBreakTime > 1)
                    $curBreakTime--;
                break;

        }
        $("#sessionTimeShow").html($curSessionTime);
        $("#breakTimeShow").html($curBreakTime);
        init();
    });

    function timeFunction() {

        if (sessionCheck === true) {
            if (sessionValTemp === 0) {
                sessionCheck = false;
                breakCheck = true;
                sessionValTemp = sessionVal;
                $("#clockStatusSpan").html("Session is finished");
                $musicAudio = $("#musicAudio").get(0);
                $musicAudio.load();
                $musicAudio.play();
                fillPercent = 0;
                fillColor = "#ec971f";
            }
            else {
                sessionValTemp--;
                minVal = parseInt(sessionValTemp / 60);
                secVal = parseInt(sessionValTemp % 60);
                minVal = minVal < 10 ? "0" + minVal : minVal;
                secVal = secVal < 10 ? "0" + secVal : secVal;
                $("#clockStatusSpan").html("Session is running");
                $("#clockTimeSpan").html(minVal + ":" + secVal);
                fillPercent = 100 - (sessionValTemp / sessionVal) * 100.0;
                fillPercent = fillPercent + "%";
                $("#fillDiv").css("height", fillPercent);
                $("#fillDiv").css("background", fillColor);
            }
        }
        else if (breakCheck === true) {
            if (breakValTemp === 0) {
                breakCheck = false;
                sessionCheck = true;
                breakValTemp = breakVal;
                $("#clockStatusSpan").html("Break is finished");
                $musicAudio = $("#musicAudio").get(0);
                $musicAudio.load();
                $musicAudio.play();
                fillPercent = 0;
                fillColor = "green";
            }
            else {
                breakValTemp--;
                minVal = parseInt(breakValTemp / 60);
                secVal = parseInt(breakValTemp % 60);
                minVal = minVal < 10 ? "0" + minVal : minVal;
                secVal = secVal < 10 ? "0" + secVal : secVal;
                $("#clockStatusSpan").html("Break is running");
                $("#clockTimeSpan").html(minVal + ":" + secVal);
                fillPercent = 100 - (breakValTemp / breakVal) * 100.0;
                fillPercent = fillPercent + "%";
                $("#fillDiv").css("height", fillPercent);
                $("#fillDiv").css("background", fillColor);
            }

        }
    }

    function mainFunction() {
        if (timer) {
            clearInterval(timer);
        }
        curSession = parseInt($("#sessionTimeShow").html());
        curBreak = parseInt($("#breakTimeShow").html());
        curSession = parseInt(curSession);
        curBreak = parseInt(curBreak);

        sessionVal = curSession * 60;
        breakVal = curBreak * 60;

        sessionValTemp = sessionVal;
        breakValTemp = breakVal;


        sessionCheck = true;
        breakCheck = false;
        $musicAudio = $("#musicAudio").get(0);
        $musicAudio.load();
        $musicAudio.play();
        fillColor = "green";
        pauseCheck = false;
        timer = setInterval(timeFunction, 1000);

    }


    $("#startBtn").on("click", function () {
        mainFunction();
    });
    $("#resetBtn").on("click", function () {
        if (timer) {
            clearInterval(timer);
        }
        $("#sessionTimeShow").html("25");
        $("#breakTimeShow").html("5");
        fillColor = "green";
        sessionCheck = true;
        breakCheck = false;
        init();
    });
    $("#mainClockDiv").on("click", function () {
        if (pauseCheck === false) {
            pauseCheck = true;
            $clockStatusSpanStr = $("#clockStatusSpan").html();
            $clockStatusSpanStrAr = $clockStatusSpanStr.split(" ");
            $("#clockStatusSpan").html($clockStatusSpanStrAr[0] + " " + $clockStatusSpanStrAr[1] + " paused");
            clearInterval(timer);
        }
        else {
            pauseCheck = false;
            timer = setInterval(timeFunction, 1000);
        }
    });


});
