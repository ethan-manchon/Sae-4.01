<?php

namespace ContainerVpcxvPx;

use Symfony\Component\DependencyInjection\Argument\RewindableGenerator;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\DependencyInjection\Exception\RuntimeException;

/**
 * @internal This class has been auto-generated by the Symfony Dependency Injection Component.
 */
class getSubscribeControllerindexService extends App_KernelDevDebugContainer
{
    /**
     * Gets the private '.service_locator.GeaxSsJ.App\Controller\Api\SubscribeController::index()' shared service.
     *
     * @return \Symfony\Component\DependencyInjection\ServiceLocator
     */
    public static function do($container, $lazyLoad = true)
    {
        return $container->privates['.service_locator.GeaxSsJ.App\\Controller\\Api\\SubscribeController::index()'] = (new \Symfony\Component\DependencyInjection\Argument\ServiceLocator($container->getService ??= $container->getService(...), [
            'subscribeRepo' => ['privates', 'App\\Repository\\SubscribeRepository', 'getSubscribeRepositoryService', true],
        ], [
            'subscribeRepo' => 'App\\Repository\\SubscribeRepository',
        ]))->withContext('App\\Controller\\Api\\SubscribeController::index()', $container);
    }
}
