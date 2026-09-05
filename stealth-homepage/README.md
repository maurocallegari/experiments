# Stealth Home — 2.0.0

Real replacement for the earlier `stealth-home-v4` plugin. Same plugin directory/main filename permits a normal WordPress ZIP replacement. No other plugin or theme is modified.

Install the ZIP with Plugins → Add New → Upload, replace the old version if prompted, then activate. On stealthsoftware.it, the existing `/v2/` page is selected automatically. Activation does not overwrite its saved content. Deactivation restores the normal theme template and content.

Settings → Stealth Home exposes the target page, all narrative text, CTA and asset URLs. A custom page template retains `get_header()` / `get_footer()` and bypasses the old page-body experiment only for the selected page. No theme files are changed. The old shortcode `[stealth_home_v4]` remains supported. Do not combine this with the old plugin in a second folder.

The diagrams use individually animated, self-contained wireframe elements. PNG copies are supplied for WordPress media use; vectors remain bundled as fallbacks. No external font, animation library or CDN is required. Type inherits the installed theme.

## Source
- `plugin/stealth-home-v4`: installable plugin.
- `scripts/build.mjs`: generates preview and ZIP from the production template/assets.
- `preview/index.html`: standalone preview using the same template, CSS and JS. Its header is a labeled simulation, not Enfold.
- `QA.md`: exact verification results and remaining release gate.

## Release limitation
Local preview tests do not establish Enfold integration. The package must be activated on WordPress and checked there before production readiness is claimed.
