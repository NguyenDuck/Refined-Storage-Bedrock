import * as block from './block/import';

import Register from './register';

([block.default]).map(v => v.map(v1 => (v1 as Register).Register()))