(function () {

    // consts
    const API_KEY= 'o3pPmS9h6RgJmxIAC3pXnTUBtKv0eQWS';
    const DOM = {
        TITLE: document.querySelector('.gifs-title'),
        INPUT: document.querySelector('input'),
        FORM: document.querySelector('form'),
        GIFS: document.querySelector('.gifs')
    };

    const cache = {};

    /**
     * Метод, который возращаеет url - адрес (фиксированный)
     *
     * @param q - имя запроса
     * @returns {string} - адресная строка
     */
    const getGifUrl = q =>`http://api.giphy.com/v1/gifs/search?q=${q}&api_key=${API_KEY}`;

    /**
     * Возвращает img - элемент
     *
     * @param img
     * @returns {string}
     */
    const createGif = img => `<img src="${img.src}" alt="${img.title}">`;

    /**
     * Метод конвертации. Делаем хранение данных более проще.
     * @param gifsInfo - старый объект
     * @returns {Uint8Array | BigInt64Array | {src: *, title: *}[] | Float64Array | Int8Array | Float32Array | Int32Array | Uint32Array | Uint8ClampedArray | BigUint64Array | Int16Array | Uint16Array}
     */
    const convertGifs = gifsInfo => {
        return gifsInfo.map( gifInfo => {
            return { src: gifInfo.images.preview_gif.url,
                     title: gifInfo.title}
        })
    }

    /**
     * Cохраняем данные в кэш
     * @param key -  ключ
     * @param data - данные
     */
    const saveData = (key, data) => {
        cache[key] = data;
    }

    /**
     * Получаем данные из кэша по ключу
     * @param key - ключ
     * @returns {*} - данные
     */
    const getData = (key) => {
        return cache[key];
    }

    /**
     * Отрисовываем гифки на странице
     * @param gifs - гифки
     */

    const renderGifs = gifs => {
        gifs.forEach( gif => {
            DOM.GIFS.innerHTML += createGif(gif)
        })
    }

    /**
     * Отрисовываем залоговок на странице
     * @param title
     */
    const renderTitle = title => {
        DOM.TITLE.innerHTML = title;
    }

    /**
     * Отчищаем гифки при перезагрузке стриницы
     */
    const clearGifs = () => {
        DOM.GIFS.innerHTML = '';
    }

    /**
     * Метод apiCall подсоединяется к серверу по указанному url, получает от него данные и отрисовывает их в браузере
     * @returns {Promise<void>}
     */
    async function apiCall(event) {
        event.preventDefault();
        const text = DOM.INPUT.value;


        if (!cache.hasOwnProperty(text)) {

            setTimeout(async () => {
                const response = await fetch(getGifUrl(text));
                const data = await response.json();

                const gifsInfo = data.data;
                const gifs = convertGifs(gifsInfo);

                saveData(text, gifs);

                clearGifs();
                renderTitle(text);
                renderGifs(gifs);
                }, 500)
        } else {
            const gifs = getData(text);

            clearGifs();
            renderTitle(text);
            renderGifs(gifs);
            }
        }

    DOM.FORM.addEventListener('submit', apiCall)
})();



