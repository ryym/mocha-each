
/**
 * Defines Mocha test cases for each given parameter.
 */
export default function itEach(testName, parameters, testBody) {
  if (typeof global.it !== 'function') {
    throw new Error('itEach: Mocha is not found');
  }
  const it = global.it;
  parameters.forEach(param => {
    it(testName, testBody(...param));
  });
}

