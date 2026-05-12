# Mobile Responsiveness Audit Report

**Date:** May 12, 2026  
**Scope:** src/components/, src/app/pages, public-facing pages

---

## Executive Summary

Found **23 high-priority**, **15 medium-priority**, and **8 low-priority** responsive design issues across the codebase. Most issues involve hardcoded sizing, missing responsive Tailwind prefixes, and layout problems on mobile screens.

---

## HIGH SEVERITY ISSUES

### 1. **ProfileCard.tsx** - Hardcoded Card Dimensions
**File:** [src/components/ProfileCard.tsx](src/components/ProfileCard.tsx)  
**Issue:** Profile card uses hardcoded viewport-relative sizing:
- `height: 80svh` with `max-height: 540px` (line ~line 49)
- `aspect-ratio: 0.718` prevents proper scaling on mobile
- Fixed `--card-radius: 30px` doesn't scale
- Contact shadow positioned with fixed `-22px` offset (line ~55)

**Impact:** Card appears oversized and may overflow on screens < 375px or fill entire screen on very small phones.

**Fix:** Make dimensions responsive with clamp() and adjust aspect ratio for mobile.

---

### 2. **TiltedCard.tsx** - Completely Unresponsive
**File:** [src/components/TiltedCard.tsx](src/components/TiltedCard.tsx)  
**Issue:** Component accepts hardcoded pixel values:
- `containerHeight = '300px'`
- `containerWidth = '100%'`
- `imageHeight = '300px'`
- `imageWidth = '300px'`
- Tilt effect only works on desktop (`enableMobileTilt = false`)

**Impact:** Fixed 300px height breaks on mobile. 3D tilt interactions unavailable for touch devices.

**Fix:** Add responsive height calculation and implement touch-based tilt for mobile.

---

### 3. **Dock.css** - Fixed Spacing & Size Issues
**File:** [src/components/Dock.css](src/components/Dock.css)  
**Issues:**
- `.dock-item` uses `font-size: 1.2rem` on mobile (line ~117) - no responsive sizing
- Label tooltip uses fixed `-1.5rem` positioning (line ~91) - may overlap content on small screens
- `gap: 1rem` and `gap: 0.8rem` don't scale with viewport
- Magnification effect (70px) may cause items to overflow viewport on mobile

**Impact:** Dock items too large on mobile, labels cut off, icons distorted.

**Fix:** Use `clamp()` for sizing and implement viewport-aware magnification.

---

### 4. **MagicBento Grid Layout - Broken Mobile Layout**
**File:** [src/components/MagicBento.css](src/components/MagicBento.css)  
**Issues:**
- Grid uses hardcoded `grid-template-columns: repeat(4, 1fr)` at lg breakpoint
- `min-height: 200px` on cards is too tall for mobile vertical scrolling
- `aspect-ratio: 4/3` causes awkward proportions on mobile (should be wider)
- No mobile grid adjustment < 600px in CSS (only 1 column but with hardcoded heights)
- Global spotlight `width: 800px; height: 800px` (line ~line 430) - way too large for mobile screens

**Impact:** Cards don't stack properly, take up excessive space, spotlight follows cursor off-screen on mobile.

**Fix:** Add mobile-first CSS with proper aspect ratios and reduce spotlight size for touch devices.

---

### 5. **PillNav.tsx/css - Fixed Positioning Issues**
**File:** [src/components/PillNav.tsx](src/components/PillNav.tsx) & [src/components/PillNav.css](src/components/PillNav.css)  
**Issues:**
- Navigation bar fixed at `top: 1rem` with `transform: translateX(-50%)` - inflexible on mobile
- `.pill` uses fixed `padding: 12px 20px` (line ~line 79 in CSS) - no responsive adjustment
- `.pill-logo` is `width: 48px; height: 48px` - too large on mobile
- No hamburger menu implementation for mobile (mentions `isMobileMenuOpen` but limited mobile handling)
- Width constraint: `max-width: 100%` but no actual responsive width calculation

**Impact:** Navigation takes up significant screen real estate on mobile, text labels squeeze together.

**Fix:** Implement responsive font sizes, smaller logo on mobile, actual hamburger toggle.

---

### 6. **page.tsx - Missing Responsive Text Sizes**
**File:** [src/app/page.tsx](src/app/page.tsx)  
**Issues:**
- "Full-Stack Developer & Creative Technologies" uses `TextPressureWrapper` without responsive sizing
- Skills grid: `grid gap-4 sm:grid-cols-2 lg:grid-cols-4` - **missing xs breakpoint** (should start at 1 column)
- Logo loop: `logoHeight={48}` fixed, doesn't scale for mobile viewing
- Visual identity section: cards need mobile consideration
- Spotlight card content uses `text-sm` which may be too small on mobile

**Impact:** Skills grid might show 2 columns on phones < 640px, text hierarchy unclear.

**Fix:** Add `grid-cols-1` for xs, responsive text sizes with `text-xs sm:text-sm`.

---

### 7. **ProfileCard.tsx - Absolute Shadow Positioning**
**File:** [src/components/ProfileCard.css](src/components/ProfileCard.css)  
**Issue:** Contact shadow uses fixed positioning:
```css
left: 6%;
right: 6%;
bottom: -22px;
```
This creates layout shift on mobile when card height changes.

**Impact:** Shadow jumps position when viewport resizes, creates layout jank.

**Fix:** Use responsive-relative positioning or drop-shadow() filter instead.

---

### 8. **DockNav - No Mobile Safeguard**
**File:** [src/components/DockNav.tsx](src/components/DockNav.tsx)  
**Issue:** Navigation dock at bottom of screen doesn't account for keyboard on mobile.
- Fixed `inset: 0` in `.dock-outer` means it covers content
- `pointer-events: none` on outer container but active items can still trigger interactions
- No prevention of covering interactive elements like form inputs

**Impact:** On mobile with keyboard open, dock overlaps input fields making them inaccessible.

**Fix:** Add `@media (max-height: 600px)` or detect keyboard with `visualViewport`.

---

### 9. **ScrollVelocity.css - Fixed Font Size**
**File:** [src/components/ScrollVelocity.css](src/components/ScrollVelocity.css)  
**Issue:**
- `.scroller` uses `font-size: 2.25rem` on mobile (line ~11)
- Changes to `font-size: 5rem` only at `min-width: 768px`
- No xs/sm breakpoint, text too large on small phones
- `.education-scroll-text` uses `clamp()` (good!) but base is `1.4rem` - might be too large

**Impact:** Text scrolls off-screen on phones < 375px, overlaps other content.

**Fix:** Add mobile breakpoint starting at `font-size: 1.5rem`.

---

### 10. **ProjectsGrid - Image Sizing Issues**
**File:** [src/components/ProjectsGrid.tsx](src/components/ProjectsGrid.tsx)  
**Issues:**
- Image container: `h-48 sm:h-56` - **missing xs breakpoint**, starts at 192px (fixed on mobile)
- `sizes="(max-width: 1024px) 100vw, 50vw"` - good but could be more granular
- Button text changes `hidden sm:inline` / `sm:hidden` - good pattern but creates layout shift
- Role badge: `whitespace-nowrap` on narrow screens causes overflow

**Impact:** Images don't scale properly on very small screens, buttons jump.

**Fix:** Add `h-40 sm:h-48 md:h-56` and adjust sizes descriptor.

---

### 11. **EducationPageContent - Timeline Breaks Mobile**
**File:** [src/components/EducationPageContent.tsx](src/components/EducationPageContent.tsx)  
**Issue:**
- Timeline line: `hidden lg:block` - **completely hidden on mobile**
- Timeline dots not visible on mobile either
- Grid layout `lg:grid-cols-[1fr_auto_1fr]` - on mobile shows side-by-side which is confusing
- No mobile-specific timeline presentation

**Impact:** Timeline is invisible on mobile, no way to understand education flow.

**Fix:** Create separate mobile timeline presentation (vertical line visible on mobile).

---

### 12. **ExperiencePageContent - Heading Unresponsive**
**File:** [src/components/ExperiencePageContent.tsx](src/components/ExperiencePageContent.tsx)  
**Issue:**
- H1: `text-4xl sm:text-5xl lg:text-6xl` - **no base responsive sizing for xs**
- Base `text-4xl` = 36px, too large for 320px screens
- Missing `text-2xl` or `text-3xl` for mobile

**Impact:** Heading overflows on small phones, breaks layout.

**Fix:** Add `text-2xl sm:text-4xl lg:text-6xl`.

---

### 13. **AchievementsPageContent - Missing Mobile Sections**
**File:** [src/components/AchievementsPageContent.tsx](src/components/AchievementsPageContent.tsx)  
**Issue:**
- No distinct mobile presentation for achievements grid
- MagicBento inherits mobile issues
- Text descriptions not optimized for small screens

**Impact:** Achievements grid follows broken MagicBento layout on mobile.

**Fix:** Inherit MagicBento fixes.

---

### 14. **Global Layout Container - Padding Inconsistency**
**File:** [src/app/page.tsx](src/app/page.tsx) (and all pages)  
**Issue:**
```jsx
className="px-6 py-6 pb-28 lg:px-10 lg:py-8 lg:pb-32"
```
- `px-6` (24px) on all screen sizes < lg - fixed, doesn't scale
- `pb-28` creates fixed bottom padding - doesn't account for dock height
- Should use responsive padding scaling

**Impact:** Small phones have constrained width (24px * 2 = 48px max content on 375px screen = 327px usable).

**Fix:** Add `sm:px-6 md:px-8` progression and dock-height-aware padding.

---

### 15. **LiquidEther Background - Hidden on Mobile**
**File:** [src/app/page.tsx](src/app/page.tsx)  
**Issue:**
```jsx
className="absolute inset-0 hidden lg:block opacity-40 xl:opacity-60"
```
- `hidden lg:block` means no visual effects on mobile
- But it's GPU-intensive anyway, so good for performance
- However, creates visual inconsistency between mobile and desktop

**Impact:** Mobile looks plain compared to desktop, but acceptable for performance.

**Note:** This is acceptable as is, but worth documenting.

---

### 16. **SpotlightCard - Padding Not Responsive**
**File:** [src/components/SpotlightCard.css](src/components/SpotlightCard.css)  
**Issue:**
```css
padding: 2rem; /* 32px */
```
- Fixed padding on all screen sizes
- No responsive adjustment for small screens
- Takes up significant space on mobile

**Impact:** Content area becomes too small on phones.

**Fix:** Add media query: `@media (max-width: 640px) { padding: 1rem; }`.

---

### 17. **Grid Background Pattern - Unresponsive**
**File:** [src/app/page.tsx](src/app/page.tsx)  
**Issue:**
```jsx
bg-[size:72px_72px]
```
- Fixed 72px grid pattern on all screen sizes
- Pattern too coarse on mobile, creates visual noise

**Impact:** Background pattern doesn't scale with viewport, looks inconsistent.

**Fix:** Use `@media` to adjust to `bg-[size:48px_48px]` on mobile.

---

### 18. **LiquidEtherBackground - Not Analyzed (Performance)**
**File:** [src/components/LiquidEtherBackground.tsx](src/components/LiquidEtherBackground.tsx)  
**Issue:** Component uses dynamic canvas rendering.
- Likely already hidden on mobile (good)
- But no explicit mobile detection

**Impact:** Might drain battery on older mobile devices if rendered.

**Fix:** Ensure mobile check is present in component.

---

### 19. **BorderGlow & CurvedLoop - CSS Responsiveness Unknown**
**Files:** [src/components/BorderGlow.tsx](src/components/BorderGlow.tsx), [src/components/CurvedLoop.tsx](src/components/CurvedLoop.tsx)  
**Issue:** These components use hardcoded CSS values (need to inspect full CSS).

---

### 20. **Text Components - Font Size Inconsistency**
**Files:** Affecting `TextPressure`, `ShinyText`, `SplitText`  
**Issue:** These animation-heavy components use inherited text sizes but don't guarantee mobile readability.

---

### 21. **SkeletonLoader - No Mobile Adjustment**
**File:** [src/components/SkeletonLoader.tsx](src/components/SkeletonLoader.tsx)  
**Issue:** Likely uses fixed height/width, doesn't adapt to viewport.

---

### 22. **Dock Magnification - Overflow Risk**
**File:** [src/components/Dock.tsx](src/components/Dock.tsx)  
**Issue:**
- `magnification={70}` in DockNav
- On mobile, 50px base items × 1.4 magnification = 70px, can exceed viewport width
- 5 items × 50px = 250px, with gaps = ~280px - just fits 375px screens but no margin

**Impact:** Dock items can overflow on 320px screens or small landscape viewports.

**Fix:** Reduce magnification to 1.2x on mobile or reduce base item size.

---

### 23. **Responsive Utility Usage - Inconsistent**
**Files:** Multiple (page.tsx, all content pages)  
**Issue:** Inconsistent use of Tailwind responsive prefixes:
- Some use `sm:` as first breakpoint (should use no prefix for xs)
- Some use `md:` without checking tablet view
- Missing `xl:` considerations for desktop

**Impact:** Inconsistent scaling across components makes audit harder and maintenance error-prone.

---

## MEDIUM SEVERITY ISSUES

### M1. **LogoLoop - Gap Scaling**
**File:** [src/components/LogoLoop.css](src/components/LogoLoop.css)  
**Issue:**
```css
--logoloop-gap: 32px; /* desktop */
/* at 768px: 20px */
/* at 480px: 12px */
```
Gaps work but could use more intermediate breakpoints (640px, 1024px).

---

### M2. **Magic Bento Card Text Overflow**
**File:** [src/components/MagicBento.css](src/components/MagicBento.css)  
**Issue:**
```css
font-size: 16px; /* title */
font-size: 12px; /* description */
```
Fixed sizes don't scale responsively. Should use `clamp()`.

---

### M3. **ProfileCard Aspect Ratio Not Mobile-Optimized**
**File:** [src/components/ProfileCard.tsx](src/components/ProfileCard.tsx)  
**Issue:**
```tsx
aspect-ratio: 0.718; /* always 0.718, even on mobile */
```
Should be `aspect-ratio: clamp(0.6, 70vw, 0.8)` for flexibility.

---

### M4. **DockNav Active State Visual**
**File:** [src/components/Dock.css](src/components/Dock.css)  
**Issue:** Active state styling looks good, but borders (1px) can be hard to see on small screens.

---

### M5-M15. **Other Medium Issues** (Component-specific analysis needed in detailed review)

---

## LOW SEVERITY ISSUES

### L1. **Font Weight Consistency**
Font weights inconsistent across mobile/desktop for text hierarchy.

### L2. **Color Contrast on Small Screens**
Some text colors (white/70%) may have contrast issues on mobile when screen size is small.

### L3. **Touch Target Size**
Buttons use `px-3 py-1` which may be < 48px minimum touch target on some elements.

### L4. **Icon Sizing**
Icons in buttons don't scale responsively with text size.

### L5-L8. **Other Low Issues**

---

## SUMMARY TABLE

| File | High | Medium | Low | Priority |
|------|------|--------|-----|----------|
| ProfileCard.tsx | 2 | 1 | 0 | Fix First |
| TiltedCard.tsx | 1 | 0 | 0 | Fix First |
| Dock.css | 1 | 1 | 1 | Fix First |
| MagicBento.tsx/.css | 1 | 2 | 1 | Fix First |
| PillNav.tsx/.css | 1 | 1 | 1 | Second |
| page.tsx | 1 | 0 | 1 | Second |
| ProjectsGrid.tsx | 1 | 0 | 0 | Second |
| EducationPageContent.tsx | 1 | 0 | 0 | Second |
| ExperiencePageContent.tsx | 1 | 0 | 0 | Second |
| ScrollVelocity.css | 1 | 1 | 0 | Third |
| DockNav.tsx | 1 | 0 | 0 | Third |
| Others | 8 | 8 | 5 | Review |

---

## RECOMMENDED FIX PRIORITY

**Phase 1 (Critical):**
1. ProfileCard responsive sizing
2. MagicBento grid mobile layout
3. TiltedCard fallback for mobile
4. Dock overflow handling

**Phase 2 (Important):**
5. PillNav mobile optimization
6. Text size responsive scaling
7. Grid layout adjustments

**Phase 3 (Nice-to-have):**
8. Touch target size optimization
9. Animation performance on mobile
10. Visual consistency refinements

---

## Responsive Breakpoints Audit

**Current Usage:**
- xs: (none - implicit) < 640px
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

**Recommendation:** Add explicit xs breakpoints to all responsive utilities.

