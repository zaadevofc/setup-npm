import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import inquirer from 'inquirer';
import { PACKAGE_JSON, README, TSCONFIG, TYPEDOC } from './schema';

async function main(args: string) {
  let pkg_name = args[0] as string;
  let pkg_desc;
  let pkg_manager;
  let pkg_execution;

  if (pkg_name) {
    const check = fs.existsSync(path.join(process.cwd(), pkg_name));
    if (check) {
      console.log('\n[!] Project name already exits\n');
      process.exit(1);
    }
  }

  if (!pkg_name) {
    const pkg_name_ = await inquirer.prompt([
      {
        type: 'input',
        name: 'pkg_name',
        message: 'What is your project name?',
        default: 'my-ts-project'
      },
    ] as any);
    pkg_name = pkg_name_.pkg_name;

    if (pkg_name) {
      const check = fs.existsSync(path.join(process.cwd(), pkg_name));
      if (check) {
        console.log('\n[!] Project name already exits\n');
        process.exit(1);
      }
    }
  }

  const pkg_desc_ = await inquirer.prompt([
    {
      type: 'input',
      name: 'pkg_desc',
      message: 'What is your project description?',
      default: ''
    },
  ] as any);
  pkg_desc = pkg_desc_.pkg_desc;

  const pkg_manager_ = await inquirer.prompt([
    {
      type: 'list',
      name: 'pkg_manager',
      message: 'Which package manager do you want to use?',
      choices: ['npm', 'yarn', 'pnpm'],
    },
  ] as any);
  pkg_manager = pkg_manager_.pkg_manager;

  const pkg_execution_ = await inquirer.prompt([
    {
      type: 'list',
      name: 'pkg_execution',
      message: 'Is your pakcage execute? for example `npx, dlx, etc...`',
      choices: ['no', 'yes'],
    },
  ] as any);
  pkg_execution = pkg_execution_.pkg_execution == 'yes' ? true : false;

  const projectPath = path.join(process.cwd(), pkg_name);
  fs.ensureDirSync(projectPath);

  const workflowsPath = path.join(__dirname, '..', '.github');

  try {
    await fs.copy(workflowsPath, projectPath + '/.github');
  } catch (err) {
    console.error('Failed to copy workflows:', err);
  }

  if (pkg_execution) {
    const binPath = path.join(__dirname, '..', 'bin');
    try {
      await fs.copy(binPath, projectPath + '/bin');
    } catch (err) {
      console.error('Failed to copy bin:', err);
    }
  }

  fs.writeJsonSync(path.join(projectPath, 'tsconfig.json'), TSCONFIG(), { spaces: 2 });
  fs.writeJsonSync(path.join(projectPath, 'typedoc.json'), TYPEDOC(), { spaces: 2 });
  fs.writeJsonSync(path.join(projectPath, 'package.json'), PACKAGE_JSON(pkg_execution, pkg_name, pkg_desc), { spaces: 2 });

  fs.writeFileSync(path.join(projectPath, 'README.md'), README(pkg_name, pkg_desc, pkg_manager));

  fs.writeFileSync(path.join(projectPath, '.gitignore'), 'node_modules\ndist\n.env');
  fs.writeFileSync(path.join(projectPath, '.npmignore'), 'node_modules\nsrc\ntsconfig.json\npnpm-lock.yaml\nbin\.env\ntsconfig.\ntypedoc.json\n.github\ndocs\n.changeset');

  fs.ensureDirSync(path.join(projectPath, 'src'));
  fs.writeFileSync(path.join(projectPath, 'src', 'index.ts'), 'console.log("Hello, TypeScript!");');

  execSync('git init', { cwd: projectPath });

  // Install dependencies
  console.log(`Installing dependencies using ${pkg_manager}...`);
  const installCommand = getInstallCommand(pkg_manager);
  execSync(installCommand, { cwd: projectPath, stdio: 'inherit' });

  console.log(`Project ${pkg_name} has been created successfully with ${pkg_manager}!`);
  console.log('Installed modules: typescript, ts-node, nodemon');
  console.log('\nTo start your project, run:');
  console.log(`cd ${pkg_name}`);
  console.log(`${pkg_manager} start`);
}

function getInstallCommand(pkg_manager: string) {
  switch (pkg_manager) {
    case 'npm':
      return 'npm install --save-dev typescript ts-node nodemon';
    case 'yarn':
      return 'yarn add --dev typescript ts-node nodemon';
    case 'pnpm':
      return 'pnpm add --save-dev typescript ts-node nodemon';
    default:
      throw new Error('Unsupported package manager');
  }
}

module.exports = main;
