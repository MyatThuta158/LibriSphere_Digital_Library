<?php

namespace App\Http\Controllers;

use App\Models\Payment_Types;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class PaymentTypesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data=Payment_Types::all();
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
        ob_clean();
        $user = Auth::user();

        // Check if the authenticated user has the required roles or permissions
        if (!$user || !$user->hasRole(['manager', 'librarian']) || !$user->can('manage payment_types')) {
            return response()->json(['error' => 'Only managers or librarians can add payment types.'], 403);
        }
    
        // Validate the request
        $validate = $request->validate([
            'PaymentTypeName' => 'required|string|max:255',
            'AccountName' => 'required|string|max:255',
            'AccountNumber' => 'required|string|max:255',
            'BankName' => 'required|string|max:255',
            'QR_Scan' => 'required|image|mimes:jpeg,png,jpg,gif,svg', 
        ]);
    
        try {
            // Handle file upload for QR_Scan
            if ($request->hasFile('QR_Scan')) {
                $qrScanFile = $request->file('QR_Scan');
                $qrScanPath = $qrScanFile->store('payment_types', 'public');
    
                // Store payment type in the database
                $paymentType = Payment_Types::create([
                    'PaymentTypeName' => $validate['PaymentTypeName'],
                    'AccountName' => $validate['AccountName'],
                    'AccountNumber' => $validate['AccountNumber'],
                    'BankName' => $validate['BankName'],
                    'QR_Scan' => $qrScanPath,
                ]);
    
                return response()->json([
                    'status' => 200,
                    'message' => 'Payment type created successfully',
                    'data' => $paymentType
                ]);
            } else {
                return response()->json([
                    'status' => 400,
                    'message' => 'QR code upload failed'
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while saving the payment type',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Payment_Types $payment_Types)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payment_Types $payment_Types)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Payment_Types $payment_Types)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payment_Types $payment_Types)
    {
        //
    }
}
