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
        if ($(document).width() < 992) {
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


var ajax = function(form) {

    var formtarget = form,
        msg = $(formtarget).serialize(),
        jqxhr = $.post("/ajax.php", msg, onAjaxSuccess);

    function onAjaxSuccess(data) {

        var json = JSON.parse(data),
            status = json.status,
            formid = json.form;

        if (status === 'success') {
            $('input, textarea, button[type=submit]').each(function() {
                $(this).prop("disabled", "true");
            });
        }

        addNotify(status, formid)

    }

    var addNotify = function(status, msg, form) {
        var popup = $('#response');

        if (status === 'error') {
            popup.addClass('error')
            popup.find('.modal__text').text('Без номера телефона мы не сможем Вам помочь.')
        } else {
            popup.addClass('success')
            popup.find('.modal__text').text('Спасибо за ваше доверие!<br>В ближайшее время мы вам перезвоним.')
            // yaCounter53182684.reachGoal(form);
        }

        $('.modal').fadeOut();
        popup.fadeIn();

        setTimeout(function() {
            popup.fadeOut();
        }, 2000)
    }
}


var modals = function() {

    var overlay

    $('.breakdowns__item').on('click', function(event) {
        event.preventDefault();

        showBreakdown(event)
        open('#breakdowns')
    });

    $('body').on('click', '.js-modal, .table__row', function(event) {
        event.preventDefault();

        open('#callback')
    });

    $('.modal__close').on('click', function(event) {
        event.preventDefault();

        close.call(this)
    });

    function open(box) {
        overlay = $(box)
        box = overlay.find('.modal__box')

        $('body').addClass('fixed')

        overlay.fadeIn(300);
        $({ scale: .5 }).animate({
            scale: 1
        }, {
            duration: 300,
            step: function(now, fx) {
                $(box).css({
                    'transform': 'scale(' + now + ')'
                })
            }
        }, 'linear');
    }

    function close() {
        overlay = $(this).closest('.modal')
        box = overlay.find('.modal__box')

        $('body').removeClass('fixed')

        $({ scale: 1 }).animate({
            scale: 0
        }, {
            duration: 300,
            step: function(now, fx) {
                $(box).css({
                    'transform': 'scale(' + now + ')'
                })
            }
        }, 'linear');

        overlay.fadeOut(300)
    }

    function success() {
        overlay = $(this).closest('.modal')
        box = overlay.find('.modal__box')

        $({ scale: 1 }).animate({
            scale: 1.5
        }, {
            duration: 300,
            step: function(now, fx) {
                $(box).css({
                    'transform': 'scale(' + now + ')'
                })
            }
        }, 'linear');

        overlay.fadeOut(300)
    }

    function showBreakdown(e) {
        var item = $(e.target).closest('.breakdowns__item')

        var icon = item.find('.breakdowns__icon').html(),
            name = item.find('.breakdowns__name').text(),
            price = item.attr('data-price');

        var distContainer = $('#breakdowns')

        distContainer.find('.modal__breakdown-icon').html(icon)
        distContainer.find('.modal__breakdown-name').html(name)
        distContainer.find('.modal__breakdown-price span').html(price)
    }
}

var sliders = function() {

    $('.reviews__list').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        dots: true,
        adaptiveHeight: true,
        infinite: false,
        prevArrow: '<button type="button" class="slick-prev">пред</button>',
        nextArrow: '<button type="button" class="slick-next">след</button>',
        responsive: [{
            breakpoint: 992,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false
            }
        }]
    })

    mobileSlick($(".breakdowns__list"), {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
        infinite: false,
        adaptiveHeight: true
    })

    mobileSlick($(".scheme__list"), {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
        infinite: false,
        adaptiveHeight: true
    })

     mobileSlick($(".popular__list"), {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
        infinite: false,
        adaptiveHeight: true
    })
}


function mobileSlick(el, op) {
    el.slick(op);

    if ($(window).width() > 991) _unslick()

    $(window).on('resize', function() {
        if ($(window).width() > 991) {
            _unslick()
        } else if (!el.hasClass('slick-initialized')) {
            return el.slick(op);
        }
    });

    function _unslick() {
        if (el.hasClass('slick-initialized')) {
            el.slick('unslick');
        }
    }
}

$(function() {
    menu()
    modals()

    sliders()

    $('.table__more').on('click', function(event) {
        event.preventDefault();
        var hiddenItems = $(event.target).closest('.table').find('.table__hidden').html()

        $('.table').find('.table__spacer').before(hiddenItems)

        $(event.target).remove()
    });

    $('.js-submit').on('click', function(event) {
        event.preventDefault();
        var form = $(this).closest('form');
        ajax(form);
    });
});