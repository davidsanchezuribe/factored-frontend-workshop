import data from './data.json';

export type Skill = { skill: string, expertise: number };

export type Employee = {
  name: string,
  position: string,
  avatar: string,
  skills: Skill[]
};

export const getEmployeeData = () => new Promise<Employee[]>((resolve) => {
  setTimeout(() => { resolve(data); }, 50);
});
