/******************************************************************************/

import { customAlphabet } from 'nanoid';

/******************************************************************************/

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 22);

export const generateId = () => nanoid();

/******************************************************************************/