<?php
namespace Hangakobo;

trait Scripts {
  // CSS, JSファイルを読み込み
  public static function enqueue_scripts() {
    // バージョン情報を取得
		$version = wp_get_theme()->get( 'Version' );

		// Typesquare (fonts)
		wp_enqueue_script('fonts', '//typesquare.com/3/tsst/script/ja/typesquare.js?5d707b2fef1c4640b81d12bbac1e0217&fadein=10', [], null, false);

		// style.css
		wp_enqueue_style(
			'style',
			get_template_directory_uri() . '/style.css',
			[],
			$version
		);

		// init.js
		wp_enqueue_script(
			'init',
			get_template_directory_uri() . '/init.js',
			[],
			$version,
			true
		);

  }

}
