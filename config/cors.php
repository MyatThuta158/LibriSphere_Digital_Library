<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

      //'paths' => ['*', 'sanctum/csrf-cookie'],v
    // 'paths' => ['*'],
    'paths'                    => ['api/*', 'sanctum/csrf-cookie', '*', 'file/*', 'streamVideo/*'],
    'allowed_methods'          => ['*'],
    'allowed_origins'          => ['http://localhost:5173'],
    'allowed_origins_patterns' => [],
    'allowed_headers'          => ['*'],
    'exposed_headers'          => ['Content-Range', 'Accept-Ranges', 'Content-Length'],
    'max_age'                  => 3600,
    'supports_credentials'     => true,

    // 'paths'                    => ['api/*', 'streamVideo/*'],
    // 'allowed_origins'          => ['http://localhost:5173'],
    // 'allowed_methods'          => ['*'],
    // 'allowed_headers'          => ['*'],
    // 'exposed_headers'          => ['Content-Range', 'Accept-Ranges', 'Content-Length'],
    // 'max_age'                  => 0,
    // 'supports_credentials'     => false,

//     'paths' => ['api/*', 'sanctum/csrf-cookie', 'file/*'], // Add your paths
// 'allowed_origins' => [env('FONTEND_URL')], // Or use '*' for testing
// 'allowed_headers' => ['Content-Type', 'Accept', 'Authorization', 'X-Requested-With','*'],
// 'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE'],
// 'allowed_origins_patterns' => [],
//  'exposed_headers' => [],
//   'max_age' => 3600,
//     'supports_credentials' => true,

];
