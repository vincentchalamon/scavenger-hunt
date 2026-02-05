/**
 * Config.json validation script
 * Uses Zod to validate structure and types
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { configSchema } from '@/lib/config-schema';

// Load config.json file
const configPath = join(process.cwd(), 'config.json');
let configData;

try {
  const configContent = readFileSync(configPath, 'utf8');
  configData = JSON.parse(configContent);
} catch (error) {
  console.error('❌ Error reading config.json file:');
  console.error((error as Error).message);
  process.exit(1);
}

// Validate configuration
const result = configSchema.safeParse(configData);

if (result.success) {
  console.log('✅ The config.json file is valid!');
  console.log(`   - ${configData.hunts.length} hunt(s)`);
  configData.hunts.forEach((hunt: any) => {
    console.log(`   - "${hunt.name}" with ${hunt.places.length} place(s)`);
  });
  process.exit(0);
} else {
  console.error('❌ Error validating config.json file:\n');

  result.error.issues.forEach((issue, index) => {
    const path = issue.path.length > 0 ? issue.path.join(' → ') : 'root';
    console.error(`${index + 1}. ${path}`);
    console.error(`   ${issue.message}`);
    console.error('');
  });

  console.error(`Total: ${result.error.issues.length} error(s) detected\n`);
  console.error('💡 Check the structure and types in config.json');

  process.exit(1);
}
