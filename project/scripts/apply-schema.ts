import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const execAsync = promisify(exec);
const __dirname = fileURLToPath(new URL('.', import.meta.url));

async function applySchema() {
  try {
    // Read the schema file
    const schemaPath = join(process.cwd(), 'supabase', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');

    // Check if Supabase CLI is installed
    try {
      await execAsync('supabase --version');
    } catch (error) {
      console.error('Supabase CLI is not installed. Please install it first:');
      console.error('npm install -g supabase');
      process.exit(1);
    }

    // Check if we're logged in
    try {
      await execAsync('supabase projects list');
    } catch (error) {
      console.error('Please login to Supabase CLI first:');
      console.error('supabase login');
      process.exit(1);
    }

    // Get the current project
    const { stdout: projectOutput } = await execAsync('supabase projects list --json');
    const projects = JSON.parse(projectOutput);
    if (!projects.length) {
      console.error('No Supabase projects found. Please create one first.');
      process.exit(1);
    }

    // Apply the schema
    console.log('Applying schema to Supabase...');
    const { stdout, stderr } = await execAsync(`supabase db push`);
    
    if (stderr) {
      console.error('Error applying schema:', stderr);
      process.exit(1);
    }

    console.log('Schema applied successfully!');
    console.log(stdout);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

applySchema(); 