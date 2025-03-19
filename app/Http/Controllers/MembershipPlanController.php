<?php
namespace App\Http\Controllers;

use App\Models\MembershipPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class MembershipPlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Fetch paginated data
        $perPage = $request->input('per_page', 5);

        $data = MembershipPlan::paginate($perPage);
        return response()->json($data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        // dd($user->hasRole('manager'));

        // Check if the authenticated user is a 'manager'
        if (! $user || ! $user->hasRole(['manager', 'librarian']) || ! $user->can('manage membershipPlans')) {
            return response()->json(['error' => 'Only managers and Librarian can register new admins.'], 403);
        }

        //----This validate for incoming value to not empty---//
        try {
            $validatedData = $request->validate([
                'PlanName'    => 'required|string',
                'Duration'    => 'required|integer',
                'Price'       => 'required|decimal:2',
                'Description' => 'required|string',
            ]);
        } catch (ValidationException $e) {
            // Return only the error messages as an array
            return response()->json(['message' => $e->errors()], 422);
        }

        try {
            $result = MembershipPlan::create($validatedData);

            if ($result) {
                return response()->json([
                    'status'  => 200,
                    'message' => 'Data inserted successfully',
                ]);
            }

            //----This return if the data does not enter into database----//
            return response()->json([
                'status'  => 500,
                'message' => 'Data not inserted',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 500,
                'message' => $e,
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            // Find the payment type by ID
            $membership = MembershipPlan::findOrFail($id);

            return response()->json([
                'status'  => 200,
                'message' => 'Payment type retrieved successfully',
                'data'    => $membership,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 404,
                'message' => 'Payment type not found',
                'error'   => $e->getMessage(),
            ], 404);
        }
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MembershipPlan $membershipPlan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Check if the authenticated user is a 'manager' or 'librarian'
        $user = Auth::user();
        if (! $user || ! $user->hasRole(['manager', 'librarian']) || ! $user->can('manage membershipPlans')) {
            return response()->json(['error' => 'Only managers and Librarians can update membership plans.'], 403);
        }

        // Retrieve the existing membership plan by ID
        $membershipPlan = MembershipPlan::find($id);
        if (! $membershipPlan) {
            return response()->json(['error' => 'Membership plan not found.'], 404);
        }

        // Validate incoming data, but don't force all fields to be present
        try {
            $validatedData = $request->validate([
                'PlanName'    => 'nullable|string',
                'Duration'    => 'nullable|string',
                'Price'       => 'nullable|decimal:2',
                'Description' => 'nullable|string',
            ]);
        } catch (ValidationException $e) {
            return response()->json(['message' => $e->getMessage()]);
        }

        // Update the missing fields with current values from the database
        $updatedData = [
            'PlanName'    => $validatedData['PlanName'] ?? $membershipPlan->PlanName,
            'Duration'    => $validatedData['Duration'] ?? $membershipPlan->Duration,
            'Price'       => $validatedData['Price'] ?? $membershipPlan->Price,
            'Description' => $validatedData['Description'] ?? $membershipPlan->Description,
        ];

        try {
            // Update the membership plan with the new or existing data
            $membershipPlan->update($updatedData);

            return response()->json([
                'status'  => 200,
                'message' => 'Membership plan updated successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 500,
                'message' => 'Error updating membership plan: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MembershipPlan $membershipPlan)
    {
        //
    }
}
