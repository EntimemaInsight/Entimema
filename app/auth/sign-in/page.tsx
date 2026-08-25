import { auth, isWorkspaceAllowed, signIn } from "@/auth";
import { redirect } from "next/navigation";
import styles from "./sign-in.module.css";

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string; error?: string }> }) {
  const session = await auth();
  const params = await searchParams;
  if (session?.user?.email && isWorkspaceAllowed(session.user.email)) redirect(params.callbackUrl ?? "/workspace/agents/document-classifier");

  return <main className={styles.page}>
    <section className={styles.panel} aria-labelledby="sign-in-title">
      <div className={styles.wordmark}>ENTIMEMA</div>
      <p className={styles.kicker}>Private workspace</p>
      <h1 id="sign-in-title">Sign in to continue</h1>
      <p className={styles.copy}>Access is limited to invited private-beta participants.</p>
      {params.error && <p className={styles.error}>This identity is not authorized for the private beta.</p>}
      <form action={async () => { "use server"; await signIn("google", { redirectTo: params.callbackUrl ?? "/workspace/agents/document-classifier" }); }}>
        <button type="submit">Continue with Google <span aria-hidden="true">→</span></button>
      </form>
      <small>Authorized identities only</small>
    </section>
  </main>;
}
