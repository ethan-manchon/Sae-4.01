<?php

namespace ContainerAFXU1wf;

use Symfony\Component\DependencyInjection\Argument\RewindableGenerator;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\DependencyInjection\Exception\RuntimeException;

/**
 * @internal This class has been auto-generated by the Symfony Dependency Injection Component.
 */
class getPostControllerpatchService extends App_KernelDevDebugContainer
{
    /**
     * Gets the private '.service_locator.mlMhPL1.App\Controller\Api\PostController::patch()' shared service.
     *
     * @return \Symfony\Component\DependencyInjection\ServiceLocator
     */
    public static function do($container, $lazyLoad = true)
    {
        return $container->privates['.service_locator.mlMhPL1.App\\Controller\\Api\\PostController::patch()'] = ($container->privates['.service_locator.mlMhPL1'] ?? $container->load('get_ServiceLocator_MlMhPL1Service'))->withContext('App\\Controller\\Api\\PostController::patch()', $container);
    }
}
