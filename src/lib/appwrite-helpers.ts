import { databases, storage, DATABASE_ID, COLLECTIONS, STORAGE_BUCKET_ID, Query, ID } from './appwrite';

// Properties helpers
export const propertiesHelpers = {
  async getAll() {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.PROPERTIES);
    return response.documents;
  },

  async getById(id: string) {
    return await databases.getDocument(DATABASE_ID, COLLECTIONS.PROPERTIES, id);
  },

  async getByLandlord(landlordId: string) {
    const response = await databases.listDocuments(
      DATABASE_ID, 
      COLLECTIONS.PROPERTIES,
      [Query.equal('landlord_id', landlordId)]
    );
    return response.documents;
  },

  async create(data: any) {
    return await databases.createDocument(DATABASE_ID, COLLECTIONS.PROPERTIES, ID.unique(), data);
  },

  async update(id: string, data: any) {
    return await databases.updateDocument(DATABASE_ID, COLLECTIONS.PROPERTIES, id, data);
  },

  async delete(id: string) {
    return await databases.deleteDocument(DATABASE_ID, COLLECTIONS.PROPERTIES, id);
  }
};

// Profiles helpers
export const profilesHelpers = {
  async getById(id: string) {
    return await databases.getDocument(DATABASE_ID, COLLECTIONS.PROFILES, id);
  },

  async getByEmail(email: string) {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.PROFILES,
      [Query.equal('email', email)]
    );
    return response.documents[0] || null;
  },

  async create(id: string, data: any) {
    return await databases.createDocument(DATABASE_ID, COLLECTIONS.PROFILES, id, data);
  },

  async update(id: string, data: any) {
    return await databases.updateDocument(DATABASE_ID, COLLECTIONS.PROFILES, id, data);
  }
};

// Payment Requests helpers
export const paymentRequestsHelpers = {
  async getAll() {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.PAYMENT_REQUESTS);
    return response.documents;
  },

  async getByUser(userId: string) {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.PAYMENT_REQUESTS,
      [Query.equal('userId', userId)]
    );
    return response.documents;
  },

  async create(data: any) {
    return await databases.createDocument(DATABASE_ID, COLLECTIONS.PAYMENT_REQUESTS, ID.unique(), data);
  },

  async update(id: string, data: any) {
    return await databases.updateDocument(DATABASE_ID, COLLECTIONS.PAYMENT_REQUESTS, id, data);
  }
};

// Storage helpers
export const storageHelpers = {
  async uploadFile(file: File, fileName?: string) {
    const fileId = fileName || ID.unique();
    return await storage.createFile(STORAGE_BUCKET_ID, fileId, file);
  },

  async getFileUrl(fileId: string) {
    return storage.getFileView(STORAGE_BUCKET_ID, fileId);
  },

  async deleteFile(fileId: string) {
    return await storage.deleteFile(STORAGE_BUCKET_ID, fileId);
  }
};