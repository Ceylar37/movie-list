import { getMovieById } from '@/utils/getMovieById';
import prisma from '@/utils/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /movie/{id}:
 *   get:
 *     tags:
 *       - Movie
 *     summary: Возвращает фильм по id
 *     description: Возвращает фильм по id
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
 *
 *   delete:
 *     tags:
 *       - Movie
 *     summary: Удаляет фильм по id
 *     description: Удаляет фильм по id
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
 *
 *   put:
 *     tags:
 *       - Movie
 *     summary: Добавляет картинку к фильму по id
 *     description: Добавляет картинку к фильму по id
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         required: true
 *         description: Id фильма
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  if (!id) {
    return NextResponse.json({ error: 'Id отсутствует' }, { status: 422 });
  }

  const movie = await getMovieById(id);

  if (!movie) {
    return NextResponse.json({ error: 'Фильм не найден' }, { status: 404 });
  }

  return NextResponse.json(movie);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  if (!id) {
    return NextResponse.json({ error: 'Id отсутствует' }, { status: 422 });
  }

  const movie = await getMovieById(id);

  if (!movie) {
    return NextResponse.json({ error: 'Фильм не найден' }, { status: 404 });
  }

  await prisma.movie.delete({ where: { id } });

  return NextResponse.json(movie, { status: 200 });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const formData = await req.formData();

  const movieId = (await params).id;
  const file = formData.get('file');

  if (!movieId) return NextResponse.json({ error: 'Id отсутствует' }, { status: 422 });
  if (!file) return NextResponse.json({ error: 'Файл отсутствует' }, { status: 422 });

  if (typeof movieId !== 'string') return NextResponse.json({ error: 'Id должен быть типа string' }, { status: 422 });
  if (!(file instanceof File)) return NextResponse.json({ error: 'Файл должен быть типа File' }, { status: 422 });

  const base64File = Buffer.from(await file.arrayBuffer()).toString('base64');

  const movie = await prisma.movie.findUnique({
    where: {
      id: movieId
    }
  });

  if (!movie) {
    return NextResponse.json({ error: 'Фильм не найден' }, { status: 404 });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { file: _, ...updatedMovie } = await prisma.movie.update({
    where: {
      id: movieId
    },
    data: {
      file: base64File
    }
  });
  return NextResponse.json(updatedMovie);
}
