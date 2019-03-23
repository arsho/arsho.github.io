$(document).ready(function () {
	/*Wow.js starts*/
	new WOW().init();
	/*Wow.js ends*/

    $("html").niceScroll({
        scrollspeed: 51,
        mousescrollstep: 45,
    });

    $(function () {
        $('a.page-scroll').on('click', function (event) {
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top - 60
            }, 1000);
            event.preventDefault();
        });
    });
});
