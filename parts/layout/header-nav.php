  <div class="brand-home">
    <?php
    if (has_custom_logo()) {
      the_custom_logo();
    } else {
      echo '<a href="' . home_url('/') . '">' . get_bloginfo('name') . '</a>';
    }
    ?>
  </div>
  <button id="menu-toggler" class="menu-toggler" type="button" data-toggle="slidebar"><span data-icon="ei-navicon" data-size="l"></span></button>
