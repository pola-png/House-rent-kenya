export const uploadToWasabi = async (file: File, path: string): Promise<string> => {
  try {
    console.log('Starting Wasabi upload:', { path, fileSize: file.size, fileType: file.type });
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }
    
    const { url } = await response.json();
    console.log('Wasabi upload successful:', url);
    
    return url;
  } catch (error: any) {
    console.error('Wasabi upload failed:', error);
    throw new Error(`Wasabi upload failed: ${error.message}`);
  }
};

export const deleteFromWasabi = async (path: string): Promise<void> => {
  console.log('Delete not implemented yet for:', path);
};