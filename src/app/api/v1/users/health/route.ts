/**
 * @swagger
 * /api/v1/users/health:
 *   get:
 *     description: Returns ok!
 *     responses:
 *       200:
 *         description: Check health status of users routes!
 */
export async function GET() {
  return Response.json({ status: "ok" })
}