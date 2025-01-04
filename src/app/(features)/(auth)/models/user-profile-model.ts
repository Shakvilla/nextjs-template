import prisma from '@/(shared)/lib/prisma';
import { UserProfile } from '@prisma/client';

export async function retrieveUserProfileFromDatabaseByEmail(
  email: UserProfile['email'],
) {
  return await prisma.userProfile.findUnique({ where: { email } });
}
