import Invoices from './invoices';
import Plays from './plays';
import { statement } from './index';
// const Invoices = require('../js/invoices.json');
// const Plays = require('../js/plays.json');
// const statement = require('./index.ts');

describe('test index.ts', () => {
  it('should be match result string', () => {
    expect(statement(Invoices, Plays).replace(/\s/g, '')).toMatch(
      `청구 내역 (고객명: BigCo)\n
    Hamlet: $650.00 (55석)\n
    As You Like It: $530.00 (35석)\n
    Othello: $500.00 (40석)\n
    총액: $1,680.00\n
    적립 포인트: 47점\n`.replace(/\s/g, ''),
    );
  });
});
