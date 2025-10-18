import { v4 as uuidv4 } from 'uuid';

export const generateTestCode = () => {
  return uuidv4().split('-')[0].toUpperCase();
};
