<?php
namespace MesClics\AdminBundle\Event\EventListener;

use Symfony\Component\HttpKernel\KernelEvents;
use MesClics\NavigationBundle\Entity\VisitedRoute;
use MesClics\NavigationBundle\Events\ChronologyEvents;
use MesClics\NavigationBundle\Events\ChronologyVisitingRouteEvent;
use Symfony\Component\HttpKernel\Event\FilterControllerArgumentsEvent;
use MesClics\NavigationBundle\Events\EventListeners\NavigationSubscriberInterface;

class AdminNavigationSubscriber extends NavigationSubscriberInterface{

    public static function getSubscribedEvents(){
        return array(
            // KernelEvents::CONTROLLER_ARGUMENTS => 'onKernelControllerArguments',
            KernelEvents::CONTROLLER_ARGUMENTS => 'onKernelControllerArguments',
            ChronologyEvents::VISITING_ROUTE => 'onChronologyVisitingRoute',
        );
    }
    
    // DEPREC: >= 4.3 : FilterControllerArgumentsEvent -> ControllerArgumentsEvent
    public function onKernelControllerArguments(FilterControllerArgumentsEvent $event){
        $request = $event->getRequest();
        $request->attributes->set('navigator', $this->navigator);
        
        $isVisitedRoute = $request->query->get("chronology", false);

        if($isVisitedRoute){
            // add the "isVisitedRoute arg to request"
            $request->attributes->set("isVisitedRoute", $isVisitedRoute);
            //retrieve VisitedRoute object from id
            $isVisitedRoute = $this->navigator->getEm()->getRepository('MesClicsNavigationBundle:VisitedRoute')->find($isVisitedRoute);
            //dispatch chronology.visiting_route event
            $chrono_event = new ChronologyVisitingRouteEvent($isVisitedRoute);
            $this->navigator->triggerEvents([ChronologyEvents::VISITING_ROUTE => $chrono_event]);
        } else{
            $request = $event->getRequest();
            
            if($request->attributes->get('_route')){
                //check if route starts with "mesclics_admin"
                $isAnAdminRoute = preg_match('/^mesclics_admin/', $request->attributes->get('_route'));
                if(!$isAnAdminRoute){
                    return;
                }

                $route = new VisitedRoute($request->attributes->get('_route'), $request->attributes->get('_route_params'));
                // TODO: add a parameter false to addRoute() method if controller gets a "no-not-save-in-chronology parameter OR annotation

                if($this->navigator->getUser() && !is_string($this->navigator->getUser())){
                    $this->navigator->addRoute($route);
                }
            }
        }
    }

    public function onChronologyVisitingRoute(ChronologyVisitingRouteEvent $event){
        //update navigator's prev, curr & next parameters
        $this->navigator->getVisitedRoutes()->setPrevCurrNext($event->getRoute());
    }
}