
/**
 * Defines Mocha test cases for each given parameter.
 */
export default function itEach(
  testName, parameters, testBody, it = global.it
) {
  if (typeof it !== 'function') {
    throw new Error('itEach: Mocha is not found');
  }
  parameters.forEach(param => {
    const args = Array.isArray(param) ? param : [param];
    it(testName, () => testBody(...args));
  });
}

