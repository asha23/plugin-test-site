<?php

namespace ArloSeed;
use ArloSeed\Utils\AcfPluginBundle;
use ArloSeed\Utils\ScriptsStyles;
use ArloSeed\Utils\YoastToBottom;
use ArloSeed\Cpt\CustomPostTypes;
use ArloSeed\Acf\PageComponents;
use Codelight\ACFBlocks\Blocks;

class Init 
{
    public function init_theme()
    {
        $check_acf = new AcfPluginBundle();
        $check_acf->init();

        $scripts_styles = new ScriptsStyles();
        $scripts_styles->init();

        $yoast_to_bottom = new YoastToBottom();
        $yoast_to_bottom->init();

        $cpt = new CustomPostTypes();
        $cpt->init();
       
        $PageComponents = new PageComponents();
        $PageComponents->init();
    }

}

