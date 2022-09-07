import type { LoaderArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { marked } from 'marked';
import invariant from 'tiny-invariant';

import { getPost } from '~/models/post.server';

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.slug, 'slug required');
  const post = await getPost(params.slug);
  invariant(post, `post ${params.slug} not found`);

  const html = marked(post.markdown);
  return json({ post, html });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const { post } = data;
  return {
    title: post.title,
  };
};

export default function PostSlug() {
  const { post, html } = useLoaderData<typeof loader>();
  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
