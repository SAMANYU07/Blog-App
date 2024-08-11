import  { Client, Account, ID } from "appwrite";

export class AuthService
{
  client = new Client();
  account;

  constructor()
  {
    this.client
    .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
    this.account = new Account(this.client);
  }

  async accountCreation(payload) {
    try {
      const userAccount = await this.account.create(ID.unique(), payload.email, payload.pass, payload.name);
    } catch (error) {
      console.log("Account creation error", error);
      return -1;
    }
  }

  async loginAccount(payload)
  {
    try {
      return await this.account.createEmailPasswordSession(payload.email, payload.pass);
    } catch (error) {
      console.log("Account login error", error);
      return -1;
    }
  }

  async logoutAccount(email, pass)
  {
    try {
      return await this.account.deleteSessions();
    } catch (error) {
      console.log("Account logout error", error);
    }
  }

  async activeUserSession()
  {
    try {
      return await this.account.get();
    } catch (error) {
      return null;
    }
  }

}

const authService = new AuthService();
export default authService;