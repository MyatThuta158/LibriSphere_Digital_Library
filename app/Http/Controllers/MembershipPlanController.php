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
    public function index()
    {
        $data=MembershipPlan::all();
        return response()->json(["data"=>$data]);
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
         if (!$user || !$user->hasRole(['manager','librarian'])||!$user->can('manage membershipPlans')) {
             return response()->json(['error' => 'Only managers and Librarian can register new admins.'], 403);
         }

      

         //----This validate for incoming value to not empty---//
       try{
              $validatedData = $request->validate([
            'PlanName' => 'required|string',
            'Duration'=> 'required|string',
            'Price'=>'required|decimal:2',
            'Description'=>'required|string',
        ]);
       }catch(ValidationException $e){
            return response()->json(['message'=>$e]);
       }

      
        try{
            $result=MembershipPlan::create($validatedData);

            if($result){
                return response()->json([
                    'status'=>200,
                    'message'=>'Data inserted successfully'
            ]);
            }

            //----This return if the data does not enter into database----//
            return response()->json([
                'status'=>500,
                'message'=>'Data not inserted'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'=>500,
                'message'=>$e,
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(MembershipPlan $membershipPlan)
    {
        //
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
    public function update(Request $request, MembershipPlan $membershipPlan)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MembershipPlan $membershipPlan)
    {
        //
    }
}
