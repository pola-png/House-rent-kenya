export const uploadToWasabi = async (file: File, path: string): Promise<string> => {
  try {
    console.log('Starting Wasabi upload:', { path, fileSize: file.size, fileType: file.type });
    
    // Get signed URL from API
    const res = await fetch(`/api/sign-upload?fileName=${path}&fileType=${file.type}`);
    if (!res.ok) {
      throw new Error(`Failed to get signed URL: ${res.statusText}`);
    }
    
    const { uploadURL } = await res.json();
    if (!uploadURL) {
      throw new Error('No upload URL received');
    }

    // Upload directly to Wasabi using PUT
    const uploadRes = await fetch(uploadURL, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file
    });

    if (!uploadRes.ok) {
      throw new Error(`Upload failed: ${uploadRes.statusText}`);
    }

    const publicUrl = uploadURL.split('?')[0]; // Remove query params
    console.log('Wasabi upload successful, public URL:', publicUrl);
    
    return publicUrl;
  } catch (error: any) {
    console.error('Wasabi upload failed:', error);
    throw new Error(`Wasabi upload failed: ${error.message || 'Unknown error'}`);
  }
};

export const deleteFromWasabi = async (path: string): Promise<void> => {
  // Implement delete if needed
  console.log('Delete not implemented yet for:', path);
};