<?php

namespace MesClics\AdminBundle\Entity;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Form\Form;

class TypeManager{
    private $request;
    private $form;
    private $hasSucceeded = false;
    private $result = null;
    private $action = null;

    public function getRequest(){
        return $this->request;
    }

    protected function setRequest(Request $request){
        $this->request = $request;
        return $this;
    }

    public function getForm(){
        return $this->form;
    }

    protected function setForm(Form $form){
        $this->form = $form;
        return $this;
    }

    public function hasSucceeded(){
        return $this->hasSucceeded;
    }

    protected function setHasSucceeded($success){
        $this->hasSucceeded = $success;
        return $this;
    }

    public function getResult(){
        return $this->result;
    }

    protected function setResult($result){
        $this->result = $result;
        return $this;
    }

    public function getAction(){
        return $this->action;
    }

    protected function setAction($action){
        $this->action = $action;
        return $this;
    }

    public function __construct($request, $form){
        $this->setRequest($request);
        $this->setForm($form);
        //on fait le lien entre la requête et le formulaire, $object contient les valeurs entrées dans le formulaire
        $this->getForm()->handleRequest($this->getRequest());
    }

    public function handle($em){
        //on vérifie la validité des données saisies
        if($this->getForm()->isSubmitted()){
            if($this->getForm()->isValid()){
                $this->setAction($this->getForm()->getClickedButton()->getName());
                $this->setResult($this->getForm()->getData());
                //on persiste notre objet en bdd
                $em->persist($this->result);
                $em->flush();
                $this->setHasSucceeded(true);
            } else{
                $this->setHasSucceeded(false);
            }
        }
        return $this;
    }
}