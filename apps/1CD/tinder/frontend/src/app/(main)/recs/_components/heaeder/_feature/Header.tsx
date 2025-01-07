"use server";
import { cookies } from "next/headers";

export async function Logout() {
  cookies().delete("authToken");
}
