
/**
 * @swagger
 * /api/v1/users/health:
 *   get:
 *     summary: Check the health of endpoints
 *     description: Returns ok status
 *     tags: 
 *       - Users
 *     responses:
 *       200:
 *         description: Ok!
 *       400:
 *         description: Not found
 */
export async function GET() {
  return Response.json({ status: "ok" })
}