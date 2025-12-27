# TypeScript Compilation Fixes Needed

After rolling back boardgame.io to 0.49.12, the following errors remain (good news: all boardgame.io API errors are resolved!):

## Summary
- **Total Categories**: 7 main issue types
- **Estimated Effort**: Medium - most are small fixes or package additions
- **Priority**: Fix server/infrastructure issues first, then MUI API changes, then tests

---

## 1. Missing/Deprecated Packages (HIGH PRIORITY)

### enzyme (React 18 incompatible - ~40 test files)
**Status**: Cannot be fixed easily - enzyme doesn't support React 18
**Solution Options**:
- A) Migrate all enzyme tests to @testing-library/react (large effort)
- B) Skip enzyme test files for now with tsconfig exclude
- C) Keep as-is and fix when running specific test files

**Recommendation**: Option B - exclude enzyme tests from compilation for now

### @use-gesture/react (1 file)
```
src/games/kriegspiel/Board.tsx
```
**Fix**: Add missing dependency
```bash
cd web && yarn add @use-gesture/react
```

### next-i18next/rewrites (1 file)
```
server/config/i18n/rewrite.ts
```
**Status**: Module path changed in next-i18next v15
**Fix**: Update import path or remove if deprecated

### Deprecated server packages (server/next.config.ts - 4 imports)
- `webpackbar` - May need removal or replacement
- `next-optimized-images` - Deprecated, Next.js 13+ has built-in image optimization
- `@zeit/next-workers` - Deprecated, use native Web Workers
- `i18next-hmr/plugin` - May need update or removal

**Fix**: Audit server/next.config.ts and remove/replace deprecated packages

### Test infrastructure
- `ts-jest/utils` → Changed to `ts-jest` in newer versions
- `mocked-env` → May need replacement
- Custom jest matchers (`toEqualXML`) need registration

---

## 2. Next.js API Changes (HIGH PRIORITY)

### serveStatic removed (5 occurrences in server/web.ts)
```typescript
server/web.ts:43,51,61,67,75
```
**Issue**: `NextServer.serveStatic()` no longer exists in Next.js 14
**Fix**: Replace with custom Express static middleware or Next.js public folder handling

---

## 3. Google Cloud Logging Type Incompatibility (MEDIUM PRIORITY)

### winston-transport type mismatch
```
server/logging.ts:21
```
**Issue**: Version mismatch between @google-cloud/logging-winston and winston
**Fix**: May need to adjust winston version or use type assertion

---

## 4. MUI v6 API Changes (MEDIUM PRIORITY)

### Select onChange signature changed (~6 files)
Files affected:
- `src/games/bullsAndCows/customization.tsx` (3 occurrences)
- `src/games/checkers/customization.tsx` (2 occurrences)

**Old signature**:
```typescript
(event: React.ChangeEvent<{ value: T }>) => void
```

**New signature**:
```typescript
(event: SelectChangeEvent<T>, child: ReactNode) => void
```

**Fix**: Update all Select onChange handlers to use SelectChangeEvent

### TextField rowsMax deprecated
```
src/games/hangman/EnterWordPrompt.tsx:69
```
**Fix**: Replace `rowsMax` with `maxRows`

---

## 5. boardgame.io Client Test Issues (LOW PRIORITY)

### Client options changed (~6 test files)
Files:
- `src/games/bashni/ai.test.ts`
- `src/games/checkers/ai.test.ts`

**Issue**: `ai` property and customization signature changed
**Fix**: Update test setup to match boardgame.io 0.49.x Client API

---

## 6. Component API Issues (LOW PRIORITY)

### ButtonComponent children prop
```
src/games/estatebuyer/BidPanelComponent.tsx
src/games/estatebuyer/board.tsx
src/games/estatebuyer/ButtonComponent.tsx
```
**Fix**: Add `children` to IButtonProps interface

---

## 7. Test File Issues (LOW PRIORITY)

### Missing screen import from RTL
```
src/games/bombsAndBunnies/tests/board.test.tsx
src/games/mancala/board.test.tsx
```
**Fix**: Import screen from '@testing-library/react' instead of test utils

### Type issues in tests
- `src/games/bridge/tests/misc.test.ts:20` - string | string[] type
- `src/games/doppelkopf/tests/misc.test.ts:22` - string | string[] type
- `src/games/hangman/util.test.ts:212` - undefined[] vs Guesses type
- Various test mock issues

---

## Recommended Fix Order

### Phase 1: Critical Infrastructure (Do First)
1. ✅ Fix @use-gesture/react (add dependency)
2. ✅ Audit and fix server/next.config.ts (remove deprecated packages)
3. ✅ Fix server/web.ts serveStatic issues
4. ✅ Fix server/config/i18n/rewrite.ts import
5. ✅ Fix server/logging.ts type issue

### Phase 2: MUI API Updates
6. ✅ Fix all Select onChange handlers
7. ✅ Fix TextField rowsMax → maxRows

### Phase 3: Component Fixes
8. ✅ Fix ButtonComponent children prop

### Phase 4: Test Updates (Can defer)
9. ⏸️ Exclude enzyme tests from tsconfig or migrate to RTL
10. ⏸️ Fix boardgame.io test client setup
11. ⏸️ Fix misc test type issues

---

## TypeScript Compilation Commands

```bash
# Full check
cd web && yarn tsc --noEmit

# Count errors
cd web && yarn tsc --noEmit 2>&1 | grep "error TS" | wc -l

# Check specific file
cd web && yarn tsc --noEmit server/web.ts
```
