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
            if ($(document).width() < 992) {
                var clonedSubMenu = $(e.target).closest('.menu__item--hasSub').find('.menu__sub').clone()

                menu.html(clonedSubMenu).append('<button class="menu__back">Назад</button>')
            }
        } else {
            var hash = item.find('a').attr('href')
            if (hash !== "") {
                e.preventDefault();
                if ($(document).width() < 992) {
                    toggle()
                }
                var scroll = $(hash).offset().top - 100
                $('html, body').animate({
                    scrollTop: scroll
                }, 800);
            }
        }
    }

    var stickyEl = $('.header__bottom');

    (function() {
        r()

        $(window).on('resize', function() {
            r(), scrollDetection()
        });
        $(window).on('scroll', function() {
            r(), scrollDetection()
        });

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

        function scrollDetection() {
            var sections = $('section')
            $('.menu__item').removeClass('active')

            sections.each(function(index, el) {
                $(el).isOnScreen(function(deltas) {
                    if (deltas.top > this.height() / 2 && deltas.bottom > this.height() / 2) $('.menu__item a[href="#' + $(el).attr('id') + '"]').closest('.menu__item').addClass('active')
                })
            });
        }

        $.fn.isOnScreen = function(test) {

            var height = this.outerHeight();
            var width = this.outerWidth();

            if (!width || !height) {
                return false;
            }

            var win = $(window);

            var viewport = {
                top: win.scrollTop(),
                left: win.scrollLeft()
            };
            viewport.right = viewport.left + win.width();
            viewport.bottom = viewport.top + win.height();

            var bounds = this.offset();
            bounds.right = bounds.left + width;
            bounds.bottom = bounds.top + height;

            var deltas = {
                top: viewport.bottom - bounds.top,
                left: viewport.right - bounds.left,
                bottom: bounds.bottom - viewport.top,
                right: bounds.right - viewport.left
            };

            if (typeof test == 'function') {
                return test.call(this, deltas);
            }

            return deltas.top > 0 &&
                deltas.left > 0 &&
                deltas.right > 0 &&
                deltas.bottom > 0;
        };

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
            $('input, textarea, button[type=submit], .js-submit').each(function() {
                $(this).prop("disabled", "true");
            });
        }

        addNotify(status, formid)

    }

    var addNotify = function(status, msg, form) {
        var popup = $('#response');

        if (status === 'error') {
            popup.addClass('error')
            popup.find('.modal__text').html('Без номера телефона мы не сможем Вам помочь.')
        } else {
            popup.removeClass('error').addClass('success')
            popup.find('.modal__text').html('Спасибо за ваше доверие!<br>В ближайшее время мы вам перезвоним.')
            // yaCounter53182684.reachGoal(form);
            setTimeout(function() {
                popup.fadeOut();
            }, 3000)
        }

        $('.modal').fadeOut();
        popup.fadeIn();
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

        overlay.fadeOut(300, function() {
            $(box).removeAttr('style')
        })
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

    mobileSlick($(".popular__list"), {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
        infinite: false,
        adaptiveHeight: true
    })

    mobileSlick($(".guarantees__list"), {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
        infinite: false,
        adaptiveHeight: true,
        filter: $(".guarantees__item--3")
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

function map() {
    /*YA.Map*/

    ymaps.ready(function() {
        var myMap = new ymaps.Map('map', {
                center: [55.751574, 37.573856],
                zoom: 8,
                behaviors: ['default', 'scrollZoom']
            }, {
                searchControlProvider: 'yandex#search'
            }),
            clusterer = new ymaps.Clusterer({
                preset: 'islands#invertedBlueClusterIcons',
                groupByCoordinates: false,
                clusterDisableClickZoom: true,
                clusterHideIconOnBalloonOpen: false,
                geoObjectHideIconOnBalloonOpen: false
            }),

            getPointData = function(index) {
                return {
                    balloonContentBody: 'Мастер ' + index,
                    clusterCaption: 'Мастер ' + index
                };
            },

            getPointOptions = function() {
                return {
                    preset: 'islands#blueCircleDotIcon'
                };
            },
            points = [
                [55.768672, 37.628633],
                [55.810648, 37.562371],
                [55.829204, 37.661935],
                [55.803301, 37.405816],
                [55.794018, 37.298013],
                [55.905266, 37.720300],
                [55.940441, 37.509278],
                [55.893397, 37.605408],
                [55.775923, 37.896546],
                [55.753946, 37.622607],
                [55.752204, 37.635653],
                [55.770207, 37.627756],
                [55.727993, 37.669299],
                [55.802465, 37.808206],
                [55.802078, 37.720659],
                [55.802658, 37.500589],
                [55.662271, 37.862544],
                [55.620159, 37.735129],
                [55.628318, 37.647925],
                [55.679176, 37.632132],
                [55.690038, 37.522268],
                [55.644631, 37.397986],
                [55.534486, 37.037221],
                [55.630088, 37.855000],
                [55.638481, 37.842307],
                [55.611227, 38.099245],
                [55.622460, 38.098607],
                [55.588857, 38.146124],
                [55.652157, 37.869779],
                [55.913768, 37.996886],
                [55.838884, 37.956377],
                [55.794531, 37.964296],
                [55.940577, 37.502911],
                [55.969517, 37.499392],
                [55.966039, 37.497182],
                [55.994510, 37.215768],
                [55.983381, 37.157727],
                [55.503626, 37.553973],
                [55.552250, 37.717715],
                [55.930051, 37.817122],
                [55.691170, 37.898971],
                [55.679193, 37.896353],
                [56.008613, 37.821605],
                [55.983060, 37.845699],
                [55.892842, 37.445173],
                [55.893180, 37.432942]
            ],
            geoObjects = [];

        for (var i = 0, len = points.length; i < len; i++) {
            geoObjects[i] = new ymaps.Placemark(points[i], getPointData(i), getPointOptions());
        }

        clusterer.options.set({
            gridSize: 80,
            clusterDisableClickZoom: true
        });

        clusterer.add(geoObjects);
        myMap.geoObjects.add(clusterer);

        myMap.setBounds(clusterer.getBounds(), {
            checkZoomRange: true
        });

    });

    /*YA.Map*/
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

    geo()

    map()
});