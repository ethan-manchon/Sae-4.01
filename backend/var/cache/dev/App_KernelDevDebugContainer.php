<?php

// This file has been auto-generated by the Symfony Dependency Injection Component for internal use.

if (\class_exists(\ContainerAFXU1wf\App_KernelDevDebugContainer::class, false)) {
    // no-op
} elseif (!include __DIR__.'/ContainerAFXU1wf/App_KernelDevDebugContainer.php') {
    touch(__DIR__.'/ContainerAFXU1wf.legacy');

    return;
}

if (!\class_exists(App_KernelDevDebugContainer::class, false)) {
    \class_alias(\ContainerAFXU1wf\App_KernelDevDebugContainer::class, App_KernelDevDebugContainer::class, false);
}

return new \ContainerAFXU1wf\App_KernelDevDebugContainer([
    'container.build_hash' => 'AFXU1wf',
    'container.build_id' => '037906a5',
    'container.build_time' => 1743675727,
    'container.runtime_mode' => \in_array(\PHP_SAPI, ['cli', 'phpdbg', 'embed'], true) ? 'web=0' : 'web=1',
], __DIR__.\DIRECTORY_SEPARATOR.'ContainerAFXU1wf');
