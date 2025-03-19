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
    public function index(Request $request)
    {
        // Determine how many items per page (default to 10)
        $perPage = $request->input('per_page', 5);
        // Retrieve paginated payment types
        $data = Payment_Types::paginate($perPage);
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
        ob_clean();
        $user = Auth::user();

        // Check if the authenticated user has the required roles or permissions
        if (! $user || ! $user->hasRole(['manager', 'librarian']) || ! $user->can('manage payment_types')) {
            return response()->json(['error' => 'Only managers or librarians can add payment types.'], 403);
        }

        // Validate the request
        $validate = $request->validate([
            'PaymentTypeName' => 'required|string|max:255',
            'AccountName'     => 'required|string|max:255',
            'AccountNumber'   => 'required|string|max:255',
            'BankName'        => 'required|string|max:255',
            'BankLogo'        => 'required|image|mimes:jpeg,png,jpg,gif,svg',
            'QR_Scan'         => 'required|image|mimes:jpeg,png,jpg,gif,svg',
        ]);

        // Check if the bank account number and bank name already exist in the database
        $exists = Payment_Types::where('AccountNumber', $validate['AccountNumber'])
            ->where('BankName', $validate['BankName'])
            ->exists();

        if ($exists) {
            return response()->json([
                'status'  => 400,
                'message' => 'The bank account number is already exist in the database.',
            ]);
        }

        try {
            // Ensure both files exist
            if ($request->hasFile('QR_Scan') && $request->hasFile('BankLogo')) {
                // Handle file upload for QR_Scan
                $qrScanFile = $request->file('QR_Scan');
                $qrScanPath = $qrScanFile->store('payment_types', 'public');

                // Handle file upload for BankLogo
                $bankLogoFile = $request->file('BankLogo');
                $bankLogoPath = $bankLogoFile->store('payment_types', 'public');

                // Store payment type in the database
                $paymentType = Payment_Types::create([
                    'PaymentTypeName' => $validate['PaymentTypeName'],
                    'AccountName'     => $validate['AccountName'],
                    'AccountNumber'   => $validate['AccountNumber'],
                    'BankName'        => $validate['BankName'],
                    'QR_Scan'         => $qrScanPath,
                    'BankLogo'        => $bankLogoPath,
                ]);

                return response()->json([
                    'status'  => 200,
                    'message' => 'Payment type created successfully',
                    'data'    => $paymentType,
                ]);
            } else {
                return response()->json([
                    'status'  => 400,
                    'message' => 'File upload failed: missing QR scan or bank logo file.',
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 500,
                'message' => 'An error occurred while saving the payment type',
                'error'   => $e->getMessage(),
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
            $paymentType = Payment_Types::findOrFail($id);

            return response()->json([
                'status'  => 200,
                'message' => 'Payment type retrieved successfully',
                'data'    => $paymentType,
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
    public function edit(Payment_Types $payment_Types)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        ob_clean();
        $user = Auth::user();

        // Check if the authenticated user has the required roles or permissions
        if (! $user || ! $user->hasAnyRole(['manager', 'librarian']) || ! $user->can('manage payment_types')) {
            return response()->json(['error' => 'Only managers or librarians can update payment types.'], 403);
        }

        try {
            // Validate the request; images are optional during update.
            $validatedData = $request->validate([
                'PaymentTypeName' => 'required|string|max:255',
                'AccountName'     => 'required|string|max:255',
                'AccountNumber'   => 'required|string|max:255',
                'BankName'        => 'required|string|max:255',
            ]);

            // Check if a payment type with the same AccountNumber and BankName exists (excluding current record)
            $exists = Payment_Types::where('AccountNumber', $validatedData['AccountNumber'])
                ->where('BankName', $validatedData['BankName'])
                ->where('id', '!=', $id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'status'  => 500,
                    'message' => 'The bank account number and bank name combination already exists.',
                ]);
            }

            // Retrieve the existing payment type record
            $payment_Type = Payment_Types::findOrFail($id);

            // Update file fields if new files are provided
            if ($request->hasFile('QR_Scan')) {
                $qrScanFile            = $request->file('QR_Scan');
                $qrScanPath            = $qrScanFile->store('payment_types', 'public');
                $payment_Type->QR_Scan = $qrScanPath;
            }

            if ($request->hasFile('BankLogo')) {
                $bankLogoFile           = $request->file('BankLogo');
                $bankLogoPath           = $bankLogoFile->store('payment_types', 'public');
                $payment_Type->BankLogo = $bankLogoPath;
            }

            // Update the other fields from validated data
            $payment_Type->PaymentTypeName = $validatedData['PaymentTypeName'];
            $payment_Type->AccountName     = $validatedData['AccountName'];
            $payment_Type->AccountNumber   = $validatedData['AccountNumber'];
            $payment_Type->BankName        = $validatedData['BankName'];

            // Save the updated model
            $payment_Type->save();

            return response()->json([
                'status'  => 200,
                'message' => 'Payment type updated successfully',
                'data'    => $payment_Type,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 500,
                'message' => 'An error occurred while updating the payment type',
                'error'   => $e->getMessage(),
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = Auth::user();

        // Check if the authenticated user has the required roles or permissions
        if (! $user || ! $user->hasRole(['manager', 'librarian']) || ! $user->can('manage payment_types')) {
            return response()->json(['error' => 'Only managers or librarians can delete payment types.'], 403);
        }

        try {
            // Retrieve the payment type record by ID; if not found, findOrFail will throw an exception.
            $paymentType = Payment_Types::findOrFail($id);

            // Delete the payment type record from the database
            $paymentType->delete();

            return response()->json([
                'status'  => 200,
                'message' => 'Payment type deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 500,
                'message' => 'An error occurred while deleting the payment type',
                'error'   => $e->getMessage(),
            ]);
        }
    }

}
