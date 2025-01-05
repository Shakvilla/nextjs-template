import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Authenticate a user
 *     description: Returns Hello World!
 *     tags: 
 *       - Authentication
 *     responses:
 *       200:
 *         description: Hello World!
 */
export const POST = async () => {
  return new Response('Hello World!', {
    status: 200,
  });
};


