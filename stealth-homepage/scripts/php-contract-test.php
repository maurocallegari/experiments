<?php
// Isolated WordPress API contract test. Not a WordPress or Enfold integration test.
define('ABSPATH', '/test/');
define('OBJECT', 'OBJECT');
$test_options = array();
$test_admin = false;
$test_can_manage = true;
$test_page = 877;
$test_hooks = array();
function add_action($name, $callback) { global $test_hooks; $test_hooks[$name][] = $callback; }
function add_filter($name, $callback, $priority = 10) { add_action($name, $callback); }
function add_shortcode($name, $callback) { add_action($name, $callback); }
function get_option($name, $default = null) { global $test_options; return $test_options; }
function absint($n) { return abs((int) $n); }
function get_page_by_path($path, $output, $type) { return (object) array('ID' => 877); }
function is_admin() { global $test_admin; return $test_admin; }
function is_page($id) { global $test_page; return $id === $test_page; }
function current_user_can($cap) { global $test_can_manage; return $test_can_manage; }
function get_post_type($id) { return $id === 877 ? 'page' : 'post'; }
function add_settings_error($option, $code, $message) { global $test_errors; $test_errors[] = $code; }
function sanitize_textarea_field($value) { return strip_tags($value); }
function esc_html($value) { return htmlspecialchars($value, ENT_QUOTES, 'UTF-8'); }
function esc_url_raw($value, $protocols = null) { return preg_match('~^https?://~', $value) ? $value : ''; }
function esc_url($value) { return esc_url_raw($value); }
function home_url($path = '') { return 'https://www.stealthsoftware.it' . $path; }
function wp_parse_url($url, $component) { return parse_url($url, $component); }
function wp_get_attachment_url($id) { return false; }
function plugins_url($path, $file) { return 'https://example.test/plugins/stealth-home-v4/' . $path; }
function get_post() { return (object) array('post_content' => 'Unrelated'); }
function is_singular() { return true; }
function has_shortcode($content, $tag) { return strpos($content, '[' . $tag . ']') !== false; }
function wp_enqueue_style($handle, $url, $deps, $version) { global $test_assets; $test_assets[] = $handle; }
function wp_enqueue_script($handle, $url, $deps, $version, $footer) { global $test_assets; $test_assets[] = $handle; }
require __DIR__ . '/../plugin/stealth-home-v4/stealth-home-v4.php';
function check($condition, $message) { if (!$condition) { throw new Exception($message); } echo "PASS: $message\n"; }
check(STH_Home_Story::target() === 877, 'v2 resolved by slug');
check(STH_Home_Story::is_target(), 'target is enabled');
check(basename(STH_Home_Story::template('original.php')) === 'page.php', 'target template selected');
$test_page = 12;
check(STH_Home_Story::template('original.php') === 'original.php', 'unrelated template preserved');
$test_assets = array(); STH_Home_Story::assets();
check(count($test_assets) === 0, 'no assets on unrelated page');
$test_page = 877; STH_Home_Story::assets();
check(count($test_assets) === 2, 'CSS and JS on target only');
$test_options = array('page_id' => 0);
check(STH_Home_Story::target() === 0 && !STH_Home_Story::is_target(), 'explicit disable respected');
$test_options = array('opening' => 'Original');
$test_can_manage = false;
check(STH_Home_Story::sanitize(array('opening'=>'Changed')) === $test_options, 'unauthorized update rejected');
$test_can_manage = true;
$saved = STH_Home_Story::sanitize(array('page_id'=>12,'opening'=>'<b>Edited</b>','cta_url'=>'javascript:alert(1)','unknown'=>'x'));
check(!isset($saved['page_id']), 'non-page target rejected');
check($saved['opening'] === 'Edited' && $saved['cta_url'] === '' && !isset($saved['unknown']), 'text, URL and field whitelist sanitized');
$test_options = array('opening' => '<script>alert(1)</script>', 'cta_url' => 'javascript:alert(1)');
$html = STH_Home_Story::render();
check(strpos($html, '&lt;script&gt;') !== false && strpos($html, '<script>alert') === false, 'editable output escaped');
check(strpos($html, '{{') === false, 'all template tokens resolved');
check(strpos($html, 'href="https://www.stealthsoftware.it/contatti/"') !== false, 'invalid CTA falls back to contact page');
check(substr_count($html, '<h1>') === 1, 'one opening heading');
check(STH_Home_Story::render() === '', 'duplicate shortcode cannot duplicate root IDs');
echo "All isolated PHP contract checks passed. Real WordPress/Enfold integration remains a separate gate.\n";
