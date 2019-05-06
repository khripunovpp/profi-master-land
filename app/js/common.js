var Util = {
    randomInteger: function(min, max) {
        var rand = min + Math.random() * (max - min)
        rand = Math.round(rand);
        return rand;
    },
    scrollToEl: function(el, offset) {
        $("html,body").animate({ scrollTop: el.offset().top + (offset || 0) }, 500);
    },
    trimString: function(string) {
        return string.split(' ').join('');
    }
}

var menu = function() {

    $('.js-menuToggle').on('click', toggle);
    $('body').on('click', '.menu__item', ref);
    $('body').on('click', '.menu__back', showRoot);

    var menu = $('.menu'),
        menuButton = $('.js-menuToggle')

    var clonedRoot = $('.menu__list').clone();

    function showRoot() {
        menu.html(clonedRoot)
    }

    function toggle() {
        menuButton.toggleClass('open');
        menu.slideToggle(400).toggleClass('open');

        setTimeout(showRoot, 400)
    }

    function ref(e) {
        var item = $(e.target).closest('.menu__item')

        if (item.hasClass('menu__item--hasSub')) {
            var clonedSubMenu = $(e.target).closest('.menu__item--hasSub').find('.menu__sub').clone()

            menu.html(clonedSubMenu).append('<button class="menu__back">Назад</button>')
        } else {
            var hash = item.find('a').attr('href')
            if (hash !== "") {
                e.preventDefault();
                toggle()
                $('html, body').animate({
                    scrollTop: $(hash).offset().top
                }, 800, function() {
                    window.location.hash = hash;
                });
            }
        }
    }

    var stickyEl = $('.header__bottom');

    (function() {
        r()

        $(window).on('resize', r);
        $(window).on('scroll', r);

        function r() {
            if ($(window).width() > 991) {
                stickyEl.sticky({ topSpacing: 0 });
                menu.removeAttr('style').removeClass('open')
                menuButton.removeClass('open')
                showRoot()
            } else {
                stickyEl.unstick()
            }
        }
    })()
}

var sendForm = function(btn) {
    $(btn).on('click', function(event) {
        event.preventDefault();
        var form = $(this).closest('form');
        ajax(form);
    });
}

var ajax = function(form) {

    var formtarget = form,
        msg = $(formtarget).serialize(),
        jqxhr = $.post("/ajax.php", msg, onAjaxSuccess);

    function onAjaxSuccess(data) {

        var json = JSON.parse(data),
            status = json.status,
            message = json.message,
            formid = json.form;

        if (status === 'success') {
            $('input, textarea, button[type=submit]').each(function() {
                $(this).prop("disabled", "true");
            });

        }

        addNotify(status, message, formid)

    }

    var addNotify = function(status, msg, form) {
        var popup = $('.response');

        popup.find('.response__text').text(msg)

        if (status === 'error') {
            popup.find('.response__title').text('Что-то пошло не так!')

        } else {
            popup.find('.response__title').text('Ваша заявка принята')
            yaCounter53182684.reachGoal(form);
        }

        $('.response').fadeIn();
        $('.modal').fadeOut();
        $('.popup').fadeOut();

        setTimeout(function() {
            $('.response').fadeOut();
        }, 2000)
    }

}

$(function() {
    menu()

    $('.reviews__list').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        dots: true,
        adaptiveHeight: true,
        infinite: false,
        prevArrow: '<button type="button" class="slick-prev">пред</button>',
        nextArrow: '<button type="button" class="slick-next">след</button>'
    })
});