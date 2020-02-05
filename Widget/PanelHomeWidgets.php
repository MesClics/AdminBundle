<?php
namespace MesClics\AdminBundle\Widget;

use MesClics\UtilsBundle\Widget\WidgetsContainer;
use MesClics\PostBundle\PostRetriever\PostRetriever;
use MesClics\NavigationBundle\Widget\LastActionsWidget;
use MesClics\PostBundle\Widget\PinnedPostBackendCommentsWidget;

class PanelHomeWidgets extends WidgetsContainer{
    protected $post_retriever;

    public function __construct(PostRetriever $post_retriever){
        parent::__construct();
        $this->post_retriever = $post_retriever;
    }
    
    public function initialize($params = array()){
        $this->addWidget(new LastActionsWidget($params['user']));
        $this->addWidget(new PinnedPostBackendCommentsWidget($this->post_retriever));
    }
}