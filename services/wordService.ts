import { ANSWERS } from '../constants';

export function getSecretWord(): string {
  const randomIndex = Math.floor(Math.random() * ANSWERS.length);
  return ANSWERS[randomIndex].toUpperCase();
}
