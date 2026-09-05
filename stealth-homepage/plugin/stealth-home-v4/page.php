<?php
defined('ABSPATH') || exit;
get_header();
echo STH_Home_Story::render(); // All editable substitutions escaped in render().
get_footer();
