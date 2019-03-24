$(document).ready(function () {
	/*Wow.js starts*/
	new WOW().init();
	/*Wow.js ends*/
	
    $("html").niceScroll({
        scrollspeed: 51,
        mousescrollstep: 45
    });

    $(function () {
        $('a.page-scroll').on('click', function (event) {
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top - 55
            }, 1000);
            event.preventDefault();
        });
    });

    /*Tooltip starts*/
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })
    /*Tooltip ends*/
    /*Fullscreen starts*/
// mozfullscreenerror event handler
    function errorHandler() {
        alert('mozfullscreenerror');
    }
    document.documentElement.addEventListener('mozfullscreenerror', errorHandler, false);

// toggle full screen
    function toggleFullScreen() {
        if (!document.fullscreenElement && // alternative standard method
                !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    }

    $("#fullScreenBtn").on("click", function () {
        toggleFullScreen();
    });
    /*Fullscreen ends*/

});
