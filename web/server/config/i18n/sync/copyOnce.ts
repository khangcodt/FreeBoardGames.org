import { glob } from 'glob';
import { destination, pattern } from './constants';
import { copy } from './copy';

const files = glob.sync(pattern);
files.forEach((source) => {
  copy(source, destination);
});
