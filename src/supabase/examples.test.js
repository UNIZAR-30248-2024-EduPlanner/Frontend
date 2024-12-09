import { describe, it } from 'vitest';
import { matriculateStudent } from './student/student.js'; 

describe('Example imports', () => {

  it('matriculate a student', async () => {
    await matriculateStudent(819304,1000);
    await matriculateStudent(819304,40005);
    await matriculateStudent(819304,400001);
    await matriculateStudent(819304,99995);
    await matriculateStudent(819304,99996);
  });

});
