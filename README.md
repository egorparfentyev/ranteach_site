# ranteach

Учебная платформа для подготовки к ОГЭ: математика в зелёной палитре и физика в фиолетовой. Переключатель предметов доступен сверху на каждой странице.

## Содержание

- Физика: кинематика, 60 задач, материалы занятий, интерактивные лаборатории и сравнение Земли и Луны.
- Математика: 284 задания, 11 методичек, конспекты, варианты и интерактивы.
- ФИПИ: отобранные задания, демоверсия 2026 и опубликованный проект демоверсии 2027. Подробные источники — `public/math/SOURCES.txt`.
- Результаты сохраняются в браузере ученика отдельно по предметам. Учётные записи и синхронизация между устройствами пока не подключены.

## Проверка и локальный запуск

```sh
node scripts/check-site.mjs
python3 -m http.server 8767 --directory public
```

Откройте `http://localhost:8767/`. Файлы сайта находятся в `public/`; сборка и установка зависимостей для сайта не требуются.

## Firebase Hosting

Целевой адрес: **https://ranteach.web.app/**. Проект Google Cloud — `ranteach`; в `firebase.json` задано имя Hosting site `ranteach`. Состояние публикации видно во вкладке [Actions](https://github.com/egorparfentyev/ranteach_site/actions).

Для ручной публикации владельцем проекта:

```sh
firebase login
firebase deploy --only hosting --project ranteach
```

Версия Firebase CLI в автоматической публикации зафиксирована: `15.34.0`. Исходные файлы берутся из `public/`; маршруты физики и математики обслуживаются отдельно через их `index.html`.

## Автопубликация из GitHub Actions

Workflow `.github/workflows/firebase-hosting.yml` выполняет проверки и публикует `public/` в live-канал после каждого push в `main`. Есть ручной запуск через Actions → Run workflow.

GitHub получает временные права через Google Workload Identity Federation. Загружать приватный ключ в GitHub Secrets и задавать переменные репозитория не требуется.

- Project: `ranteach`, номер `376093963405`.
- Provider: `projects/376093963405/locations/global/workloadIdentityPools/ranteach-github/providers/ranteach-main`.
- Service account: `ranteach-github-deploy@ranteach.iam.gserviceaccount.com`.
- Доступ ограничен числовыми ID владельца и репозитория, веткой `main` и файлом `.github/workflows/firebase-hosting.yml`.
- Аккаунту публикации выданы роли Firebase Hosting Admin и Service Usage Consumer. Приватные ключи для него не создавались.

При переносе репозитория или переименовании workflow нужно обновить условие доверия в Google Cloud. Временные файлы `gha-creds-*.json` исключены из Git и автоматически удаляются действием авторизации.

Публикация подтверждена только после успешного шага **Deploy to ranteach.web.app**. Если шаг завершился ошибкой, прежняя опубликованная версия продолжает работать.

Документация: [Google GitHub Auth](https://github.com/google-github-actions/auth), [Firebase CLI для CI](https://firebase.google.com/docs/cli#cli-ci-systems).
