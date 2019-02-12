<?php
namespace MesClics\AdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use MesClics\EspaceClientBundle\Entity\Client;
use MesClics\EspaceClientBundle\Form\ClientType;
use MesClics\UserBundle\Entity\User;
use MesClics\UserBundle\Form\UserAdminRegistrationType;
use MesClics\UserBundle\Form\UserType;
use MesClics\MessagesBundle\Entity\Message;
use MesClics\MessagesBundle\Form\UserMessageType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;

class PanelController extends Controller{
    /**
     * @Security("has_role('ROLE_ADMIN')")
     */
    public function homeAction(Request $request){
        //on récupère le compteur de messages non lus pour l'utilisateur
        $em = $this->getDoctrine()->getManager();
        $messagesRepo = $em->getRepository('MesClicsMessagesBundle:Message');
        $user = $this->get('security.token_storage')->getToken()->getUser();

        $unread_messages_count = $messagesRepo->countUnreadMessages($user);
        
        $args = array(
            'currentSection' => 'home',
            'unread_messages_count' => $unread_messages_count
        );
        //on génère la vue
        return $this->render('MesClicsAdminBundle:Panel:home.html.twig', $args);
    }

    public function traductionAction($name){
        $args = array(
            'name' => $name
        );
        return $this->render('MesClicsAdminBundle:Panel:translation.html.twig', $args);
    }
}