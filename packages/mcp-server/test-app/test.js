// GREEN: Implement add() to make the test pass
function add(a, b) {
  return a + b;
}

// Test
if (add(2, 3) !== 5) {
  console.error('Test failed: add(2, 3) should be 5');
  process.exit(1);
}
console.log('Test passed!');
