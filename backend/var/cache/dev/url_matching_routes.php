<?php

/**
 * This file has been auto-generated
 * by the Symfony Routing Component.
 */

return [
    false, // $matchHost
    [ // $staticRoutes
        '/_wdt/styles' => [[['_route' => '_wdt_stylesheet', '_controller' => 'web_profiler.controller.profiler::toolbarStylesheetAction'], null, null, null, false, false, null]],
        '/_profiler' => [[['_route' => '_profiler_home', '_controller' => 'web_profiler.controller.profiler::homeAction'], null, null, null, true, false, null]],
        '/_profiler/search' => [[['_route' => '_profiler_search', '_controller' => 'web_profiler.controller.profiler::searchAction'], null, null, null, false, false, null]],
        '/_profiler/search_bar' => [[['_route' => '_profiler_search_bar', '_controller' => 'web_profiler.controller.profiler::searchBarAction'], null, null, null, false, false, null]],
        '/_profiler/phpinfo' => [[['_route' => '_profiler_phpinfo', '_controller' => 'web_profiler.controller.profiler::phpinfoAction'], null, null, null, false, false, null]],
        '/_profiler/xdebug' => [[['_route' => '_profiler_xdebug', '_controller' => 'web_profiler.controller.profiler::xdebugAction'], null, null, null, false, false, null]],
        '/_profiler/open' => [[['_route' => '_profiler_open_file', '_controller' => 'web_profiler.controller.profiler::openAction'], null, null, null, false, false, null]],
        '/admin/users' => [[['_route' => 'admin_users_index', '_controller' => 'App\\Controller\\Admin\\UserController::index'], null, ['GET' => 0], null, false, false, null]],
        '/api/likes' => [
            [['_route' => 'app_likes_index', '_controller' => 'App\\Controller\\Api\\LikeController::index'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'api_like_create', '_controller' => 'App\\Controller\\Api\\LikeController::create'], null, ['POST' => 0], null, false, false, null],
        ],
        '/api' => [[['_route' => 'api_base', '_controller' => 'App\\Controller\\Api\\PostController::base'], null, null, null, false, false, null]],
        '/api/posts' => [
            [['_route' => 'api_posts_index', '_controller' => 'App\\Controller\\Api\\PostController::index'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'api_posts_create', '_controller' => 'App\\Controller\\Api\\PostController::create'], null, ['POST' => 0], null, false, false, null],
        ],
        '/api/feed' => [[['_route' => 'api_feed', '_controller' => 'App\\Controller\\Api\\PostController::feed'], null, ['GET' => 0], null, false, false, null]],
        '/api/register' => [[['_route' => 'api_user_register', '_controller' => 'App\\Controller\\Api\\RegistrationController::register'], null, ['POST' => 0], null, false, false, null]],
        '/api/verify/email' => [[['_route' => 'app_verify_email', '_controller' => 'App\\Controller\\Api\\RegistrationController::verifyUserEmail'], null, null, null, false, false, null]],
        '/api/me' => [[['_route' => 'api_me', '_controller' => 'App\\Controller\\Api\\UserController::me'], null, ['GET' => 0], null, false, false, null]],
        '/login' => [[['_route' => 'login', '_controller' => 'App\\Controller\\Login\\SecurityController::login'], null, ['POST' => 0], null, false, false, null]],
    ],
    [ // $regexpList
        0 => '{^(?'
                .'|/_(?'
                    .'|error/(\\d+)(?:\\.([^/]++))?(*:38)'
                    .'|wdt/([^/]++)(*:57)'
                    .'|profiler/(?'
                        .'|font/([^/\\.]++)\\.woff2(*:98)'
                        .'|([^/]++)(?'
                            .'|/(?'
                                .'|search/results(*:134)'
                                .'|router(*:148)'
                                .'|exception(?'
                                    .'|(*:168)'
                                    .'|\\.css(*:181)'
                                .')'
                            .')'
                            .'|(*:191)'
                        .')'
                    .')'
                .')'
                .'|/a(?'
                    .'|dmin/users/([^/]++)(?'
                        .'|(*:229)'
                    .')'
                    .'|pi/(?'
                        .'|likes/(?'
                            .'|([^/]++)(?'
                                .'|(*:264)'
                            .')'
                            .'|post/([^/]++)(*:286)'
                        .')'
                        .'|p(?'
                            .'|osts/([^/]++)(*:312)'
                            .'|rofil/([^/]++)(*:334)'
                        .')'
                        .'|user(?'
                            .'|/([^/]++)/followers(*:369)'
                            .'|s/([^/]++)(*:387)'
                        .')'
                        .'|subscribe/([^/]++)(?'
                            .'|(*:417)'
                        .')'
                    .')'
                .')'
            .')/?$}sDu',
    ],
    [ // $dynamicRoutes
        38 => [[['_route' => '_preview_error', '_controller' => 'error_controller::preview', '_format' => 'html'], ['code', '_format'], null, null, false, true, null]],
        57 => [[['_route' => '_wdt', '_controller' => 'web_profiler.controller.profiler::toolbarAction'], ['token'], null, null, false, true, null]],
        98 => [[['_route' => '_profiler_font', '_controller' => 'web_profiler.controller.profiler::fontAction'], ['fontName'], null, null, false, false, null]],
        134 => [[['_route' => '_profiler_search_results', '_controller' => 'web_profiler.controller.profiler::searchResultsAction'], ['token'], null, null, false, false, null]],
        148 => [[['_route' => '_profiler_router', '_controller' => 'web_profiler.controller.router::panelAction'], ['token'], null, null, false, false, null]],
        168 => [[['_route' => '_profiler_exception', '_controller' => 'web_profiler.controller.exception_panel::body'], ['token'], null, null, false, false, null]],
        181 => [[['_route' => '_profiler_exception_css', '_controller' => 'web_profiler.controller.exception_panel::stylesheet'], ['token'], null, null, false, false, null]],
        191 => [[['_route' => '_profiler', '_controller' => 'web_profiler.controller.profiler::panelAction'], ['token'], null, null, false, true, null]],
        229 => [
            [['_route' => 'admin_user_show', '_controller' => 'App\\Controller\\Admin\\UserController::show'], ['id'], ['GET' => 0], null, false, true, null],
            [['_route' => 'admin_user_update', '_controller' => 'App\\Controller\\Admin\\UserController::update'], ['id'], ['PATCH' => 0], null, false, true, null],
        ],
        264 => [
            [['_route' => 'like_get', '_controller' => 'App\\Controller\\Api\\LikeController::get'], ['id'], ['GET' => 0], null, false, true, null],
            [['_route' => 'api_like_delete', '_controller' => 'App\\Controller\\Api\\LikeController::delete'], ['id'], ['DELETE' => 0], null, false, true, null],
        ],
        286 => [[['_route' => 'api_like_by_post', '_controller' => 'App\\Controller\\Api\\LikeController::indexByPost'], ['postId'], ['GET' => 0], null, false, true, null]],
        312 => [[['_route' => 'delete_post', '_controller' => 'App\\Controller\\Api\\PostController::delete'], ['id'], ['DELETE' => 0], null, false, true, null]],
        334 => [[['_route' => 'api_profil', '_controller' => 'App\\Controller\\Api\\UserController::profil'], ['pseudo'], ['GET' => 0], null, false, true, null]],
        369 => [[['_route' => 'api_user_followers', '_controller' => 'App\\Controller\\Api\\SubscribeController::getFollowers'], ['id'], ['GET' => 0], null, false, false, null]],
        387 => [[['_route' => 'api_user_refresh_update', '_controller' => 'App\\Controller\\Api\\UserController::updateRefresh'], ['id'], ['PATCH' => 0], null, false, true, null]],
        417 => [
            [['_route' => 'api_subscribe_user', '_controller' => 'App\\Controller\\Api\\SubscribeController::subscribe'], ['id'], ['POST' => 0], null, false, true, null],
            [['_route' => 'api_unsubscribe_user', '_controller' => 'App\\Controller\\Api\\SubscribeController::unsubscribe'], ['id'], ['DELETE' => 0], null, false, true, null],
            [null, null, null, null, false, false, 0],
        ],
    ],
    null, // $checkCondition
];
