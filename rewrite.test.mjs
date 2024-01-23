import assert from 'assert';
import { eqOrMatch, matcher } from './rewrite.mjs';

// Test eqOrMatch function
function testEqOrMatch() {
  // Test case 1
  const target1 = 'example';
  const matcher1 = '*';
  const result1 = eqOrMatch(target1, matcher1);
  assert.equal(result1, true);

  // Test case 2
  const target2 = 'example';
  const matcher2 = 'different';
  const result2 = eqOrMatch(target2, matcher2);
  assert.equal(result2, false);

  // Test case 3
  const target3 = 'operationName=home&variables=%7B%2';
  const matcher3 = /operationName=home&/;
  const result3 = eqOrMatch(target3, matcher3);
  assert.equal(result3, true);
}

// Test matcher function
function testMatcher() {
  // Test case 1
  const rules1 = [
    { path: '/example', query: 'param=value' },
    { path: '/another', query: 'param=value' },
  ];
  const url1 = new URL('https://example.com/example?param=value');
  const result1 = matcher(rules1, url1);

  assert.deepEqual(result1, { path: '/example', query: 'param=value' });

  // Test case 2
  const rules2 = [
    { path: '/example', query: 'param=value' },
    { path: '/another', query: 'param=value' },
  ];
  const url2 = new URL('https://example.com/another?param=value');
  const result2 = matcher(rules2, url2);
  assert.deepEqual(result2, { path: '/another', query: 'param=value' });

  // Test case 3
  const rules3 = [
    { path: '/example', query: 'param=value' },
    { path: '/another', query: 'param=value' },
  ];
  const url3 = new URL('https://example.com/unknown?param=value');
  const result3 = matcher(rules3, url3);
  assert.equal(result3, false);

  // Test case 4
  const rules4 = [
    {
      path: '/pathfinder/v1/query',
      query: /operationName=home&/,
      origin: /\.spotify\.com$/,
    },
  ];

  const url4 = new URL(
    'https://api-partner.spotify.com/pathfinder/v1/query?operationName=home&variables'
  );

  const result4 = matcher(rules4, url4);
  assert.deepEqual(result4, rules4[0]);
}

testEqOrMatch();
testMatcher();
