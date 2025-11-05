export const uploadToWasabi = async (file: File, path: string): Promise<string> => {
  try {
    console.log('Starting Wasabi upload:', { path, fileSize: file.size, fileType: file.type });
    
    // Get signed URL from API
    const res = await fetch(`/api/sign-upload?fileName=${path}&fileType=${file.type}`);
    const { uploadURL } = await res.json();

    // Upload directly to Wasabi
    await fetch(uploadURL, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file
    });

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