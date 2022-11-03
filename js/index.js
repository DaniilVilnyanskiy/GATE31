window.onload = function(){
    const section = document.querySelector('section');
    const container = section.querySelector('.container');

    /**
     * Шаблон для рендера элементов на странице
     * @param title - title из апи
     * @param text - body из апи
     * @returns {string}
     */
    function createContainerElements(title, text) {
        return `
            <div class="container__element p-10">
                <div class="container__title first-title m-b-10">${title}</div>
                <div class="container__body">
                    <div class="container__body_text"><p class="text">${text}</p></div>
                    <input type="checkbox">
                </div>
            </div>
            `
    }

    /**
     * Изменение гет параметра (при поиске и при резете)
     * @param inputValue - значение инпута (для поиска)
     * @param reset - сброс гет параметра
     */
    function changeGetParametr(inputValue, reset) {
        if (reset) {
            window.location.search = '';
            return;
        }

        // TODO: здесь нужно дописать хранение других гет параметров, сейчас всё сбрасывается
        //- без перезагрузки
        var param1 = '?value=' + inputValue;
        if (window.location.search === '') {
            history.pushState(null, null, param1);
        }
        if (window.location.search) {
            history.pushState(null, null, param1);
        }

        //- с перезагрузкой

        //- второй параметр
        //- var param1 = '?value=' + inputValue;
        //- var param2 = '&value=' + key;
        //- if (window.location.search == '') {
        //-     window.location.href += param1;
        //- }
        //- if (window.location.search == '?value=' + key) {
        //-     window.location.href += param2;
        //- }
    }

    /**
     * Фильтрация элементов на странице по ключу key из гет параметра
     * @param key
     */
    function filterLists(key) {
        const elements = container.querySelectorAll('.container__element')
        elements.forEach((element) => {
            const title = element.querySelector('.container__title');

            if (title.innerHTML.indexOf(key) > -1) {
                element.classList.remove('d-none')
            } else {
                element.classList.add('d-none')
            }
        })
    }

    /**
     * Получение гет параметра и проверка его на нужное нам значение
     */
    function getParametr() {
        let value, key;
        //- отделение значение гет параметров от ключей и добавление в массив
        let stringParam = window.location.href
            .split('?')[1]
            .split('&')
            .map((el) => {return el.split('=');});

        //- перебор массива
        stringParam.forEach((param, index) => {
            key = param[0] === 'value' ? param[1] : false;
            value = param[0] === 'value' ? param[0] : false
        })
        if (!value) return;

        //- запуск фильтрации элементов на странице
        filterLists(key)
    }

    /**
     * Простая проверка на введённые данные в инпуте
     * @param input
     * @param warning - блок предупреждения
     */
    function handlerSearch(input, warning) {
        const inputValue = input.value;

        //- TODO: дописать валидацию формы
        if ( inputValue.search(/\d/) != -1 ) {
            warning.classList.add('active');
            warning.innerHTML = 'Введите буквы';
            input.value = '';
        } else {
            changeGetParametr(inputValue)
            getParametr()
        }
    }

    /**
     * Добавление/удаление активного класса для элементов
     * @param e
     */
    function toggleClassColor(e) {
        const parentElement = e.target.closest('.container__element');
        parentElement.classList.toggle('input-checked');
    }

    /**
     * Событие изменение чекбокса
     */
    function handlerCheckbox() {
        const checkbox = container.querySelectorAll('input[type="checkbox"]');
        checkbox.forEach((item) => {
            item.addEventListener('input', (e) => toggleClassColor(e))
        })
    }

    /**
     * Рендер
     * @param data
     */
    function createElements(data) {
        data.forEach((obj) => {
            container.insertAdjacentHTML('beforeend',createContainerElements(obj.title, obj.body))
        })
        handlerCheckbox()
    }

    /**
     * Отвечает за рендер элементов на странице и вешает событие клика на кнопки около инпута
     * @param data - результат запроса к апи
     */
    function init(data) {
        //- инициализация элементов
        const searchContainer = section.querySelector('.search-container')
        const warning = searchContainer.querySelector('.search-container__warning')
        const input = searchContainer.querySelector('input');
        const submit = searchContainer.querySelector('#submit');
        const reset = searchContainer.querySelector('#reset');

        //- рендер элементов
        createElements(data);

        //- события
        submit.addEventListener('click', () => handlerSearch(input, warning))
        reset.addEventListener('click', () => changeGetParametr('', true))
    }

    /**
     * при загрузке запрос к апи
     */
    async function request() {
        const data = await fetch('https://jsonplaceholder.typicode.com/posts/?_start=0&_limit=7', {
            method: 'GET'
        })
            .then((result) => result.json())
            .catch((error) => console.log('Ошибка: ', error))
        init(data)
    }
    request()
};
