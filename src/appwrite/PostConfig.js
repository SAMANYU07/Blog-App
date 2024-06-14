import { Account, Client, Databases, ID, Permission, Role, Storage } from "appwrite";

export class BlogService {
  client = new Client();
  database;
  bucket;

  constructor() {
    this.client
      .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
      .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
    this.database = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async getAllBlogs() {
    try {
      return await this.database.listDocuments(import.meta.env.VITE_APPWRITE_DATABASE_ID, import.meta.env.VITE_APPWRITE_COLLECTION_ID);
    } catch (error) {
      console.log("Fetching Blogs Error: ", error);
    }
  }
  async createBlog(blog) {
    try {
      return await this.database.createDocument(import.meta.env.VITE_APPWRITE_DATABASE_ID, import.meta.env.VITE_APPWRITE_COLLECTION_ID, ID.unique(), blog);
    } catch (error) {
      console.log("Blog Creation Error: ", error);
    }
  }
  async getBlog(blogid) {
    try {
      return await this.database.getDocument(import.meta.env.VITE_APPWRITE_DATABASE_ID, import.meta.env.VITE_APPWRITE_COLLECTION_ID, blogid);
    } catch (error) {
      console.log("Blog Fetching Error: ", error);
    }
  }
  async updateBlog(blogid, ublog) {
    try {
      return await this.database.updateDocument(import.meta.env.VITE_APPWRITE_DATABASE_ID, import.meta.env.VITE_APPWRITE_COLLECTION_ID, blogid, ublog);
    } catch (error) {
      console.log("Blog Updating Error: ", error);
    }
  }
  async deleteBlog(docId) {
    try {
      return await this.database.deleteDocument(import.meta.env.VITE_APPWRITE_DATABASE_ID, import.meta.env.VITE_APPWRITE_COLLECTION_ID, docId);
    } catch (error) {
      console.log("Blog Deletion Error: ", error);
    }
  }
  async addComment(blogid, cArray) {
    try {
      return await this.database.updateDocument(import.meta.env.VITE_APPWRITE_DATABASE_ID, import.meta.env.VITE_APPWRITE_COLLECTION_ID, blogid, {comments: cArray});
    } catch (error) {
      console.log("Comment Posting Error: ", error);
    }
  }
  async uploadFile({ file, fileid, userid }) {
    try {
      return await this.bucket.createFile(import.meta.env.VITE_APPWRITE_BUCKET_ID, fileid, file,
        [
          Permission.read(Role.any()),
          Permission.update(Role.user(userid)),
          Permission.delete(Role.user(userid)),
        ]);
    } catch (error) {
      console.log("Uploading file error: ", error);
    }
  }
  async deleteFile(image_id) {
    try {
      return await this.bucket.deleteFile(import.meta.env.VITE_APPWRITE_BUCKET_ID, image_id);
    } catch (error) {
      console.log("File Deletion Error: ", error);
    }
  }
  async getFilePreview(fileid) {
    try {
      return await this.bucket.getFilePreview(import.meta.env.VITE_APPWRITE_BUCKET_ID, fileid, 340, 230);
    } catch (error) {
      console.log("Image Fetching Error: ", error);
    }
  }
  async getFile(fileid) {
    try {
      return await this.bucket.getFileView(import.meta.env.VITE_APPWRITE_BUCKET_ID, fileid);
    } catch (error) {
      console.log("File Fetching Error: ", error);
    }
  }
}

const blogService = new BlogService();
export default blogService;