import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline';
import fetch from 'node-fetch';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Create readline interface for password input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisify readline question
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function applySchema() {
  try {
    // Read the schema file
    const schemaPath = join(process.cwd(), 'supabase', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');

    // Get Supabase credentials
    const supabaseUrl = await question('Enter your Supabase URL (e.g., https://mhnfcphetkidiqgldnww.supabase.co): ');
    const supabaseKey = await question('Enter your Supabase service_role key: ');
    rl.close();

    console.log('Applying schema to Supabase...');

    // Execute the SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        query: schema
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to apply schema: ${error}`);
    }

    console.log('Schema applied successfully!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

applySchema(); 