import { emailTest } from './unit/auth/email';
import { tokenTest } from './unit/auth/token';
import { usernameTest } from './unit/auth/username';

describe('token creation', tokenTest);
describe('username auth', usernameTest);
describe('email auth', emailTest);
