import { NextRequest, NextResponse } from 'next/server';

// ============================================
// STORAGE LAYER
// ============================================
// In-memory storage for demo/development
// TODO: Replace with database in production (Supabase, PostgreSQL, MongoDB)
const piiStore = new Map<string, any>();

// ============================================
// VALIDATION
// ============================================
function validateWalletAddress(address: string): boolean {
  // Basic validation - starts with 0x and has reasonable length
  return /^0x[a-fA-F0-9]{40}$/.test(address) || address.length > 10;
}

function validatePIIData(data: any): { valid: boolean; error?: string } {
  if (!data.fullName || typeof data.fullName !== 'string') {
    return { valid: false, error: 'Full name is required' };
  }
  
  if (!data.phone || typeof data.phone !== 'string') {
    return { valid: false, error: 'Phone number is required' };
  }
  
  if (!data.address || typeof data.address !== 'string') {
    return { valid: false, error: 'Address is required' };
  }

  // Check minimum lengths
  if (data.fullName.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }

  if (data.phone.length < 8) {
    return { valid: false, error: 'Phone number must be at least 8 characters' };
  }

  return { valid: true };
}

// ============================================
// POST - STORE PII
// ============================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { walletAddress, piiData } = body;

    // Validate wallet address
    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    if (!validateWalletAddress(walletAddress)) {
      return NextResponse.json(
        { success: false, error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    // Validate PII data
    if (!piiData) {
      return NextResponse.json(
        { success: false, error: 'PII data is required' },
        { status: 400 }
      );
    }

    const validation = validatePIIData(piiData);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Store data with metadata
    const storedData = {
      fullName: piiData.fullName.trim(),
      phone: piiData.phone.trim(),
      address: piiData.address.trim(),
      nationalId: piiData.nationalId?.trim() || '',
      // Metadata
      walletAddress,
      storedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    };

    piiStore.set(walletAddress, storedData);

    console.log(`✅ [PII STORE] Stored data for wallet: ${walletAddress.slice(0, 10)}...`);
    console.log(`   Total records: ${piiStore.size}`);

    return NextResponse.json({ 
      success: true,
      message: 'Data stored successfully',
      storedAt: storedData.storedAt
    });

  } catch (error) {
    console.error('❌ [PII STORE] Error storing data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error while storing data' 
      },
      { status: 500 }
    );
  }
}

// ============================================
// GET - RETRIEVE PII
// ============================================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get('wallet');

    // Validate wallet address
    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Wallet address parameter is required' },
        { status: 400 }
      );
    }

    if (!validateWalletAddress(walletAddress)) {
      return NextResponse.json(
        { success: false, error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    // Retrieve data
    const data = piiStore.get(walletAddress);

    if (!data) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No data found for this wallet address',
          data: null 
        },
        { status: 404 }
      );
    }

    console.log(`✅ [PII RETRIEVE] Retrieved data for wallet: ${walletAddress.slice(0, 10)}...`);

    return NextResponse.json({ 
      success: true,
      data 
    });

  } catch (error) {
    console.error('❌ [PII RETRIEVE] Error retrieving data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error while retrieving data',
        data: null 
      },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE - REMOVE PII (Optional - for GDPR compliance)
// ============================================
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get('wallet');

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Wallet address parameter is required' },
        { status: 400 }
      );
    }

    const existed = piiStore.has(walletAddress);
    
    if (existed) {
      piiStore.delete(walletAddress);
      console.log(`🗑️ [PII DELETE] Deleted data for wallet: ${walletAddress.slice(0, 10)}...`);
      
      return NextResponse.json({ 
        success: true,
        message: 'Data deleted successfully' 
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No data found for this wallet address' 
        },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('❌ [PII DELETE] Error deleting data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error while deleting data' 
      },
      { status: 500 }
    );
  }
}

// ============================================
// PUT - UPDATE PII (Optional)
// ============================================
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { walletAddress, piiData } = body;

    if (!walletAddress || !piiData) {
      return NextResponse.json(
        { success: false, error: 'Wallet address and PII data are required' },
        { status: 400 }
      );
    }

    // Check if data exists
    const existingData = piiStore.get(walletAddress);
    if (!existingData) {
      return NextResponse.json(
        { success: false, error: 'No existing data found to update' },
        { status: 404 }
      );
    }

    // Validate new data
    const validation = validatePIIData(piiData);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Update data
    const updatedData = {
      ...existingData,
      fullName: piiData.fullName.trim(),
      phone: piiData.phone.trim(),
      address: piiData.address.trim(),
      nationalId: piiData.nationalId?.trim() || '',
      updatedAt: new Date().toISOString(),
      version: existingData.version + 1,
    };

    piiStore.set(walletAddress, updatedData);

    console.log(`🔄 [PII UPDATE] Updated data for wallet: ${walletAddress.slice(0, 10)}...`);

    return NextResponse.json({ 
      success: true,
      message: 'Data updated successfully',
      updatedAt: updatedData.updatedAt
    });

  } catch (error) {
    console.error('❌ [PII UPDATE] Error updating data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error while updating data' 
      },
      { status: 500 }
    );
  }
}
