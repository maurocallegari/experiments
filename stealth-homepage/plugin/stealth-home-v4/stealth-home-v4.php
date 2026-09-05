<?php
/**
 * Plugin Name: Stealth Home V4
 * Description: Homepage Stealth con contenuti editabili, scene responsive e integrazione Enfold.
 * Version: 2.0.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Author: Stealth Software
 * Text Domain: stealth-home
 */
defined('ABSPATH') || exit;

final class STH_Home_Story {
    const VERSION = '2.0.0';
    const OPTION = 'sth_home_story';

    public static function schema() {
        static $schema;
        if ($schema === null) {
            $schema = json_decode(file_get_contents(__DIR__ . '/content.json'), true);
            if (!is_array($schema)) { $schema = array(); }
        }
        return $schema;
    }

    public static function options() {
        $saved = get_option(self::OPTION, array());
        return is_array($saved) ? $saved : array();
    }

    public static function target() {
        $saved = self::options();
        if (isset($saved['page_id'])) { return absint($saved['page_id']); }
        $page = get_page_by_path('v2', OBJECT, 'page');
        return $page ? (int) $page->ID : 0;
    }

    public static function is_target() {
        return !is_admin() && self::target() > 0 && is_page(self::target());
    }

    public static function needed() {
        if (self::is_target()) { return true; }
        $post = get_post();
        return is_singular() && $post && has_shortcode($post->post_content, 'stealth_home_v4');
    }

    public static function assets() {
        if (!self::needed()) { return; }
        wp_enqueue_style('sth-home-story', plugins_url('assets/story.css', __FILE__), array(), self::VERSION);
        wp_enqueue_script('sth-home-story', plugins_url('assets/story.js', __FILE__), array(), self::VERSION, true);
    }

    public static function template($template) {
        return self::is_target() ? __DIR__ . '/page.php' : $template;
    }

    public static function body_class($classes) {
        if (self::is_target()) { $classes[] = 'sth-home-template'; }
        return $classes;
    }

    public static function render() {
        static $rendered = false;
        if ($rendered) { return ''; }
        $rendered = true;
        $saved = self::options();
        $replacements = array();
        foreach (self::schema() as $key => $field) {
            $value = isset($saved[$key]) && is_scalar($saved[$key]) ? (string) $saved[$key] : $field['default'];
            if ($field['type'] === 'url') {
                $value = esc_url($value);
                if ($value === '') { $value = esc_url(home_url('/contatti/')); }
            } else { $value = esc_html($value); }
            $replacements['{{' . $key . '}}'] = $value;
        }
        $media = json_decode(file_get_contents(__DIR__ . '/media.json'), true);
        foreach (array('request', 'quote', 'sheet', 'report') as $name) {
            $url = isset($saved['asset_' . $name]) ? esc_url($saved['asset_' . $name]) : '';
            if (!$url && isset($media['host'], $media['attachments'][$name]) && wp_parse_url(home_url(), PHP_URL_HOST) === $media['host']) {
                $url = esc_url(wp_get_attachment_url(absint($media['attachments'][$name])) ?: '');
            }
            if (!$url) { $url = esc_url(plugins_url('assets/' . $name . '.svg', __FILE__)); }
            $replacements['{{asset:' . $name . '}}'] = $url;
        }
        return strtr(file_get_contents(__DIR__ . '/story.html'), $replacements);
    }

    public static function admin_menu() {
        add_options_page('Stealth Home', 'Stealth Home', 'manage_options', 'sth-home', array(__CLASS__, 'settings_page'));
    }

    public static function admin_init() {
        register_setting('sth_home_group', self::OPTION, array('type' => 'array', 'sanitize_callback' => array(__CLASS__, 'sanitize'), 'default' => array()));
    }

    public static function sanitize($input) {
        $old = self::options();
        if (!current_user_can('manage_options') || !is_array($input)) { return $old; }
        $out = $old;
        $id = isset($input['page_id']) ? absint($input['page_id']) : self::target();
        if ($id && get_post_type($id) !== 'page') {
            add_settings_error(self::OPTION, 'invalid_page', 'Seleziona una pagina WordPress valida.');
        } else { $out['page_id'] = $id; }
        foreach (self::schema() as $key => $field) {
            if (!isset($input[$key]) || !is_scalar($input[$key])) { continue; }
            $value = (string) $input[$key];
            $out[$key] = $field['type'] === 'url' ? esc_url_raw($value, array('http', 'https')) : sanitize_textarea_field($value);
        }
        foreach (array('request', 'quote', 'sheet', 'report') as $name) {
            $key = 'asset_' . $name;
            if (isset($input[$key]) && is_scalar($input[$key])) { $out[$key] = esc_url_raw((string) $input[$key], array('http', 'https')); }
        }
        return $out;
    }

    public static function settings_page() {
        if (!current_user_can('manage_options')) { return; }
        $saved = self::options();
        echo '<div class="wrap"><h1>Stealth Home</h1><p>Modifica i testi della homepage. Struttura e animazioni rimangono nel plugin.</p>';
        echo '<p>Il contenuto originale della pagina è conservato. Seleziona “Disattivata” o disattiva il plugin per tornare al template precedente.</p>';
        settings_errors();
        echo '<form method="post" action="options.php">';
        settings_fields('sth_home_group');
        echo '<table class="form-table"><tr><th><label for="sth_page">Pagina</label></th><td>';
        wp_dropdown_pages(array('name' => self::OPTION . '[page_id]', 'id' => 'sth_page', 'selected' => self::target(), 'show_option_none' => 'Disattivata', 'option_none_value' => '0'));
        echo '</td></tr>';
        foreach (self::schema() as $key => $field) {
            $value = isset($saved[$key]) ? $saved[$key] : $field['default'];
            $id = 'sth_' . $key;
            echo '<tr><th><label for="' . esc_attr($id) . '">' . esc_html($field['label']) . '</label></th><td>';
            if ($field['type'] === 'url') {
                echo '<input class="large-text" type="url" id="' . esc_attr($id) . '" name="' . esc_attr(self::OPTION . '[' . $key . ']') . '" value="' . esc_attr($value) . '">';
            } else {
                echo '<textarea class="large-text" rows="2" id="' . esc_attr($id) . '" name="' . esc_attr(self::OPTION . '[' . $key . ']') . '">' . esc_textarea($value) . '</textarea>';
            }
            echo '</td></tr>';
        }
        foreach (array('request' => 'Richiesta', 'quote' => 'Preventivo', 'sheet' => 'Dati', 'report' => 'Rapportino') as $name => $label) {
            $key = 'asset_' . $name;
            echo '<tr><th><label for="sth_' . esc_attr($key) . '">Visual: ' . esc_html($label) . '</label></th><td><input class="large-text" type="url" id="sth_' . esc_attr($key) . '" name="' . esc_attr(self::OPTION . '[' . $key . ']') . '" value="' . esc_attr(isset($saved[$key]) ? $saved[$key] : '') . '"><p class="description">URL immagine dalla Libreria media. Vuoto = visual incluso nel plugin.</p></td></tr>';
        }
        echo '</table>';
        submit_button();
        echo '</form></div>';
    }
}
add_action('wp_enqueue_scripts', array('STH_Home_Story', 'assets'));
add_filter('template_include', array('STH_Home_Story', 'template'), 99);
add_filter('body_class', array('STH_Home_Story', 'body_class'));
add_action('admin_menu', array('STH_Home_Story', 'admin_menu'));
add_action('admin_init', array('STH_Home_Story', 'admin_init'));
add_shortcode('stealth_home_v4', array('STH_Home_Story', 'render'));
