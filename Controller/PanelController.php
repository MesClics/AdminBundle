<?php
namespace MesClics\AdminBundle\Controller;

use MesClics\UserBundle\Entity\User;
use MesClics\UserBundle\Form\UserType;
use MesClics\MessagesBundle\Entity\Message;
use Symfony\Component\HttpFoundation\Request;
use MesClics\EspaceClientBundle\Entity\Client;
use Symfony\Component\HttpFoundation\Response;
use MesClics\EspaceClientBundle\Form\ClientType;
use MesClics\AdminBundle\Widget\PanelHomeWidgets;
use MesClics\MessagesBundle\Form\UserMessageType;
use MesClics\UserBundle\Form\UserAdminRegistrationType;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class PanelController extends Controller{
    /**
     * @Security("has_role('ROLE_ADMIN')")
     */
    public function homeAction(PanelHomeWidgets $admin_widgets, Request $request){
        $widgets_params = array(
            'user' => $this->get('security.token_storage')->getToken()->getUser()
        );
        $admin_widgets->initialize($widgets_params);

        $args = array(
            'widgets' => $admin_widgets->getWidgets()
        );
        //on génère la vue
        return $this->render('MesClicsAdminBundle::layout.html.twig', $args);
    }

    public function traductionAction($name){
        $args = array(
            'name' => $name
        );
        return $this->render('MesClicsAdminBundle:Panel:translation.html.twig', $args);
    }
}