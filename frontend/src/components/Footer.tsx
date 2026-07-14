export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h5 className="mb-3">E-Commerce</h5>
            <p className="text-white-50 small">
              A full-stack e-commerce platform built for the MCA final project.
            </p>
          </div>
          <div className="col-md-4">
            <h6 className="mb-3">Tech Stack</h6>
            <div className="d-flex flex-wrap gap-2">
              {["Next.js", "NestJS", "Prisma", "PostgreSQL", "TypeScript", "Bootstrap", "JWT", "Docker"].map(
                (t) => (
                  <span key={t} className="badge bg-secondary">
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
                className="text-white-50 text-decoration-none"
              >
                <i className="bi bi-github me-1" />
                GitHub
              </a>
            </p>
            <p className="text-white-50 small mb-0">
              Made by Anik Chatterjee
            </p>
          </div>
        </div>
        <hr className="border-secondary" />
        <p className="text-center text-white-50 small mb-0">
          &copy; {year} E-Commerce. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
