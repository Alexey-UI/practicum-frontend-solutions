# Эталоны проектных работ Практикума

Проверенные решения курса фронтенд-разработки. Код лежит в `projects/`,
а `projects.json` закрепляет полный SHA для программы автоматизации.

| Работа | Код | Официальная проверка |
| --- | --- | --- |
| Оно тебе надо | [projects/ono-tebe-nado-ad](projects/ono-tebe-nado-ad/) | [Успешно](https://github.com/Alexey-UI/ono-tebe-nado-ad/actions/runs/39151957881) |
| Посмотри в окно | [projects/posmotri-v-okno-ad](projects/posmotri-v-okno-ad/) | [Успешно](https://github.com/Alexey-UI/posmotri-v-okno-ad/actions/runs/39161336683) |
| Сложно сосредоточиться | [projects/slozhno-sosredotochitsya-ad](projects/slozhno-sosredotochitsya-ad/) | [Успешно](https://github.com/Alexey-UI/slozhno-sosredotochitsya-ad/actions/runs/39166562329) |

| Закрывающий тег | [projects/zakrivayuschiy-teg-ad](projects/zakrivayuschiy-teg-ad/) | Принят Практикумом; [GitHub-тесты содержат несовместимый вызов Puppeteer](https://github.com/Alexey-UI/practicum-assistant/blob/main/docs/official-checker-compatibility.md) |
| To-do | [projects/to-do](projects/to-do/) | Локальные проверки прошли; по курсу требуется ручная приёмка преподавателем. Сдача не отправлялась |

Практикум создаёт отдельный репозиторий сдачи в привязанном GitHub.
Автоматизация переносит в него файлы эталона, сохраняя `.git` и оригинальный
workflow `.github/workflows/`. Прохождение урока проверяется отдельно после
отправки через интерфейс платформы.
