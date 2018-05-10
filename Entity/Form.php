<?php

namespace MesClics\AdminBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

class Form
{
    private $id;
    private $name;
    private $manager;

    public function getId()
    {
        return $this->id;
    }
    
    public function setName($name = null)
    {
        $this->name = $name;

        return $this;
    }
    
    public function getName()
    {
        return $this->name;
    }
    
    public function setManager($manager)
    {
        $this->manager = $manager;

        return $this;
    }
    
    public function getManager()
    {
        return $this->manager;
    }
}
