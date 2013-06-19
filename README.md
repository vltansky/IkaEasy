# IkaEasy

## ВНИМАНИЕ
Движок расширения писался под версию **0.5.0**, в связи с тем что в игра регулярно
обновляется, движок, частично или полностью, мог устареть.

У меня к сожалению нет ни времени, ни желания заниматься расширением, посему
я отдаю его на растерзание всем.


##Структура:
* **css**     - папка со стилями
* **icon**    - папка с иконками
* **images**  - папка с картинками используемыми расширением
* **inner**   - скрипты, подключаемые на старницу тегом <script>
* **langs**   - языки
* **page**    - папка со скрипатами отвечающими за действия на страницах
* **zJS**     - "движок"

##Добавление нового скрипта
Создаете файт с произвольным именем в папке `page`.

Заполняете фейл:

    :::javascript
        if (typeof zJS == "undefined") {
            zJS = {};
        }

        if (typeof zJS.Page == "undefined") {
            zJS.Page = {};
        }

        zJS.Page.TEMPLATE_ID = {
            dont_refresh : false,

            init : function() {

            },

            refresh : function() {

            }
        };

`zJS.Page.TEMPLATE_ID` - заместо `TEMPLATE_ID` необходимо указать значение переменной `ikariam.templateView.id` или
`ikariam.backgroundView.id`, по изменении которой должен вызваться этот скрипт.

И в завершении, прописываете его в `manifest.json`, в конец очень длиной строки, к которой уже прописаны остальные файлы.


##Принцип работы
Все скрипты отвечающие за работу на той или иной странице игры находятся в папке `page`.

Скрипт `__common.js` выполняется на каждой странице.

Все остальные скрипты выполняются по мере необходимости, в зависимости от значения переменный `ikariam.templateView.id` и `ikariam.backgroundView.id`.


###Принцип работы скрипта
Переменная `dont_refresh` определяет, нужно ли переинициализировать скрипт, при обновлении шаблона.

функция `init` вызаывается для инициализации скрипта, когда этот скрипт вызван для работы.

Функция `refresh` вызывается при обновлении скрипта (например смена города, или по timeout-у).


##Добавление скриптов
При добавлении (удалении, перемещении, переименовывании) файлов скриптов, необходимо добавить информацию об этом в файл `manifest.json`

##Добавление изображений
При добавлении (удалении, перемещении, переименовывании) файлов с картинками в папке `image`, необходимо добавить информацию об этом в файл `manifest.json`

