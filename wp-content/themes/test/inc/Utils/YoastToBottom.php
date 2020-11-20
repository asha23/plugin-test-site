<?php

namespace ArloSeed\utils;

class YoastToBottom 
{
    public function init()
    {
        add_filter('wpseo_metabox_prio', [$this, 'move']);
    }

    public function move()
    {
        return 'low';
    }
}



