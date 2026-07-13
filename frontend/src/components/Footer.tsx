export default function Footer() {
  return (
    <footer className="bg-dark text-light py-3 mt-auto">
      <div className="container text-center">
        <span>&copy; {new Date().getFullYear()} E-Commerce</span>
      </div>
    </footer>
  );
}
