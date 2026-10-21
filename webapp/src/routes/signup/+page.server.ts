import { fail, redirect, Cookies } from "@sveltejs/kit";
import { supabase } from "#lib/supabaseClient.ts"
import type { Actions } from "./$types";

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const username = formData.get("username")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const confirm = formData.get("confirmPassword") === "on";

    if (password !== confirm) {
      return fail(400, { email, error: "The passwords don't match" });
    }

    const user = await supabase.auth.signUp({email, password});
    cookies.set("logged_user", user);

    redirect(303, "/");
  },
};