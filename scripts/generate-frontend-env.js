const fs = require('fs');
const path = require('path');

const outputsPath = path.join(__dirname, '../infrastructure/outputs.json');
const envPath = path.join(__dirname, '../frontend/.env');

try {
  if (!fs.existsSync(outputsPath)) {
    console.error('outputs.json not found at', outputsPath);
    process.exit(1);
  }

  const outputs = JSON.parse(fs.readFileSync(outputsPath, 'utf8'));
  // The stack name in app.ts is 'SolicitudesFrontendStack'
  const frontendStack = outputs['SolicitudesFrontendStack']; 
  
  if (!frontendStack) {
    console.error('SolicitudesFrontendStack not found in outputs');
    process.exit(1);
  }

  if (!frontendStack.FrontendEnvConfig) {
    console.error('FrontendEnvConfig not found in SolicitudesFrontendStack outputs');
    process.exit(1);
  }

  const config = JSON.parse(frontendStack.FrontendEnvConfig);
  
  let envContent = '';
  for (const [key, value] of Object.entries(config)) {
    envContent += `${key}=${value}\n`;
  }

  fs.writeFileSync(envPath, envContent);
  console.log('Generated frontend/.env');
  console.log(envContent);
} catch (error) {
  console.error('Error generating .env:', error);
  process.exit(1);
}
