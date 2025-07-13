import z from 'zod';

const CreateMovie = z
  .object({
    title: z.string(),
    description: z.string()
  })
  .required();

const UpdateMovie = z
  .object({
    id: z.string(),
    title: z.string().optional(),
    description: z.string().optional()
  })
  .required();

const schemas = {
  CreateMovie,
  UpdateMovie
};

export default schemas;
