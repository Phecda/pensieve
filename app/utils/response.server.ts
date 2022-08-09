import { json } from '@remix-run/node';

export function badRequest<Data>(data: Data) {
  return json(data, { status: 400 });
}
