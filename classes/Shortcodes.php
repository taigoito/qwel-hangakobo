<?php
namespace Hangakobo;

trait Shortcodes {
  // ショートコード登録
  public function register_shortcode() {

    // カテゴリーからタイトル(見出しレベル1要素)を取得
    add_shortcode( 'title', [ $this, 'get_title' ] );

    // カテゴリーから説明文(段落要素)を取得
    add_shortcode( 'description', [ $this, 'get_description' ] );

    // コピーライトに現在年を添える
    add_shortcode( 'copyright', [ $this, 'get_copyright' ] );
    
  }


  public function get_title() {

    $wp_obj  = get_queried_object();
    $title = '';

    // 固定ページ
    if ( is_home() || is_page() ) {
      $title = $wp_obj->post_title;

    // 個別投稿ページ
    } else if ( is_single() ) {
      // 投稿に紐づく全タームを取得
      $terms = get_the_terms( $post_id, 'category' );
      $term = $terms[0];
      $title = $term->name;

    // 日付別
    } else if ( is_date() ) {
      $year  = get_query_var( 'year' );
      $month = get_query_var( 'monthnum' );
      $day   = get_query_var( 'day' );
      if ( $day > 0 ) $title = $year . ' / ' . sprintf( '%02d', $month ) . ' / ' . sprintf( '%02d', $day );
      else if ( $month > 0 ) $title = $year . ' / ' . sprintf( '%02d', $month );
      else $title = $year;

    // 投稿者アーカイブ
    } else if ( is_author() ) {
      $title = '著者:' . $wp_obj->display_name;
    
    // タームアーカイブ
    } else if ( is_archive() ) {
      $title = $wp_obj->name;

    // 検索結果ページ
    } else if ( is_search() ) {
      $title = '検索:' . get_search_query();

    // 404ページ
    } else if ( is_404() ) {
      $title = '記事が見つかりません';

    }

    return '<h1>' . $title . '</h1>';

  }


  public function get_description() {

    $wp_obj  = get_queried_object();
    $description = '';

    // 固定ページ
    if ( is_home() || is_page() ) {
      $description = $wp_obj->post_excerpt;

    // 個別投稿ページ
    } else if ( is_single() ) {
      // 投稿に紐づく全タームを取得
      $terms = get_the_terms( $post_id, 'category' );
      $term = $terms[0];
      $description = $term->description;
    
    // タームアーカイブ
    } else if ( is_archive() ) {
      $description = $wp_obj->description;

    }

    return '<p>' . $description . '</p>';
    
  }


  public function get_copyright( $atts ) {
    // デフォルト値
    $atts = shortcode_atts(
      [
        'year' => '2007',
        'text' => 'Osano Naoko'
      ],
      $atts
    );

    // コピーライト文字列を作成
    $copyright = '&copy; ' . $atts[ 'year' ];
    $year = getdate()[ 'year' ];
    if ( $atts[ 'year' ] == $year ) {
      $copyright .= ' ' . $atts[ 'text' ];
    } else {
      $copyright .= ' - ' . $year . ' ' . $atts[ 'text' ];
    }

    return '<small class="copyright">' . $copyright . '</small>';

  }

}
