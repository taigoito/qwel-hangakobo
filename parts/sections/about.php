    <section id="about" class="about">
      <h2 class="about__heading">制作に寄せて</h2>
      <div class="one-col">
        <?php
        $posts = get_posts([
          'posts_per_page' => 1,
          'include' => 11,
          'post_type' => 'page'
        ]);
        foreach ($posts as $post) {
          setup_postdata($post);
          get_template_part('parts/components/one-col-os');
        }
        ?>
      </div><!-- .one-col -->
    </section><!-- .about -->
