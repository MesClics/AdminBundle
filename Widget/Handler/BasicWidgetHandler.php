<?php
namespace MesClics\AdminBundle\Widget\Handler;

use MesClics\UtilsBundle\Widget\Widget;
use Symfony\Component\HttpFoundation\Request;
use MesClics\UtilsBundle\Widget\Handler\WidgetHandler;


class BasicWidgetHandler extends WidgetHandler{    
    public function handleRequest(Widget $widget, Request $request){
        return $request;
    }
}