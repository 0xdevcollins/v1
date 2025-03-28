import { handleApiRequest } from '@/lib/api-utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  return handleApiRequest(request, '/pricing', 'GET');
}
