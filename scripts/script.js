// Инициализация анимаций при прокрутке страницы.
if (typeof WOW !== 'undefined') {
    new WOW({
        animateClass: 'animate__animated',
    }).init();
}

$(function () {
    // Слайдер каталога.
    if ($.fn.slick) {
        $('.macaroons').slick({
            slidesToShow: 4,
            slidesToScroll: 1,
            arrows: true,
            dots: false,
            prevArrow: '<button class="slider-arrow prev" type="button" aria-label="Предыдущие товары"><img src="images/prev.png" alt=""></button>',
            nextArrow: '<button class="slider-arrow next" type="button" aria-label="Следующие товары"><img src="images/next.png" alt=""></button>',
            responsive: [
                { breakpoint: 1024, settings: { slidesToShow: 3 } },
                { breakpoint: 769, settings: { slidesToShow: 2 } },
                { breakpoint: 426, settings: { slidesToShow: 1 } }
            ]
        });
    }

    const menu = document.getElementById('menu');
    const burger = document.getElementById('burger');
    const closeButton = document.querySelector('.menu-close');

    function closeMenu() {
        menu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
    }

    burger.addEventListener('click', function () {
        menu.classList.add('open');
        burger.setAttribute('aria-expanded', 'true');
    });

    closeButton.addEventListener('click', closeMenu);
    menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closeMenu();
    });

    // Кнопки каталога подставляют выбранный товар в форму.
    function selectProduct(button) {
        const card = button.closest('.macaroons-item');
        const title = card.querySelector('.macaroons-item-title').textContent.trim();
        $('#product').val(title).trigger('input');
        document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
    }

    document.querySelectorAll('.macaroons-item .button-mac').forEach(function (button) {
        button.addEventListener('click', function () {
            selectProduct(button);
        });
    });

    document.getElementById('choose-macaroon').addEventListener('click', function () {
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });

    const loader = $('.loader');
    const message = $('.message');
    const orderForm = $('.order-form');
    const product = $('#product');
    const name = $('#name');
    const phone = $('#phone');

    // Скрываем сообщение об ошибке и возвращаем обычную рамку при вводе.
    $('.order-input').on('input', function () {
        $(this).css('border-color', '');
        $(this).next('.input-error').hide();
    });

    $('#submit').on('click', function () {
        let hasError = false;
        const phoneDigits = phone.val().replace(/\D/g, '');

        $('.input-error').hide();
        $('.order-input').css('border-color', '');

        [product, name, phone].forEach(function (field) {
            if (!field.val().trim()) {
                field.css('border-color', 'red');
                field.next('.input-error').show();
                hasError = true;
            }
        });

        if (phone.val().trim() && phoneDigits.length < 7) {
            phone.css('border-color', 'red');
            phone.next('.input-error').text('Проверьте номер телефона').show();
            hasError = true;
        }

        if (hasError) return;

        $('#submit').prop('disabled', true);
        loader.css('display', 'flex');

        $.ajax({
            method: 'POST',
            url: 'https://testologia.ru/checkout',
            data: {
                product: product.val().trim(),
                name: name.val().trim(),
                phone: phone.val().trim()
            },
            dataType: 'json'
        })
            .done(function (response) {
                if (response && response.success) {
                    orderForm.hide();
                    message.css('display', 'flex');
                } else {
                    alert('Не удалось оформить заявку. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.');
                }
            })
            .fail(function () {
                alert('Сервис приёма заявок временно недоступен. Попробуйте позже.');
            })
            .always(function () {
                loader.hide();
                $('#submit').prop('disabled', false);
            });
    });
});
