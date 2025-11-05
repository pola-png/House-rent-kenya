export const uploadToWasabi = async (file: File, path: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      console.log('Starting Wasabi upload:', { path, fileSize: file.size, fileType: file.type });
      
      const bucket = process.env.NEXT_PUBLIC_WASABI_BUCKET;
      const region = process.env.NEXT_PUBLIC_WASABI_REGION;
      const endpoint = `https://${bucket}.s3.${region}.wasabisys.com/${path}`;
      
      const xhr = new XMLHttpRequest();
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          const publicUrl = `https://${bucket}.s3.${region}.wasabisys.com/${path}`;
          console.log('Wasabi upload successful:', publicUrl);
          resolve(publicUrl);
        } else {
          reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
        }
      };
      
      xhr.onerror = function() {
        reject(new Error('Network error during upload'));
      };
      
      xhr.open('PUT', endpoint);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.setRequestHeader('x-amz-acl', 'public-read');
      xhr.send(file);
      
    } catch (error: any) {
      console.error('Wasabi upload failed:', error);
      reject(new Error(`Wasabi upload failed: ${error.message}`));
    }
  });
};

export const deleteFromWasabi = async (path: string): Promise<void> => {
  console.log('Delete not implemented yet for:', path);
};