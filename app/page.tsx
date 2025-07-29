import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.description}>
          <h1>Kinta SME API Server</h1>
          <p>This is an API-only Next.js application.</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>Available Endpoints</h2>
            <ul>
              <li><code>/api/hello</code> - Sample API endpoint (GET/POST)</li>
              <li><code>/api/health</code> - Health check endpoint (GET)</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h2>CORS Enabled For</h2>
            <ul>
              <li>https://www.kinta-sme.com</li>
              <li>https://www.kinta-sme-server.vercel.app</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
