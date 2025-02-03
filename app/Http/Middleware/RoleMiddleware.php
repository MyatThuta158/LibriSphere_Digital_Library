<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $role
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, $role)
    {
        // if (!Auth::check()) {
        //     return response()->json(['error' => 'Unauthorized'], 401);
        // }

        // // Check for the role based on whether the user is an admin or a regular user
        // if ($role === 'admin') {
        //     // Assuming the Admin model has a method like `isAdmin` or checking if the user is an admin
        //     if (Auth::user() && !Auth::user()->isAdmin()) {
        //         return response()->json(['error' => 'Unauthorized'], 403);
        //     }
        // } elseif ($role === 'user') {
        //     // Check if the user is a regular user
        //     if (Auth::user() && !Auth::user()->isUser()) {
        //         return response()->json(['error' => 'Unauthorized'], 403);
        //     }
        // }

        // return $next($request);
    }
}
