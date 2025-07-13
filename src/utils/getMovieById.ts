import prisma from './prisma';

export async function getMovieById(id: string, withFile?: boolean) {
  try {
    return await prisma.movie.findUnique({ where: { id }, omit: { file: !withFile } });
  } catch (error) {
    console.log(error);
    return null;
  }
}
