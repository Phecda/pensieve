import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

type LoaderData = {
  blogId: string;
};

export const loader: LoaderFunction = async ({ params }) => {
  const data: LoaderData = { blogId: params.blogId ?? 'notfound' };
  return json(data);
};

export default function BlogPage() {
  const data = useLoaderData<LoaderData>();
  return <div>{data.blogId}</div>;
}
