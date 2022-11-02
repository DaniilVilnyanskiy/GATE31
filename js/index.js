window.onload = function(){
    const section = document.querySelector('section');
    const container = section.querySelector('.container');

    function createContainerElements(title, text) {
        const containerElement = `
            <div class="container__element p-10">
                <div class="container__title first-title m-b-10">${title}</div>
                <div class="container__body">
                    <p class="text">${text}</p>
                    <input type="checkbox">
                </div>
            </div>
            `
        return containerElement;
    }

    function changeGetParametr(inputValue, reset) {
        if (reset) {
            window.location.search = '';
            return;
        }

        var param1 = '?value=' + inputValue;

        // второй параметр
        // var param2 = '&value=' + key;
        // TODO:
        // с перезагрузкой
        //
        // if (window.location.search == '') {
        //     window.location.href += param1;
        // }
        // if (window.location.search == '?value=' + key) {
        //     window.location.href += param2;
        // }

        // без перезагрузки
        if (window.location.search == "") {
            history.pushState(null, null, param1);
        }
        if (window.location.search) {
            history.pushState(null, null, param1);
        }

    }
    function filterLists(valueGetParametr) {
        const elements = container.querySelectorAll('.container__element')
        elements.forEach((element) => {
            const title = element.querySelector('.container__title');
            console.log(title.innerHTML);
            if (title.innerHTML.indexOf(valueGetParametr) > -1) {
                console.log(element)
                element.classList.remove('d-none')
            } else {
                element.classList.add('d-none')
            }
        })
        console.log(elements);
    }

    function getParametr() {
        // const get = window.location.search.replace( '?', '');
        var params = window.location.search
            .replace('?','')
            .split('&')
            .reduce(
                function(p,e){
                    var a = e.split('=');
                    p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
                    return p;
                },
                {}
            );
        filterLists(params['value'])
    }

    function handlerSearch(input, warning) {
        const inputValue = input.value;
        if ( inputValue.search(/\d/) != -1 ) {
            warning.classList.add('active');
            warning.innerHTML = 'Введите буквы';
            input.value = '';
        } else {
            changeGetParametr(inputValue)
            getParametr()
        }
    }

    function init(data) {
        let stringParam = window.location.href.split('?')[1].split('&').map((el) => {return el.split('='); return el;});
        console.log(stringParam);

        const searchContainer = section.querySelector('.search-container')
        const warning = searchContainer.querySelector('.search-container__warning')
        const input = searchContainer.querySelector('input');
        const submit = searchContainer.querySelector('#submit');
        const reset = searchContainer.querySelector('#reset');

        data.forEach((obj) => {
            container.insertAdjacentHTML('beforeend',createContainerElements(obj.title, obj.body))
        })

        submit.addEventListener('click', () => handlerSearch(input, warning))
        reset.addEventListener('click', () => changeGetParametr('', true))
    }

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
