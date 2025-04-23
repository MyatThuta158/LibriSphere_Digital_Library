<?php
namespace App\Http\Controllers;

use App\Models\Subscription;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1) Validate
        try {
            $validated = $request->validate([
                'email'    => 'required|email|string',
                'password' => 'required|string',
            ]);
        } catch (ValidationException $e) {
            return response()->json(['message' => $e->errors()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $email    = $validated['email'];
        $password = $validated['password'];

        // 2) Admin login shortcut
        $admin = \App\Models\Admin::where('Email', $email)->first();
        if ($admin && Hash::check($password, $admin->Password)) {
            $token  = $admin->createToken('token')->plainTextToken;
            $cookie = cookie('token', $token, 60 * 24);
            return response()
                ->json([
                    'message' => 'Admin login successful!',
                    'user'    => $admin,
                    'token'   => $token,
                    'role'    => 'admin',
                ])
                ->withCookie($cookie);
        }

        // 3) Regular user
        $user = \App\Models\User::where('email', $email)->first();
        if (! $user || ! Hash::check($password, $user->password)) {
            return response()->json(
                ['message' => 'Invalid login credentials'],
                Response::HTTP_UNAUTHORIZED
            );
        }

        // 4) Check subscription expiry
        $latestSub = Subscription::where('users_id', $user->id)
            ->orderBy('MemberEndDate', 'desc')
            ->first();

        if ($latestSub) {
            // Parse the end date and compare to now
            $endsAt = Carbon::parse($latestSub->MemberEndDate);
            if (Carbon::now()->greaterThan($endsAt)) {
                // subscription expired → downgrade role
                $user->role = 'community_member';
                $user->save();
            }
        }

        // 5) Issue token & respond
        $token  = $user->createToken('user_token')->plainTextToken;
        $cookie = cookie('token', $token, 60 * 24);

        return response()
            ->json([
                'message' => 'User login successful!',
                'user'    => $user,
                'token'   => $token,
                'role'    => $user->role,
            ])
            ->withCookie($cookie);
    }
}
