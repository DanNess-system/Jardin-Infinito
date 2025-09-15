/// <reference types="astro/client" />

interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

declare namespace App {
  interface Locals {
    user?: SessionUser;
  }
}
