/**
 * Example usage of @xjslang/parser
 * This file demonstrates how to import and use the different subpaths
 */

// Import from main entry point
import { parse } from '@xjslang/parser';

// Import from defer subpath
import { parseDefer } from '@xjslang/parser/defer';

// Import from mut subpath  
import { parseMut } from '@xjslang/parser/mut';

// Example usage (these will throw errors until implemented)
try {
  const mainResult = parse('some xjs code');
  console.log('Main parser result:', mainResult);
} catch (error) {
  console.log('Main parser not implemented yet');
}

try {
  const deferResult = parseDefer('defer expression');
  console.log('Defer parser result:', deferResult);
} catch (error) {
  console.log('Defer parser not implemented yet');
}

try {
  const mutResult = parseMut('mut expression');
  console.log('Mut parser result:', mutResult);
} catch (error) {
  console.log('Mut parser not implemented yet');
}
