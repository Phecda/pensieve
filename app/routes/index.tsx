import { Link } from '@remix-run/react';

export default function Index() {
  return (
    <div className="max-w-screen-2xl mx-auto">
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <Link to="/blog">Read blogs</Link>
        </li>
      </ul>
    </div>
  );
}
