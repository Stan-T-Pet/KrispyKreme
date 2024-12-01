import Link from 'next/link';

export default function HomePage() {
  const pages = [
    { name: 'Manager Dashboard', path: '/manager' },
    { name: 'Customer Page', path: '/customer' },
    { name: 'Register', path: '/register' },
    { name: 'Login', path: '/login' },
    { name: 'View Cart', path: '/view_cart' },
    { name: 'Checkout', path: '/checkout' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h1>Testing Navigation</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
        {pages.map((page) => (
          <Link key={page.path} href={page.path}>
            <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
              {page.name}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}