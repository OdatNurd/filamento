#!/usr/bin/env node

/******************************************************************************/

import { generateId } from '../src/utility/id.js';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

/******************************************************************************/

/* Determine from the command line how many nanoids we want to generate.
 *
 * The command line argument --ask causes us to prompt the user, defaulting to
 * a single ID if they just hit enter. Alternately, a number can be specified
 * instead.
 *
 * In the case that there are no command line arguments, 1 is returned. */
async function getCount() {
  // Did the user ask to be prompted?
  if (process.argv[2] === '--ask') {
    const rl = readline.createInterface({ input, output });
    const answer = await rl.question('How many IDs should be generated? [1] ');
    rl.close();

    // Return the parsed version of the input text, or 1, depending.
    return answer.trim() === '' ? 1 : parseInt(answer, 10);
  } else {
    // The user did not ask to be prompted, so read the number directly, again
    // defaulting to 1 if there is no argument.
    return process.argv[2] ? parseInt(process.argv[2], 10) : 1;
  }
}

/******************************************************************************/

const count = await getCount();

if (isNaN(count) || count < 1) {
  console.error('Usage: pnpm nanoid [count] or pnpm nanoid --ask');
  console.error('Error: count must be a positive number');
  process.exit(1);
}

for (let i = 0; i < count; i++) {
  console.log(generateId());
}

/******************************************************************************/