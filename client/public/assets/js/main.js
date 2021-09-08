(function ($) {
    "use strict";

    jQuery(document).ready(function ($) {




        $('.menu__open , .offcanvas-overlay').click(function () {

            $('.menu__bar , .offcanvas-overlay').addClass('show');

        });
        $(' .menu__bar, .offcanvas-overlay').click(function () {

            $('.menu__bar , .offcanvas-overlay').removeClass('show');

        });

        $('.mail__close').click(function () {

            $('.tab-pane').removeClass('active, show');
            $('.nav-link').removeClass('active');

        });


    });

    jQuery(window).load(function () {


    });


}(jQuery));