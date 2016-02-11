
/**
 * Defines Mocha test cases for each given parameter.
 */
export default function itEach(testName, parameters, testBody) {
  const it = global.it;
  parameters.forEach(param => {
    it(testName, testBody(...param));
  });
}

