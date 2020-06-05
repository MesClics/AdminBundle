<?php
namespace MesClics\AdminBundle\Widget;

use MesClics\UtilsBundle\Widget\WidgetsContainer;
use MesClics\PostBundle\PostRetriever\PostRetriever;
use MesClics\NavigationBundle\Widget\LastActionsWidget;
use MesClics\MessagesBundle\Widget\UnreadMessagesWidget;
use MesClics\AdminBundle\Widget\Handler\BasicWidgetHandler;
use MesClics\PostBundle\Widget\PinnedPostBackendCommentsWidget;

class PanelHomeWidgets extends WidgetsContainer{
    protected $post_retriever;
    protected $basic_handler;

    public function __construct(PostRetriever $post_retriever, BasicWidgetHandler $bh){
        parent::__construct();
        $this->post_retriever = $post_retriever;
        $this->basic_handler = $bh;
    }
    
    public function initialize($params = array()){
        // NAVIGATOR'S LAST ACTIONS
        $this->addWidget(new LastActionsWidget($params['user']));
        
        // PINNED POST BACKEND COMMENTS
        $this->addWidget(new PinnedPostBackendCommentsWidget($this->post_retriever));
        
        // UNREAD MESSAGES
        $this->addWidget(new UnreadMessagesWidget($params['user'], $this->basic_handler));
        $unread_messages_widget = $this->getWidget('unread_messages');
        $unread_messages_widget
            ->addClasses(['unread-messages', 'small']);
            
            if(sizeof($unread_messages_widget->getMessages()) > 1){
                $unread_messages_widget->setTitle($unread_messages_widget->countMessages() . ' messages non lus');
            } else{
                $unread_messages_widget->setTitle($unread_messages_widget->countMessages() . ' message non lu');
            };

        if(sizeof($unread_messages_widget->getMessages()) > 0){
            $unread_messages_widget->addClass('highlight');
        }
    }
}