// Temporary fallback to a simple mock upload until Wasabi is properly configured
export const uploadToWasabi = async (file: File, path: string): Promise<string> => {
  try {
    console.log('Mock upload:', { path, fileSize: file.size, fileType: file.type });
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a mock URL for now
    const mockUrl = `https://mock-storage.example.com/${path}`;
    console.log('Mock upload successful:', mockUrl);
    
    return mockUrl;
  } catch (error: any) {
    console.error('Mock upload failed:', error);
    throw new Error(`Upload failed: ${error.message || 'Unknown error'}`);
  }
};

export const deleteFromWasabi = async (path: string): Promise<void> => {
  console.log('Delete not implemented yet for:', path);
};