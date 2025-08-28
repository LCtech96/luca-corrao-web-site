import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from "convex/browser";
import { api } from '@/convex/_generated/api';

// Initialize Convex client for server-side operations
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string || 'general';
    const description = formData.get('description') as string || '';
    const altText = formData.get('altText') as string || '';
    const uploadedBy = formData.get('uploadedBy') as string || '';
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Generate upload URL from Convex
    const uploadUrl = await convex.mutation(api.files.generateUploadUrl);

    // Upload file to Convex storage
    const result = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': file.type },
      body: file,
    });

    if (!result.ok) {
      throw new Error('Failed to upload file to storage');
    }

    const { storageId } = await result.json();

    // Save file metadata in database
    const fileId = await convex.mutation(api.files.uploadFile, {
      storageId,
      name: file.name,
      type: file.type,
      size: file.size,
      category,
      description: description || undefined,
      altText: altText || undefined,
      uploadedBy: uploadedBy || undefined,
    });

    // Get the file URL
    const fileUrl = await convex.query(api.files.getFileUrl, { storageId });

    return NextResponse.json({
      success: true,
      fileId,
      storageId,
      url: fileUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error during upload' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const uploadedBy = searchParams.get('uploadedBy') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    // Fetch files from Convex
    const files = await convex.query(api.files.getFiles, {
      category,
      uploadedBy,
      limit,
    });

    return NextResponse.json({
      success: true,
      files,
    });

  } catch (error) {
    console.error('Fetch files error:', error);
    return NextResponse.json(
      { error: 'Internal server error fetching files' },
      { status: 500 }
    );
  }
}
