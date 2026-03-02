# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.7 / Node.js 22
**Primary Dependencies**: Next.js 15 (frontend), NestJS 11 (backend), TypeORM 0.3 (ORM), Redux Toolkit (state), MUI 6 + Tailwind CSS 4 (UI)
**Storage**: MariaDB 11 (via Docker)
**Testing**: Jest + Testing Library (frontend), Jest + Supertest (backend E2E)
**Target Platform**: Docker containers (dev + prod), Node.js server
**Project Type**: web-service (monorepo: apps/api + apps/web)
**Performance Goals**: [NEEDS CLARIFICATION per feature]
**Constraints**: [NEEDS CLARIFICATION per feature]
**Scale/Scope**: [NEEDS CLARIFICATION per feature]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

[Gates determined based on constitution file]

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# Monorepo (npm workspaces)
apps/api/src/[modul]/
├── [modul].module.ts
├── [modul].controller.ts
├── [modul].service.ts
├── entities/[modul].entity.ts
└── dto/
    ├── create-[modul].dto.ts
    └── update-[modul].dto.ts

apps/web/src/
├── components/[modul]/
├── store/[modul]Slice.ts
├── services/api.ts (update)
└── types/[modul].ts
```

**Structure Decision**: Monorepo with `apps/api` (NestJS) and `apps/web` (Next.js). Each feature = NestJS module + React components + Redux slice.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
