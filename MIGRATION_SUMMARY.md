# Code Migration Summary

This document summarizes the automated code migrations performed to modernize FreeBoardGames.org from Node 14 to Node 24.

## Migration Date
December 26, 2025

## Automated Migrations Completed

### 1. Material-UI v4 → MUI v6 Migration ✅
**Script:** `migrate-mui.cjs`

**Statistics:**
- Files processed: 847
- Files modified: 110
- Total replacements: 288

**Changes Made:**
- ✅ Updated imports: `@material-ui/core` → `@mui/material`
- ✅ Updated imports: `@material-ui/icons` → `@mui/icons-material`
- ✅ Updated imports: `@material-ui/lab` → `@mui/lab`
- ✅ Updated imports: `@material-ui/styles` → `@mui/styles`
- ✅ Updated API: `createMuiTheme` → `createTheme`
- ✅ Updated API: `MuiThemeProvider` → `ThemeProvider`

**Styling System Migration:**
- ✅ Migrated from JSS to Emotion-based styling
- ✅ Updated `_document.tsx` for Emotion SSR support
- ✅ Created `createEmotionCache.ts` helper
- ✅ Updated `_app.tsx` to use CacheProvider with Emotion

### 2. Apollo Client Migration ✅
**Script:** `migrate-apollo.cjs`

**Statistics:**
- Files processed: 847
- Files modified: 6
- Total replacements: 9

**Changes Made:**
- ✅ Updated imports: `apollo-boost` → `@apollo/client`
- ✅ Updated imports: `@apollo/react-hooks` → `@apollo/client`
- ✅ Updated imports: `@apollo/react-components` → `@apollo/client`
- ✅ Updated imports: `@apollo/react-testing` → `@apollo/client/testing`

**Files Modified:**
- `web/src/pages/_app.tsx`
- `web/src/infra/chat/Chat.tsx`
- `web/src/infra/lobby/LobbyCarousel.tsx`
- `web/src/infra/lobby/LobbyCarousel.test.tsx`
- `web/src/infra/room/Room.tsx`
- `web/src/infra/room/Room.test.tsx`

### 3. Next.js & React Compatibility Updates ✅

**Changes Made:**
- ✅ Removed deprecated `next-with-error` package usage
- ✅ Updated `_app.tsx` to work with Next.js 14 and React 18
- ✅ Maintained Server-Side Rendering (SSR) support

## Key Files Modified

### Core Configuration Files
- `web/src/pages/_document.tsx` - Updated for Emotion SSR
- `web/src/pages/_app.tsx` - Updated for Emotion cache and removed deprecated deps
- `web/src/infra/common/components/theme/createEmotionCache.ts` - NEW file for Emotion cache

### Infrastructure Updates
All files in these directories were automatically updated:
- `web/src/games/*` - All game components (110+ files)
- `web/src/gamesShared/*` - Shared game components
- `web/src/infra/*` - Infrastructure components
- `web/src/pages/*` - Page components

## Manual Steps Still Required

### 1. Component-Level Adjustments
Some MUI v6 breaking changes may require manual fixes:

- **makeStyles**: If using `makeStyles` from `@mui/styles`, consider migrating to:
  - `sx` prop (recommended)
  - `styled` API from `@mui/material/styles`
  - Or keep using `@mui/styles` (legacy)

- **withStyles**: Similar to makeStyles, consider modern alternatives

- **Theme TypeScript**: If using custom theme typing, update imports

### 2. Testing Required
```bash
# Run TypeScript compilation check
cd web && yarn tsc --noEmit

# Run tests
cd web && yarn test

# Run development server
yarn run dev

# Test build
yarn run build
```

### 3. Breaking Changes to Watch For

**MUI v6:**
- Color imports now return color objects, not strings
- Some component props have changed (check console warnings)
- Default button variant is now "text" instead of "contained"
- Icons now default to fontSize="medium" instead of "default"

**Apollo Client v3:**
- Uses different cache policies
- Query/Mutation hooks work slightly differently
- Check subscription handling

**Next.js 14:**
- Updated routing behavior
- Image optimization changes
- Middleware updates if using

## Migration Scripts

Two migration scripts were created for this project:

### `migrate-mui.cjs`
Automates Material-UI to MUI import updates. Safely re-runnable.

### `migrate-apollo.cjs`
Automates Apollo Client import updates. Safely re-runnable.

Both scripts:
- Only modify TypeScript/JavaScript files
- Skip node_modules, build directories
- Provide detailed output of changes
- Are idempotent (safe to run multiple times)

## Next Steps

1. **Review Changes**: `git diff` to review all automated changes
2. **Test TypeScript**: Run `yarn tsc` to find any type errors
3. **Run Tests**: Execute test suite to catch runtime issues
4. **Start Dev Server**: Test application in browser
5. **Check Console**: Look for deprecation warnings
6. **Update Tests**: Fix any broken tests due to API changes
7. **Performance Test**: Ensure SSR and client-side rendering work

## Known Issues

### Potential Issues to Address:
1. Some color imports may need adjustment (colors now return objects)
2. Custom theme typing may need updates
3. Component prop changes may require manual fixes
4. Any custom JSS styles will need migration

## Resources

- [MUI Migration Guide](https://mui.com/material-ui/migration/migration-v4/)
- [Apollo Client v3 Migration](https://www.apollographql.com/docs/react/migrating/apollo-client-3-migration/)
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Emotion Documentation](https://emotion.sh/docs/introduction)

## Rollback

If needed, all changes can be reverted via:
```bash
git checkout -- web/src/
```

Then restore the old dependencies in `package.json`.

---

**Migration Status: ✅ AUTOMATED MIGRATIONS COMPLETE**

All automated migrations have been successfully completed. Manual testing and fixes are now required to ensure everything works correctly.
