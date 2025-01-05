import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     description: Returns Hello World!
 *     responses:
 *       200:
 *         description: Hello World!
 */
export const POST = async () => {
  return new Response('Hello World!', {
    status: 200,
  });
};


