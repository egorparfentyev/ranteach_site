# RanTeach

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

Целевой адрес: **https://ranteach.web.app/**. До подтверждённого создания Hosting site и успешного первого deployment этот адрес является желаемым, а не действующим адресом данной платформы.

`firebase.json` указывает на Hosting site `ranteach`. Firebase project может иметь другой ID. Создание проекта, проверка владения сайтом и подключение GitHub требуют входа владельца в соответствующие сервисы.

Для нового проекта после входа:

```sh
firebase login
firebase projects:list
# Создайте или выберите свой Firebase project.
firebase hosting:sites:create ranteach --project YOUR_PROJECT_ID
firebase deploy --only hosting --project YOUR_PROJECT_ID
```

`ranteach` — глобально уникальный site ID. Если Firebase сообщит, что он уже занят другим проектом, использовать этот адрес без владения проектом нельзя: потребуется согласовать другой адрес.

## Автопубликация из GitHub Actions

Workflow `.github/workflows/firebase-hosting.yml` выполняет проверки и публикует `public/` в live-канал после каждого push в `main`. Есть ручной запуск через Actions → Run workflow.

Для подключения настройте в репозитории Settings → Secrets and variables → Actions:

- Repository variable **FIREBASE_PROJECT_ID** — фактический ID Firebase project.
- Repository secret **FIREBASE_SERVICE_ACCOUNT_RANTEACH** — JSON сервисного аккаунта этого проекта с правами деплоя Firebase Hosting.

Официальный способ создать сервисный аккаунт и сохранить его ключ непосредственно в GitHub Secret: `firebase init hosting:github`. Ключ не должен добавляться в файлы репозитория. В этом репозитории уже подготовлен workflow; после подключения сохраните один live workflow, чтобы не запускать две публикации.

После настройки откройте первый запуск Actions и убедитесь, что шаг Deploy завершился успешно. Обновление репозитория считается опубликованным только после успешного запуска; одна загрузка workflow не подтверждает работающую интеграцию.

Документация Firebase: https://firebase.google.com/docs/hosting/github-integration
