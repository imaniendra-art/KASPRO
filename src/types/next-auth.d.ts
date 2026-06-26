import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    namaLengkap: string;
    role: string;
    divisi: string;
    unitName?: string;
  }

  interface Session {
    user: User;
  }
}
