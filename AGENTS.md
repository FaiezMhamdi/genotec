
## Repository notes
- team.html (and likely other files) use CRLF (Windows) line endings. Preserve them — converting to LF turns edits into whole-file diffs. Normalize touched files back to CRLF before committing.
- MRs can be created via GitLab API for genotec-group/gen-otec (project id 85660996).

## Lessons (Aug 2025)
- Never use img onerror handlers that remove DOM items — transient load failures deleted the whole gallery. Prefer non-destructive handling.
- scroll-reveal in enhancements.js: IntersectionObserver threshold must stay 0; tall mobile sections can never reach 10% visibility and stayed invisible (root cause of the mobile gallery bug).
- Contact form submits via FormSubmit to faiezmhamdi5@gmail.com (no backend). CSP connect-src allows formsubmit.co. First submission required one-time email activation.
- Contact info: phone +34672458752, WhatsApp wa.me/34672458752, email faiezmhamdi5@gmail.com.
- Gallery data-driven from gallery.js CITIES (63 photos: B1-B25, V1-V21, M1-M8, L1-L4, MI1-MI2, MU1-MU3).

## Team page conventions
- Founder cards on team.html are intentionally minimal: photo/icon, name, role, brief About Me bio, social links. Experience/Education timelines were added then removed at owner request (Aug 2025) — do not re-add unless asked.
- Faiez avatar uses B4.jpg; Hassen uses the purple fa-user-tie icon.
- Hassen bio must mention: official tutor with Universal Mobility since 2023.
- GitLab tokens can expire mid-session: if push fails with HTTP Basic auth error, re-set remote URL with fresh $GITLAB_TOKEN.
- Warn the user not to merge an MR until all commits are pushed — early merges of MR !9/!12 shipped incomplete code.

## Header nav (Aug 2026, MR !28)
- The shared header (components.js) no longer shows a "View Cart" button or a "0" counter badge next to Courses. Cart badge code (cart-badge/cartCount, ctaPresets cart, viewCartBtn/mobileViewCart) was removed at owner request — do not re-add cart UI to the shared header.
- The shop page's cart still works via the on-page `#ctaViewCart` button and auto-open on "Enroll Now" (shop.js).
- .cart-badge CSS in style.css and shop.css is now dead but harmless; leave it unless cleaning up.

## services.html
- services.html historically was a self-contained page with NO shared nav/footer. Fixed in MR !27: it now loads style.css + enhancements.css, injects #site-header (data-active="Services", note the capital S matching the components.js nav key) and #site-footer, and adds body padding-top:72px to clear the fixed header.
- The bespoke inline <style> block in services.html overrides shared styles (equal specificity, loaded later), so don't move its styling out carelessly.
- services.html uses CRLF line endings — preserved in MR !27.

## About page (Aug 2026 redesign, MR !15)
- about.html is now the company page for GenoTec Group (founded 2026), NOT a personal page — the old personal timeline/philosophy content was removed at owner request.
- Structure: hero with group emblem → "One Group, Three Divisions" cards → "How It Works Together" 3-step flow → CTA.
- Divisions: Nexora (technical training, ages 8+ to companies), Makera (part manufacturing/prototypes), GenoTec Consulting (advisory).
- 4 logos in repo root (genotecgrouplogo.png, Nexoralogo.png, Makeralogo.png, Genotecconsultinglogo.png) all have white/light backgrounds — always place them on white .logo-card containers (about.css), never directly on the dark theme.
- about.html/about.css use LF endings (unlike team.html/contact.html which are CRLF).
