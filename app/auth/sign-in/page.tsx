import { auth, isGitHubAuthEnabled, isWorkspaceAllowed, signIn } from "@/auth";
import BrandLogo from "@/components/BrandLogo";
import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "./sign-in.module.css";

const defaultDestination = "/workspace/financial-intelligence";

function safeDestination(callbackUrl?: string) {
  return callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")
    ? callbackUrl
    : defaultDestination;
}

function GoogleIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.91h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.4Z"/><path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.37l-3.24-2.54c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.62A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.39 13.92A6 6 0 0 1 6.07 12c0-.67.12-1.32.32-1.92V7.46H3.04A10 10 0 0 0 2 12c0 1.61.38 3.14 1.04 4.54l3.35-2.62Z"/><path fill="#EA4335" d="M12 5.95c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.96 5.46l3.35 2.62C7.18 7.71 9.39 5.95 12 5.95Z"/></svg>;
}

function GitHubIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.69c-2.78.61-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0 1 12 7.01c.85 0 1.71.12 2.51.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>;
}

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string; error?: string }> }) {
  const session = await auth();
  const params = await searchParams;
  const destination = safeDestination(params.callbackUrl);
  if (session?.user?.email && isWorkspaceAllowed(session.user.email)) redirect(destination);

  return <main className={styles.page}>
    <header className={styles.header}>
      <Link href="/" aria-label="Entimema – home"><BrandLogo /></Link>
      <span>Private beta</span>
    </header>
    <section className={styles.stage}>
      <div className={styles.statement}>
        <p>ENTIMEMA FINANCIAL INTELLIGENCE</p>
        <h1>Turn financial evidence into decisions <em>you can defend.</em></h1>
        <span>Controlled workflows. Traceable outputs. Human judgement where it matters.</span>
      </div>
      <div className={styles.authField}>
        <div className={styles.dotField} aria-hidden="true" />
        <section className={styles.panel} aria-labelledby="sign-in-title">
          <div className={styles.panelHeading}>
            <p className={styles.kicker}>Entimema workspace</p>
            <h2 id="sign-in-title">Sign in to your account</h2>
            <p className={styles.copy}>Continue with an invited account to access product documentation, integrations and controlled workflows.</p>
          </div>
          {params.error && <p className={styles.error}>This identity is not authorized for the private beta.</p>}
          <div className={styles.providers}>
            <form action={async () => { "use server"; await signIn("google", { redirectTo: destination }); }}>
              <button type="submit"><GoogleIcon /><span>Continue with Google</span><i aria-hidden="true">→</i></button>
            </form>
            {isGitHubAuthEnabled && <form action={async () => { "use server"; await signIn("github", { redirectTo: destination }); }}>
              <button type="submit"><GitHubIcon /><span>Continue with GitHub</span><i aria-hidden="true">→</i></button>
            </form>}
          </div>
          <div className={styles.assurance}><span aria-hidden="true" />Authorized identities only</div>
        </section>
      </div>
    </section>
    <footer className={styles.footer}>
      <span>© {new Date().getFullYear()} Entimema</span>
      <Link href="/privacy">Privacy</Link>
    </footer>
  </main>;
}
