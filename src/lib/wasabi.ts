// Simple Wasabi upload using FormData (no AWS SDK)
export const uploadToWasabi = async (file: File, path: string): Promise<string> => {
  try {
    console.log('Starting Wasabi upload:', { path, fileSize: file.size, fileType: file.type });
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('key', path);
    formData.append('Content-Type', file.type);
    
    const wasabiEndpoint = `https://s3.${process.env.NEXT_PUBLIC_WASABI_REGION}.wasabisys.com/${process.env.NEXT_PUBLIC_WASABI_BUCKET}`;
    
    const uploadRes = await fetch(wasabiEndpoint, {
      method: 'POST',
      body: formData
    });

    if (!uploadRes.ok) {
      throw new Error(`Upload failed: ${uploadRes.statusText}`);
    }

    const publicUrl = `${wasabiEndpoint}/${path}`;
    console.log('Wasabi upload successful, public URL:', publicUrl);
    
    return publicUrl;
  } catch (error: any) {
    console.error('Wasabi upload failed:', error);
    throw new Error(`Wasabi upload failed: ${error.message || 'Unknown error'}`);
  }
};

export const deleteFromWasabi = async (path: string): Promise<void> => {
  console.log('Delete not implemented yet for:', path);
};