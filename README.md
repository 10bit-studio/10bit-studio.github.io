# 10BIT - Портфолио сайт

Одностраничный сайт-портфолио для GitHub Pages.

## Как опубликовать на GitHub Pages

1. **Создай репозиторий на GitHub:**
   - Зайди на github.com
   - Нажми "New repository"
   - Назови репозиторий (например, `10bit-portfolio`)
   - Выбери "Public" (для бесплатного GitHub Pages)
   - Нажми "Create repository"

2. **Загрузи файлы:**
   - Загрузите **весь контент из папки `SAIT/`** в корень репозитория:
     - `index.html`
     - `covers/`
     - `projects/`
   - Или используй GitHub Desktop / Git командную строку

3. **Включи GitHub Pages:**
   - Зайди в Settings твоего репозитория
   - Прокрути до раздела "Pages"
   - В "Source" выбери "Deploy from a branch"
   - Выбери ветку "main" (или "master")
   - Нажми "Save"
   - Через пару минут твой сайт будет доступен по адресу: `https://твой-username.github.io/10bit-portfolio/`

## Как добавить свои обложки, фото и видео

### 1) Обложки (сетка на главной)

В `index.html` в блоке `#work` используется сетка из картинок:

```html
<img src="covers/peak.jpg" alt="PEAK GROUP cover" loading="lazy" />
```

Сложи обложки в папку `covers/` и назови как в коде (или поменяй имена файлов в `src="covers/..."`).

### 2) Контент проекта (внутри страницы ниже)

Каждый проект — это секция вида:

```html
<section class="project" id="p-peak">
  <h3 class="project-title">PEAK GROUP</h3>
  <div class="media">
    <img src="projects/peak/photo1.jpg" alt="PEAK GROUP photo" data-zoom="1" />
    <div class="video">
      <iframe src="https://www.youtube.com/embed/VIDEO_ID" allowfullscreen></iframe>
    </div>
  </div>
</section>
```

#### Фото
- Положи файлы в `projects/<project>/...` (например `projects/peak/photo1.jpg`)
- Картинки с `data-zoom="1"` открываются в lightbox по клику

#### Видео
- YouTube: `https://www.youtube.com/embed/VIDEO_ID`
- Vimeo: `https://player.vimeo.com/video/VIDEO_ID`

## Как изменить контакты

Найди секцию `id="contacts"` в `index.html` и замени ссылки:

```html
<a href="mailto:your@email.com">Email</a>
<a href="https://t.me/your_telegram" target="_blank" rel="noreferrer">Telegram</a>
<a href="https://instagram.com/your_instagram" target="_blank" rel="noreferrer">Instagram</a>
<a href="https://behance.net/your_behance" target="_blank" rel="noreferrer">Behance</a>
```

## Как изменить дизайн

Все стили находятся в теге `<style>` внутри `index.html`. Можешь менять:
- Цвета (найди `#0a0a0a`, `#ffffff` и т.д.)
- Размеры шрифтов
- Отступы
- Фоны

## Структура файлов

```
репозиторий/
├── index.html          (главный файл сайта)
├── covers/             (обложки для сетки)
│   ├── peak.jpg
│   ├── valentine.jpg
│   └── ...
└── projects/           (контент проектов)
    ├── peak/
    │   ├── photo1.jpg
    │   └── ...
    └── ...
```

## Полезные ссылки

- [GitHub Pages документация](https://docs.github.com/en/pages)
- Как получить YouTube ID: в ссылке `https://www.youtube.com/watch?v=VIDEO_ID` — это часть после `v=`
