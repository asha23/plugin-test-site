<?php

namespace ArloSeed\Utils;

final class ScriptsStyles 
{

	public function init()
	{
		add_action( 'wp_enqueue_scripts', [$this, 'enqueue_scripts_styles'], 0);
	}

	public static function rand_num() 
	{
		$randomizr = rand(100,1000000);
		return $randomizr;
	}
	
	public function enqueue_scripts_styles()
	{
		if (!is_admin()) {

			$this->rand = self::rand_num();
			$path = get_stylesheet_directory_uri();
	
			wp_register_script( 
				"manifest-scripts", 
				$path . '/dist/js/manifest.js', 
				[], 
				$this->rand, 
				true
			);
	
			wp_register_script( 
				"vendor-scripts", 
				$path . '/dist/js/vendor.js', 
				['manifest-scripts'], 
				$this->rand, 
				true
			);
	
			wp_register_script( 
				"app-scripts", 
				$path . '/dist/js/app.js', 
				['vendor-scripts'], 
				$this->rand, 
				true
			);
	
			wp_enqueue_script( 'manifest-scripts' );
			wp_enqueue_script( 'vendor-scripts' );
			wp_enqueue_script( 'app-scripts' );
	
			wp_register_style(
				'arlo-style', 
				$path . '/dist/css/app.css', 
				[], 
				$this->rand, 
				'all'
			);
	
			wp_enqueue_style('arlo-style');
		}
	}
}



