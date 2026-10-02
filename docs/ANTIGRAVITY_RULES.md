# SkyPlan — Antigravity IDE Rules

## 1. Role

Antigravity is the implementation assistant for SkyPlan.

The repository documentation is the primary technical basis for implementation, while the academic proposal remains the source of project scope and objectives.

## 2. Read Before Coding

Before making implementation changes, read:
1. `PROJECT_CONTEXT.md`
2. `REQUIREMENTS.md`
3. `FEATURE_SPECIFICATION.md`
4. `SYSTEM_ARCHITECTURE.md`
5. `DATABASE_DESIGN.md`
6. `API_SPECIFICATION.md`
7. `RECOMMENDATION_ENGINE.md`
8. `AUTHORIZATION_MATRIX.md`
9. `UI_UX_SPECIFICATION.md`
10. `IMPLEMENTATION_PLAN.md`

Then inspect the actual repository state.

## 3. Planning Rule

For substantial changes:
- inspect first;
- explain the current state;
- identify affected files/modules;
- propose the implementation;
- identify risks;
- then implement when authorized.

Do not blindly rewrite the project.

## 4. Scope Rule

Do not add unrelated features simply because they are technically possible.

If a requested feature is outside the proposal:
1. identify it as a scope addition;
2. explain what it affects;
3. document it before implementation.

## 5. Proposal Consistency

Do not silently change:
- project purpose;
- objectives;
- target users;
- core scope;
- out-of-scope boundaries.

If implementation requires a change, flag it explicitly.

## 6. Security Rules

Never:
- hard-code secrets;
- commit `.env` files containing secrets;
- expose OpenWeatherMap API keys in frontend code;
- trust client-provided roles;
- store plaintext passwords.

Use environment variables and secure authentication practices.

## 7. Database Rules

- Use migrations for schema changes.
- Preserve foreign-key integrity.
- Avoid destructive migrations without explicit approval.
- Avoid duplicate data where normalization is appropriate.
- Preserve user ownership boundaries.

## 8. API Rules

- Validate input.
- Return predictable errors.
- Protect authenticated endpoints.
- Protect admin endpoints.
- Handle OpenWeatherMap failures gracefully.
- Do not expose internal secrets or sensitive database details.

## 9. Frontend Rules

- Do not implement fake functionality that looks complete.
- Loading, empty, success, and error states should be considered part of a feature.
- Keep API calls organized.
- Keep secrets out of client code.
- Ensure responsive behavior.

## 10. Recommendation Engine Rules

Keep recommendation logic explainable and rule-based unless the project explicitly changes scope.

Do not introduce an AI recommendation system without a documented project decision.

## 11. Verification Rule

After each implementation phase:
- run relevant tests/checks;
- verify the browser flow;
- verify API/database behavior;
- inspect errors;
- fix regressions.

## 12. Git Rule

Before major changes:
- ensure the working state is known;
- commit stable milestones;
- avoid destructive commands unless explicitly authorized.

After successful milestones, update `CHANGELOG.md`.

## 13. Documentation Rule

If implementation differs from the documentation:
- update the relevant `.md` file;
- record the change in `CHANGELOG.md`;
- identify whether the academic proposal may need revision.

## 14. No Assumption Rule

When the proposal does not define a value, do not invent it and present it as a requirement.

Examples:
- exact guest search quota;
- exact database hosting provider;
- exact visual design;
- exact recommendation scoring formula;
- exact API endpoint names.

Mark such decisions as implementation choices and document them.

## 15. Completion Rule

Do not report a feature as complete merely because:
- a route exists;
- a page renders;
- a button is visible;
- mock data is displayed.

A feature is complete when its intended flow works with the appropriate backend, persistence, authorization, validation, and error handling.
