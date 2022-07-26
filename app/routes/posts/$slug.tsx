import type { Post } from '@prisma/client';
import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { marked } from 'marked';
import invariant from 'tiny-invariant';

import { getPost } from '~/models/post.server';

type LoaderData = { post: Post; html: string };

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, 'slug required');
  const post = await getPost(params.slug);
  invariant(post, `post ${params.slug} not found`);

  const html = marked(post.markdown);
  return json<LoaderData>({ post, html });
};

export const meta: MetaFunction = ({ data }) => {
  const { post } = data as LoaderData;
  return {
    title: post.title,
  };
};

export default function PostSlug() {
  const { post, html } = useLoaderData<LoaderData>();
  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}