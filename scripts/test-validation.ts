/**
 * Validation test script
 * Tests validation with an invalid file
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { configSchema } from '@/lib/config-schema';

console.log('='.repeat(60));
console.log('CONFIG.JSON FILE VALIDATION TEST');
console.log('='.repeat(60));

// Load the invalid test file
const configPath = join(process.cwd(), 'config.test-invalid.json');
let configData;

try {
  const configContent = readFileSync(configPath, 'utf8');
  configData = JSON.parse(configContent);
  console.log('\n✓ JSON file parsed successfully\n');
} catch (error) {
  console.error('❌ Error reading file:');
  console.error((error as Error).message);
  process.exit(1);
}

// Attempt to validate the configuration
console.log('Validating file with Zod...\n');

const result = configSchema.safeParse(configData);

if (result.success) {
  console.log('✅ File is valid (unexpected for this test!)');
} else {
  console.log('❌ VALIDATION ERRORS DETECTED:\n');

  const errors = result.error.flatten();

  // Field-level errors
  let errorCount = 0;

  Object.entries(errors.fieldErrors).forEach(([field, messages]) => {
    if (messages && messages.length > 0) {
      errorCount++;
      console.log(`${errorCount}. Field: ${field}`);
      messages.forEach((msg) => {
        console.log(`   → ${msg}`);
      });
      console.log('');
    }
  });

  // Global form errors
  if (errors.formErrors && errors.formErrors.length > 0) {
    errors.formErrors.forEach((msg) => {
      errorCount++;
      console.log(`${errorCount}. Global error: ${msg}\n`);
    });
  }

  // Display detailed errors
  console.log('='.repeat(60));
  console.log('ERROR DETAILS:');
  console.log('='.repeat(60));
  result.error.issues.forEach((issue, index) => {
    const path = issue.path.length > 0 ? issue.path.join(' → ') : 'root';
    console.log(`\n${index + 1}. ${path}`);
    console.log(`   Code: ${issue.code}`);
    console.log(`   Message: ${issue.message}`);
  });

  console.log('\n' + '='.repeat(60));
  console.log(`TOTAL: ${result.error.issues.length} error(s) detected`);
  console.log('='.repeat(60));
  console.log('\n💡 Tip: Fix these errors in the config.json file');
}
