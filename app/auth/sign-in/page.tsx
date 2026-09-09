import { auth, isWorkspaceAllowed, signIn } from "@/auth";
import { redirect } from "next/navigation";
import styles from "./sign-in.module.css";

const defaultDestination = "/workspace/financial-intelligence";

function safeDestination(callbackUrl?: string) {
  return callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")
    ? callbackUrl
    : defaultDestination;
}

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string; error?: string }> }) {
  const session = await auth();
  const params = await searchParams;
  const destination = safeDestination(params.callbackUrl);
  if (session?.user?.email && isWorkspaceAllowed(session.user.email)) redirect(destination);

  return <main className={styles.page}>
    <section className={styles.panel} aria-labelledby="sign-in-title">
      <div className={styles.wordmark}>ENTIMEMA</div>
      <p className={styles.kicker}>Entimema workspace</p>
      <h1 id="sign-in-title">Sign in to continue</h1>
      <p className={styles.copy}>Use your invited Google account to access Entimema’s product documentation, integrations and controlled workflows.</p>
      {params.error && <p className={styles.error}>This identity is not authorized for the private beta.</p>}
      <form action={async () => { "use server"; await signIn("google", { redirectTo: destination }); }}>
        <button type="submit">Continue with Google <span aria-hidden="true">→</span></button>
      </form>
      <small>Private beta · authorized identities only</small>
    </section>
  </main>;
}
