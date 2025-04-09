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
        '/admin/posts' => [[['_route' => 'admin_post_admin_index_post', '_controller' => 'App\\Controller\\Admin\\PostController::index'], null, ['GET' => 0], null, false, false, null]],
        '/admin/users' => [[['_route' => 'admin_users_index', '_controller' => 'App\\Controller\\Admin\\UserController::index'], null, ['GET' => 0], null, false, false, null]],
        '/api/blockeds' => [[['_route' => 'api_index_blocked', '_controller' => 'App\\Controller\\Api\\BlockedController::index'], null, ['GET' => 0], null, false, false, null]],
        '/api/likes' => [[['_route' => 'api_like_create', '_controller' => 'App\\Controller\\Api\\LikeController::create'], null, ['POST' => 0], null, false, false, null]],
        '/api/posts' => [
            [['_route' => 'api_posts_index', '_controller' => 'App\\Controller\\Api\\PostController::index'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'api_posts_create', '_controller' => 'App\\Controller\\Api\\PostController::create'], null, ['POST' => 0], null, false, false, null],
        ],
        '/api/reposts' => [[['_route' => 'app_repost_create', '_controller' => 'App\\Controller\\Api\\RepostController::create'], null, ['POST' => 0], null, false, false, null]],
        '/api/responds' => [[['_route' => 'app_respond_create', '_controller' => 'App\\Controller\\Api\\RespondController::create'], null, ['POST' => 0], null, false, false, null]],
        '/api/subscribes' => [[['_route' => 'api_index_subscriptions', '_controller' => 'App\\Controller\\Api\\SubscribeController::index'], null, ['GET' => 0], null, false, false, null]],
        '/api/users' => [[['_route' => 'api_index_user', '_controller' => 'App\\Controller\\Api\\UserController::index'], null, ['GET' => 0], null, false, false, null]],
        '/register' => [[['_route' => 'user.register', '_controller' => 'App\\Controller\\RegistrationController::register'], null, ['POST' => 0], null, false, false, null]],
        '/register/verify/email' => [[['_route' => 'app_verify_email', '_controller' => 'App\\Controller\\RegistrationController::verifyUserEmail'], null, null, null, false, false, null]],
        '/login' => [[['_route' => 'login', '_controller' => 'App\\Controller\\SecurityController::login'], null, ['POST' => 0], null, false, false, null]],
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
                    .'|dmin/(?'
                        .'|posts/([^/]++)(?'
                            .'|(*:232)'
                        .')'
                        .'|users/([^/]++)(?'
                            .'|(*:258)'
                        .')'
                    .')'
                    .'|pi/(?'
                        .'|blockeds/([^/]++)(?'
                            .'|(*:294)'
                        .')'
                        .'|likes/(?'
                            .'|([^/]++)(?'
                                .'|(*:323)'
                            .')'
                            .'|post/([^/]++)(*:345)'
                        .')'
                        .'|posts/(?'
                            .'|([^/]++)(?'
                                .'|(*:374)'
                            .')'
                            .'|hashtag/([^/]++)(*:399)'
                            .'|search(*:413)'
                        .')'
                        .'|re(?'
                            .'|posts/([^/]++)(?'
                                .'|(*:444)'
                            .')'
                            .'|sponds/([^/]++)(?'
                                .'|(*:471)'
                            .')'
                        .')'
                        .'|subscribes/([^/]++)(?'
                            .'|(*:503)'
                        .')'
                        .'|users/(?'
                            .'|([^/]++)(?'
                                .'|(*:532)'
                                .'|(*:540)'
                            .')'
                            .'|upload\\-(?'
                                .'|pdp(*:563)'
                                .'|banner(*:577)'
                            .')'
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
        232 => [
            [['_route' => 'admin_post_delete_post', '_controller' => 'App\\Controller\\Admin\\PostController::delete'], ['id'], ['DELETE' => 0], null, false, true, null],
            [['_route' => 'admin_post_patch_post', '_controller' => 'App\\Controller\\Admin\\PostController::patch'], ['id'], ['POST' => 0, 'PATCH' => 1], null, false, true, null],
        ],
        258 => [
            [['_route' => 'admin_user_show', '_controller' => 'App\\Controller\\Admin\\UserController::show'], ['id'], ['GET' => 0], null, false, true, null],
            [['_route' => 'admin_user_update', '_controller' => 'App\\Controller\\Admin\\UserController::update'], ['id'], ['PATCH' => 0], null, false, true, null],
        ],
        294 => [
            [['_route' => 'api_get_blockeds', '_controller' => 'App\\Controller\\Api\\BlockedController::get'], ['id'], ['GET' => 0], null, false, true, null],
            [['_route' => 'api_post_user', '_controller' => 'App\\Controller\\Api\\BlockedController::post'], ['id'], ['POST' => 0], null, false, true, null],
            [['_route' => 'api_unblock_user', '_controller' => 'App\\Controller\\Api\\BlockedController::unblock'], ['id'], ['DELETE' => 0], null, false, true, null],
        ],
        323 => [
            [['_route' => 'app_likes_get', '_controller' => 'App\\Controller\\Api\\LikeController::get'], ['id'], ['GET' => 0], null, false, true, null],
            [['_route' => 'api_like_delete', '_controller' => 'App\\Controller\\Api\\LikeController::delete'], ['id'], ['DELETE' => 0], null, false, true, null],
        ],
        345 => [[['_route' => 'api_like_by_post', '_controller' => 'App\\Controller\\Api\\LikeController::indexByPost'], ['postId'], ['GET' => 0], null, false, true, null]],
        374 => [
            [['_route' => 'delete_post', '_controller' => 'App\\Controller\\Api\\PostController::delete'], ['id'], ['DELETE' => 0], null, false, true, null],
            [['_route' => 'patch_post', '_controller' => 'App\\Controller\\Api\\PostController::patch'], ['id'], ['POST' => 0, 'PATCH' => 1], null, false, true, null],
        ],
        399 => [[['_route' => 'api_hashtag', '_controller' => 'App\\Controller\\Api\\PostController::searchByHashtag'], ['tag'], ['GET' => 0], null, false, true, null]],
        413 => [[['_route' => 'api_posts_search', '_controller' => 'App\\Controller\\Api\\PostController::searchPosts'], [], ['GET' => 0], null, false, false, null]],
        444 => [
            [['_route' => 'get', '_controller' => 'App\\Controller\\Api\\RepostController::get'], ['id'], ['GET' => 0], null, false, true, null],
            [['_route' => 'app_repost_delete', '_controller' => 'App\\Controller\\Api\\RepostController::delete'], ['id'], ['DELETE' => 0], null, false, true, null],
        ],
        471 => [
            [['_route' => 'app_respond_get', '_controller' => 'App\\Controller\\Api\\RespondController::get'], ['id'], ['GET' => 0], null, false, true, null],
            [['_route' => 'app_respond_delete', '_controller' => 'App\\Controller\\Api\\RespondController::delete'], ['id'], ['DELETE' => 0], null, false, true, null],
        ],
        503 => [
            [['_route' => 'api_get_subscriptions', '_controller' => 'App\\Controller\\Api\\SubscribeController::get'], ['id'], ['GET' => 0], null, false, true, null],
            [['_route' => 'api_subscribe_user', '_controller' => 'App\\Controller\\Api\\SubscribeController::subscribe'], ['id'], ['POST' => 0], null, false, true, null],
            [['_route' => 'api_unsubscribe_user', '_controller' => 'App\\Controller\\Api\\SubscribeController::unsubscribe'], ['id'], ['DELETE' => 0], null, false, true, null],
        ],
        532 => [[['_route' => 'api_get_user', '_controller' => 'App\\Controller\\Api\\UserController::get'], ['pseudo'], ['GET' => 0], null, false, true, null]],
        540 => [[['_route' => 'api_update_user', '_controller' => 'App\\Controller\\Api\\UserController::update'], ['id'], ['PATCH' => 0], null, false, true, null]],
        563 => [[['_route' => 'api_upload_pdp', '_controller' => 'App\\Controller\\Api\\UserController::uploadPdp'], [], ['POST' => 0], null, false, false, null]],
        577 => [
            [['_route' => 'api_upload_banner', '_controller' => 'App\\Controller\\Api\\UserController::uploadBanner'], [], ['POST' => 0], null, false, false, null],
            [null, null, null, null, false, false, 0],
        ],
    ],
    null, // $checkCondition
];
