<?php
namespace MesClics\AdminBundle\BetaHTMLAdder;

use Symfony\Component\HttpFoundation\Response;

class BetaHTMLAdder{
    
    public function addBeta(Response $response, $remainingDays){
        $content = $response->getContent();

        $html ='<div class="notification">Beta J-' . (int) $remainingDays . ' !</div>';

        $content = str_replace('</body>', $html . '</body>', $content);

        $response->setContent($content);

        return $response;
    }
}