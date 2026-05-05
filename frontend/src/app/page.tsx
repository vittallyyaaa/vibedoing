import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <header className="header">
        <div className="container headerInner">
          <Link href="/" className="logo">
            Vibe<span>Doing</span>
          </Link>

          <nav className="nav">
            <a href="#company">Company</a>
            <a href="#features">Features</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="controls">
            <Link href="/login" className="loginButton">
              Login
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container heroGrid">
            <div>
              <div className="badge">Workflow Intelligence Platform</div>

              <h1>See work clearly before it becomes a risk.</h1>

              <p>
                VibeDoing helps leadership understand workload distribution,
                execution risks, and where team time is really going.
              </p>

              <div className="heroActions">
                <Link href="/login" className="primaryButton">
                  Open Dashboard
                </Link>
                <a href="#company" className="secondaryButton">
                  Learn More
                </a>
              </div>
            </div>

            <div className="heroCard">
              <div className="orbit" />

              <div className="metricCard">
                <strong>87%</strong>
                <span>Tasks running on schedule</span>
                <div className="progress">
                  <div style={{ width: "87%" }} />
                </div>
              </div>

              <div className="metricCard">
                <strong>12</strong>
                <span>Potential execution risks detected</span>
                <div className="progress">
                  <div style={{ width: "42%" }} />
                </div>
              </div>

              <div className="metricCard">
                <strong>4.8h</strong>
                <span>Average daily work logged per employee</span>
                <div className="progress">
                  <div style={{ width: "68%" }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="company" className="section">
          <div className="container">
            <h2 className="sectionTitle">Built for growing teams</h2>
            <p className="sectionText">
              VibeDoing is a modern workflow intelligence platform for companies
              that need clear visibility into how work is distributed and
              executed. It helps CEOs, HR managers, and team leads move from
              scattered updates to centralized, data-driven decisions.
            </p>
          </div>
        </section>

        <section id="features" className="section">
          <div className="container">
            <h2 className="sectionTitle">What the platform tracks</h2>

            <div className="cards">
              <div className="infoCard">
                <h3>Task execution</h3>
                <p>
                  Workers log tasks, update statuses, and track estimated versus
                  actual time.
                </p>
              </div>

              <div className="infoCard">
                <h3>Workload balance</h3>
                <p>
                  Leadership can see who may be overloaded and where work is
                  concentrated.
                </p>
              </div>

              <div className="infoCard">
                <h3>AI insights</h3>
                <p>
                  Mocked AI analysis highlights risks, bottlenecks, and tasks
                  that exceed expected time.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="container">
            <h2 className="sectionTitle">Contact us</h2>

            <form className="contactForm">
              <input className="input" placeholder="Your name" />
              <input className="input" placeholder="Email" />
              <textarea className="input" placeholder="Message" rows={5} />

              <button className="primaryButton" type="button">
                Send message
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          © 2026 VibeDoing. Internal analytics made simple.
        </div>
      </footer>
    </>
  );
}
