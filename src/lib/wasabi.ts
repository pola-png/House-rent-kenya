export const uploadToWasabi = async (file: File, path: string): Promise<string> => {
  try {
    console.log('Starting Wasabi upload:', { path, fileSize: file.size, fileType: file.type });
    
    const bucket = process.env.NEXT_PUBLIC_WASABI_BUCKET;
    const region = process.env.NEXT_PUBLIC_WASABI_REGION;
    const endpoint = `https://${bucket}.s3.${region}.wasabisys.com/${path}`;
    
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
        'x-amz-acl': 'public-read'
      },
      body: file
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const publicUrl = `https://${bucket}.s3.${region}.wasabisys.com/${path}`;
    console.log('Wasabi upload successful:', publicUrl);
    
    return publicUrl;
  } catch (error: any) {
    console.error('Wasabi upload failed:', error);
    throw new Error(`Wasabi upload failed: ${error.message}`);
  }
};

export const deleteFromWasabi = async (path: string): Promise<void> => {
  console.log('Delete not implemented yet for:', path);
};