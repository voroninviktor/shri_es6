Что где лежит:

`req.ts` - класс, реалующий требуемый функционал

`eventEmitter` - эмиттер.

`app.ts` - небольшое приложение, использующее либу

Библиотека имеет следующий функционал:

Объекты класса `Req` имеют методы `get()` и `post()`, которые можно чейнить следующим образом:

```
req
  .get("https://swapi.co/api/films/", onResolve, onReject)
  .get("https://swapi.co/api/people/", onResolve, onReject)
  .get("https://yandex.ru/404", onResolve, onReject);
```

в onResolve и onReject прилетают:

* 1 агрументом объект типа `Response` - результат текущего запроса
* 2 агрументом объект типа `Response` - результат предыдущего запроса. Либо `null`, если это первый запрос

`onReject` вызывается в случае если у результата запроса `Response.ok !== true`

Под капотом используется `fetch` (при использовании на бэке используется `node-fetch`)

Из новых возможностей es6 используются

* классы
* async/await
* desctucturing assignment
* импорты экспорты
* let const
* мб еще что то...
