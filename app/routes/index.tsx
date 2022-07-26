import { Link } from '@remix-run/react';

export default function Index() {
  return (
    <div className="max-w-screen-2xl mx-auto">
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <Link to="/posts" className="text-blue-600 underline">
            Read posts
          </Link>
        </li>
      </ul>
    </div>
  );
}
