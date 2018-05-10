<?php

namespace MesClics\AdminBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

class Notification
{
    private $successMessage;
    private $errorMessage;
    private $successRedirection;
    private $errorRedirection;

    public function setSuccessMessage($successMessage = null)
    {
        $this->successMessage = $successMessage;

        return $this;
    }

    public function getSuccessMessage()
    {
        return $this->successMessage;
    }
    
    public function setErrorMessage($errorMessage = null)
    {
        $this->errorMessage = $errorMessage;

        return $this;
    }
    
    public function getErrorMessage()
    {
        return $this->errorMessage;
    }
    
    public function setSuccessRedirection($successRedirection = null)
    {
        $this->successRedirection = $successRedirection;

        return $this;
    }
    
    public function getSuccessRedirection()
    {
        return $this->successRedirection;
    }
    
    public function setErrorRedirection($errorRedirection = null)
    {
        $this->errorRedirection = $errorRedirection;

        return $this;
    }
    
    public function getErrorRedirection()
    {
        return $this->errorRedirection;
    }

    public function __construct($type, $mess, $redirect){
        if($type == 'success'){
            $this->setSuccessMessage($mess);
            $this->setSuccessRedirection($redirect);
        }

        if($type == 'error'){
            $this->setErrorMessage($mess);
            $this->setErrorRedirection($mess);
        }
    }
}
