import { Link } from '@remix-run/react';

export default function BlogIndexRoute() {
  return (
    <div>
      Here's some interesting blogs
      <div>
        <ul>
          <li>
            <Link to="goodblog">A good blog</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
