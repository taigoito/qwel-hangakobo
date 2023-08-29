<?php
/**
 * Hangakobo functions
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 * @package Hangakobo-Two
 */

/*
 * テーマのパス, URI
 */
define( 'HANGAKOBO_DIR', get_template_directory() );
define( 'HANGAKOBO_URI', get_template_directory_uri() );


/*
 * classのオートロード
 */
spl_autoload_register(
	function( $classname ) {
		if ( strpos( $classname, 'Hangakobo' ) === false ) return;
		$classname = str_replace( '\\', '/', $classname );
		$classname = str_replace( 'Hangakobo/', '', $classname );
		$file      = HANGAKOBO_DIR . '/classes/' . $classname . '.php';
		if ( file_exists( $file ) ) {
			require $file;
		}
	}
);

/*
 * Hookする関数群を継承して登録
 */
class Hangakobo {
	use	\Hangakobo\Supports,
		\Hangakobo\Scripts,
		\Hangakobo\Shortcodes;
		
	public function __construct() {
		// テーマサポート機能
		add_action( 'after_setup_theme', [ $this, 'setup_theme' ] );

		// CSS, JSファイルを読み込み
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_scripts' ] );

		// ショートコード登録
		add_action( 'init', [ $this, 'register_shortcode' ] );
	}
}

/**
 * Hangakobo start!
 */
new Hangakobo();
