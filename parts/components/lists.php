        <article class="lists__item">
          <div class="lists__image">
            <a href="<?php the_permalink(); ?>">
              <?php
              if (has_post_thumbnail()) {
                the_post_thumbnail('large');
              } else {
                no_image('lg');
              }
              ?>
            </a>
          </div>
          <div class="lists__textbox">
            <div class="lists__textbox-inner">
              <div class="lists__content">
                <div class="lists__date"><?php the_time('Y.m.d'); ?></div>
                <h3 class="lists__heading">
                  <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                </h3>
                <!--<ul class="lists__terms">
                  <?php /*
                  $terms = get_the_category($post->ID);
                  foreach ($terms as $term) {
                    echo '<li class="lists__term"><a href="' . get_term_link($term->slug, 'category') . '">' . $term->name . '</a></li> ';
                  }
                  */ ?>
                </ul>-->
                <p class="lists__intro"><?php echo mb_substr(get_the_excerpt(),0,64) . '&#046;&#046;&#046;'; ?> <a href="<?php the_permalink(); ?>">[もっと読む]</a></p>
              </div>
            </div>
          </div>
        </article>