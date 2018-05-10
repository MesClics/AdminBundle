<?php
namespace MesClics\AdminBundle\Event\EventListener;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use MesClics\AdminBundle\BetaHTMLAdder\BetaHTMLAdder;

class BetaListener{
    private $betaHTMLAdder;
    private $endDate;

    public function __construct(BetaHTMLAdder $betaHTMLAdder, $endDate){
        $this->betaHTMLAdder = $betaHTMLAdder;
        $this->endDate = new \DateTime($endDate);
    }

    public function processBeta(FilterResponseEvent $event){
        //on teste si la requête est bvien la requête principale:
        if(!$event->isMasterRequest()){
            $return;
        }
        
        $remainingDays = $this->endDate->diff(new \DateTime())->days;

        if($remainingDays <= 0){
            return;
        }
        
        $response = $this->betaHTMLAdder->addBeta($event->getResponse(), $remainingDays);
        $event->setResponse($response);
    }
}