# Full Frontend ↔ Admin Integration Plan

This is a large effort. Most of the heavy modules (Properties, Hero/Banners, Top 10, Hot Property, Featured, Partners, Success Stories, Testimonials, About, Why Choose Us, FAQs, Enquiries, SEO, Footer, Navigation, Search Filters, Site Settings) are **already wired** to the admin and DB in prior turns. What remains is mostly **seeding hardcoded fallbacks into the DB** and **removing residual hardcoded data** from a few components, then verifying.

I will NOT change UI, animations, or layout. Only data sources move.

---

## Audit — current state

**Already dynamic (admin → DB → site):**
- Properties (+images, amenities, configurations, prices)
- Hero slides / Banners
- Top 10 Featured, Hot Property, Featured Properties
- Builders, Locations, Amenities
- Partners (+ section content)
- Success Stories (seeded last turn)
- Testimonials, FAQs, About sections, Why Choose Us (via `content_sections`)
- Enquiries / Contact / Sell-property forms → `enquiries` table
- SEO metadata, Site Settings, Navigation, Footer content, Contact info
- Customers, Wishlist, Admin Users (read-only views)

**Still hardcoded / partial — work to do:**
1. `src/data/testimonialsData.ts` — seed remaining testimonials into `testimonials` table; switch `Testimonials.tsx` to DB-first with this as fallback only.
2. `src/data/successStories.ts` — already seeded; keep file as fallback only.
3. Static FAQ list in `src/routes/faqs.tsx` (if any) — seed into `faqs` table; component reads DB.
4. Navbar logo + nav links — confirm `Navbar.tsx` reads from `navigation_items` + `site_settings.logo`; seed current logo/menu if missing.
5. Footer social links / contact rows — confirm `Footer.tsx` pulls from `contact_info` + `site_settings.social`; seed current values.
6. WhyChooseUs / AboutHorizontalScroll — confirm they read `content_sections`; seed current copy.
7. Builder logos on home — ensure sourced from `builders` table (seed missing).
8. Brochure Downloads + Site Visits + Share Links + Compare admin pages — currently stubs. Wire to existing tables (`enquiries` filtered by type, plus a `downloads` / `site_visits` view) — read-only lists with status toggles.
9. Activity Logs admin — wire to `activity_logs` table list view.
10. Settings admin — expose remaining `site_settings` keys (WhatsApp number, default city, currency).

## Out of scope (explicit)
- No design / layout / animation changes.
- No new Media Library (deleted earlier per your request); image upload stays inline in each admin form.
- No Dashboard (removed earlier).

## Execution phases

**Phase 1 — Seed remaining hardcoded data into DB** (1 migration + 1 data insert)
- Testimonials, FAQs, navigation items, footer/contact rows, about/why-choose-us sections, builder logos, social links. Idempotent upserts by slug/key.

**Phase 2 — Switch components to DB-first**
- For each component above: add a `useQuery` against the relevant table, fall back to the existing constant only on error/empty. No JSX changes.

**Phase 3 — Wire remaining admin stubs**
- `admin.downloads.tsx`, `admin.site-visits.tsx`, `admin.share-links.tsx`, `admin.compare.tsx`, `admin.logs.tsx`, `admin.settings.tsx` → list + minimal edit.

**Phase 4 — Verify**
- Build, then a Playwright smoke pass: home renders, edit one testimonial in admin, see it on site after invalidation.

---

## Recommendation

This is ~6–10 focused turns of work. Rather than one giant change, I suggest we go **phase by phase** so you can verify each step doesn't disturb the design.

**Shall I start with Phase 1 (seed remaining content + switch Testimonials/FAQs/Navbar/Footer to DB-first)?** Or pick a specific module from the list above to do first.
