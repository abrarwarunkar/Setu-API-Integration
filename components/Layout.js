import { useRouter } from 'next/router';

export default function Layout({ children }) {
  const router = useRouter();

  const isActive = (path) => router.pathname === path;

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <a href="/" className="logo">
              Setu eSign
            </a>
            <nav className="nav">
              <a 
                href="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                Home
              </a>
              <a 
                href="/settings" 
                className={`nav-link ${isActive('/settings') ? 'active' : ''}`}
              >
                Settings
              </a>
              <a 
                href="/upload" 
                className={`nav-link ${isActive('/upload') ? 'active' : ''}`}
              >
                Upload
              </a>
              <a 
                href="/status" 
                className={`nav-link ${isActive('/status') ? 'active' : ''}`}
              >
                Status
              </a>
            </nav>
          </div>
        </div>
      </header>
      <main className="main">
        <div className="container">
          {children}
        </div>
      </main>
    </>
  );
}