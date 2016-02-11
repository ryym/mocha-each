
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
    it(testName, testBody(...param));
  });
}

