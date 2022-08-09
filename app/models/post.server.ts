import { db } from '~/utils/db.server';

export async function getPosts() {
  return db.post.findMany();
}

export async function getPost(slug: string) {
  return db.post.findUnique({ where: { slug } });
}
