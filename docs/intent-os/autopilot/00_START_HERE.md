# Other Bali Intent OS — Zero-Touch Autopilot

## Решение

Использовать **Claude Code как единственный оркестратор и основной исполнитель**.

- Claude Code нормализует данные, ведёт state machine, создаёт артефакты, проверяет их и реализует пилот.
- Codex подключается автоматически только как независимый reviewer, если Codex CLI/SDK доступен в окружении.
- Manus, GenSpark, Gemini и Hermes больше не принимают архитектурные решения. Их материалы используются только как входные данные.
- Владелец продукта не участвует в промежуточных согласованиях.

## Одно действие для запуска

1. Распаковать эту папку в корень репозитория Other Bali как:

```text
docs/intent-os/autopilot/
```

2. Из корня репозитория запустить Claude Code и передать ему файл:

```text
docs/intent-os/autopilot/02_CLAUDE_CODE_MASTER_GOAL.md
```

Или в non-interactive режиме:

```bash
claude -p "/goal Read docs/intent-os/autopilot/02_CLAUDE_CODE_MASTER_GOAL.md and execute it until its final completion condition is satisfied"
```

## Что будет сделано без участия владельца

1. Проверка входных файлов.
2. Нормализация OB-INT-0001–OB-INT-0200.
3. Создание Canonical Intent Library V0.1.
4. Сопоставление с внутренними слоями Hermes.
5. Surface mapping и data readiness.
6. Отбор 20–30 action jobs.
7. SERP/keyword validation доступными средствами.
8. Автоматический выбор winner/backup либо безопасный статус NO_BUILD.
9. Reuse audit текущих `/plan` и `/my-day`.
10. Product brief.
11. Реализация пилота в изолированной ветке/worktree.
12. Тесты, preview и PR.
13. Независимый review Codex, если доступен.
14. Финальный audit log и следующий автоматический статус.

## Политика отсутствия вопросов

Агент не должен задавать owner questions. При неопределённости он обязан применять консервативный default:

- нет evidence → `UNVERIFIED`;
- конфликт → `AUTO_HOLD`;
- нет данных → `BLOCKED_BY_DATA`;
- medical/legal/safety → `RESEARCH_ONLY`, без автопубликации;
- нет кандидата с проходным баллом → `NO_BUILD`;
- непроходимые тесты → `FAILED_GATE`, без merge/deploy.

Никаких бодрых догадок. Они и раньше прекрасно размножались без приглашения.
