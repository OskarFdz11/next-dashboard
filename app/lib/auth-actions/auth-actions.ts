"use server";

import { z } from "zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { signOut } from "@/auth";
import { redirect } from "next/navigation";

const CredentialsSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  redirectTo: z.string().default("/dashboard"),
});

export const authenticate = async (
  _prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> => {
  const parsed = CredentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    redirectTo: formData.get("redirectTo") ?? "/dashboard",
  });

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Datos inválidos";
  }

  const { email, password, redirectTo } = parsed.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });
    return undefined;
  } catch (e) {
    if (e instanceof AuthError) {
      switch (e.type) {
        case "CredentialsSignin":
          return "Usuario o contraseña incorrectos";
        case "CallbackRouteError":
        case "OAuthCallbackError":
          return "Error de autenticación";
        default:
          return "No se pudo iniciar sesión";
      }
    }
    throw e;
  }
};

export const logout = async (): Promise<
  { ok: true; redirectTo: string } | { ok: false; error: string }
> => {
  try {
    await signOut({ redirect: false });
    return { ok: true, redirectTo: "/login" };
  } catch (error) {
    console.error("Error during logout:", error);
    return { ok: false, error: "Logout failed" };
  }
};
