export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h5 className="mb-3">E-Commerce</h5>
            <p className="small mb-0" style={{ opacity: 0.65 }}>
              A full-stack e-commerce platform built for the MCA final project.
            </p>
          </div>
          <div className="col-md-4">
            <h6 className="mb-3">Tech Stack</h6>
            <div className="d-flex flex-wrap gap-2">
              {["Next.js", "NestJS", "Prisma", "PostgreSQL", "TypeScript", "Bootstrap", "JWT", "Docker"].map(
                (t) => (
                  <span
                    key={t}
                    className="badge"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.8)",
                      fontWeight: 500,
                    }}
                  >
                    {t}
                  </span>
                ),
              )}
            </div>
          </div>
          <div className="col-md-4 text-md-end">
            <p className="mb-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none"
              >
                <i className="bi bi-github me-1" />
                GitHub
              </a>
            </p>
            <p className="small mb-0" style={{ opacity: 0.5 }}>
              Made by Anik Chatterjee
            </p>
          </div>
        </div>
        <hr className="border-secondary opacity-25 my-3" />
        <p className="text-center small mb-0" style={{ opacity: 0.5 }}>
          &copy; {year} E-Commerce. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
