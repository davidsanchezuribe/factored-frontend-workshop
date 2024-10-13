import * as z from 'zod';
import { customFetch } from '../utilities';

export type Skill = { skill: string, expertise: number };

export type Employee = {
  name: string,
  position: string,
  avatar: string,
  skills: Skill[]
};

export const getEmployeeData = () => customFetch(
  'http://localhost:5000/employee',
  'GET',
  undefined,
  z.object({
    employees: z.array(z.object({
      name: z.string(),
      position: z.string(),
      avatar: z.string(),
      skills: z.array(z.object({ skill: z.string(), expertise: z.number() })),
    })),
  }),
).then(({ employees }: { employees: Employee[] }) => employees)
  .catch((error) => {
    throw error;
  });
