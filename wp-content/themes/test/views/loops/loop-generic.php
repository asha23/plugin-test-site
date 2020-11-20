<?php

use Samrap\Acf\Acf;

$content = Acf::field('content')->get();

?>

<main class="row">
	<div class="col">
		<?php if($content): ?>
			<?= $content; ?>
		<?php else: ?>
			<?= get_the_content(); ?>
		<?php endif; ?>
	</div>
</main>


