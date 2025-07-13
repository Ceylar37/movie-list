import { getMovieById } from '@/utils/getMovieById';
import prisma from '@/utils/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /movie/{id}/watch:
 *   patch:
 *     tags:
 *       - Movie
 *     summary: Отметить фильм как просмотренный
 *     description: Отметить фильм как просмотренный
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         required: true
 *         description: Id фильма
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 watched:
 *                   type: boolean
 *       404:
 *         description: Фильм не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       422:
 *         description: Id отсутствует
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  if (!id) {
    return NextResponse.json({ error: 'Id отсутствует' }, { status: 422 });
  }

  const movie = await getMovieById(id);

  if (!movie) {
    return NextResponse.json({ error: 'Фильм не найден' }, { status: 404 });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { file, ...newMovie } = await prisma.movie.update({
    where: {
      id: id
    },
    data: {
      watched: true
    }
  });
  return NextResponse.json(newMovie);
}
