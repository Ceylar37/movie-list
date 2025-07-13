import schemas from '@/schemas/movie';
import { getMovieById } from '@/utils/getMovieById';
import prisma from '@/utils/prisma';
import { validateBody, validateSortParams, ValidationError } from '@/utils/validators';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/movie:
 *   get:
 *     tags:
 *       - Movie
 *     summary: Возвращает список фильмов
 *     description: Возвращает список фильмов
 *     parameters:
 *       - name: search
 *         in: query
 *         type: string
 *         required: false
 *         description: Поиск по названию
 *       - name: sort
 *         in: query
 *         type: string
 *         required: false
 *         description: Сортировка по названию (asc, desc)
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   watched:
 *                     type: boolean
 *       422:
 *         description: Некорректный запрос
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *
 *   post:
 *     tags:
 *       - Movie
 *     summary: Создает новый фильм
 *     description: Создает новый фильм
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   watched:
 *                     type: boolean
 *       422:
 *         description: Некорректный запрос
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *
 *   patch:
 *     tags:
 *       - Movie
 *     summary: Обновляет фильм
 *     description: Обновляет фильм
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               watched:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   watched:
 *                     type: boolean
 *       404:
 *         description: Указанный фильм не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       422:
 *         description: Некорректный запрос
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');
  const sort = searchParams.get('sort');

  try {
    const validatedSort = validateSortParams(sort);

    const movies = await prisma.movie.findMany({
      where: {
        title: {
          contains: search ?? ''
        }
      },
      orderBy: {
        title: validatedSort
      },
      omit: {
        file: true
      }
    });

    return NextResponse.json(movies);
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: error.code });
    }
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const movie = await req.json();

  try {
    const data = validateBody(movie, schemas.CreateMovie);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { file, ...newMovie } = await prisma.movie.create({
      data
    });
    return NextResponse.json(newMovie);
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: error.code });
    }
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const movie = await req.json();

  try {
    const { id, ...data } = validateBody(movie, schemas.UpdateMovie);

    const movieFromBd = await getMovieById(id);

    if (!movieFromBd) {
      return NextResponse.json({ error: 'Фильм не найден' }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { file, ...newMovie } = await prisma.movie.update({
      where: {
        id: id
      },
      data
    });
    return NextResponse.json(newMovie);
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: error.code });
    }
    console.error(error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
