# RSS агрегатор

[![Actions Status](https://github.com/imavladmay/frontend-project-11/workflows/hexlet-check/badge.svg)](https://github.com/imavladmay/frontend-project-11/actions) [![my-check](https://github.com/imavladmay/rss-reader/actions/workflows/my-check.yml/badge.svg)](https://github.com/imavladmay/rss-reader/actions/workflows/my-check.yml) [![Maintainability](https://api.codeclimate.com/v1/badges/f71bf188f5c7adf65760/maintainability)](https://codeclimate.com/github/imavladmay/rss-reader/maintainability)

### Возможности сервиса:

- Добавление неограниченного количества фидов
- Обновление списка постов в режиме реального времени
- Предварительный просмотр постов
- Переход к источнику поста для полного просмотра

### Инструкция по использованию:

Откройте страницу [сервиса](https://rss-reader-beryl.vercel.app/)

В поле для ввода введите валидный URL-адрес и нажмите на кнопку "Добавить". Сервис выполнит скачивание и парсинг RSS-потока, а затем отобразит данные в удобном формате. Для предварительного просмотра постов нажмите на кнопку "Просмотр". Появится модальное окно с краткой информацией о посте. Вы можете закрыть его или перейти к источнику поста для полного просмотра. Также, вы можете перейти к источнику поста, кликнув по его заголовку.

### Инструкция по локальному развертыванию:

1. Запустите терминал и склонируйте репозиторий в вашу домашнюю директорию
   `git clone https://github.com/imavladmay/rss-reader.git`
2. Перейдите в склонированный репозиторий `cd rss-reader`
3. Выполните команду `make install`
4. Выполните команду `make link`
5. Для сборки приложения в режиме разработки выполните команду `make dev`, в продакшен режиме `make build`
