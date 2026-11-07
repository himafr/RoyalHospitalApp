# Design Rules for this project

When asked to improve UI/design, follow these rules:

## Always
- Use a consistent spacing scale: 4, 8, 16, 24, 32, 48, 64 (no random values)
- One accent color only for CTAs; keep one clear focal point per screen
- Consistent border-radius across all components (pick one, e.g. 8px)
- One font family; max 4 sizes (e.g. 32/24/16/14) with line-height 1.5 body, 1.2 headings
- Every screen must have: loading, empty, and error states
- Primary CTA must be visually distinct from secondary actions
- Ensure WCAG AA contrast (4.5:1 for text)

## Never
- Don't introduce new colors, fonts, or radii without asking
- Don't leave sterile/utilitarian UI — add microcopy, personality, spacing
- Don't change logic, only presentation

## When improving design
1. First audit: list the top 3 visual problems you see in the code
2. Then apply fixes with exact values (e.g. "padding 12px → 16px")
3. Show a short before/after for each change