export const PACKAGE_JSON = (isExecution: boolean, name: string, desc: string) => {
  const exc = isExecution;
  name = name.split(' ').join('-').toLowerCase();

  const json = {
    name: name,
    description: desc,
    version: '0.0.1',
    ...(exc ? {
      bin: {
        [name]: "./bin/index.js"
      }
    } : {
      main: "dist/index.js",
      module: "dist/index.mjs",
      types: "dist/index.d.ts",
    }),
    scripts: {
      build: "tsup src/index.ts" + (exc ? "" : " --format cjs,esm --dts"),
      lint: "tsc",
      docs: "npx typedoc",
      ...(exc ? {} : {
        dev: "ts-node-dev src/test",
        test: "ts-node src/test",
      })
    },
    homepage: `https://[your_name].github.io/${name}/`,
    funding: `https://.....`,
    bugs: {
      url: `https://github.com/[your_name]/${name}/issues`
    },
    repository: {
      url: `git+https://github.com/[your_name]/${name}.git`
    },
    keywords: [name],
    author: 'your_name',
    license: 'ISC',
  }

  return json
}

export const README = (name: string, desc: string, pm: string) => {
  name = name.split(' ').join('-').toLowerCase();

  let docs = pm == 'npm' && 'npm run docs'
  docs = !docs && pm == 'pnpm' && 'pnpm docs'
  docs = !docs && pm == 'yarn' && 'yarn docs'

  let build = pm == 'npm' && 'npm run build'
  build = !build && pm == 'pnpm' && 'pnpm build'
  build = !build && pm == 'yarn' && 'yarn build'

  let text = `## my-ts-project

${desc || 'no description.'}

---
if you want to build package :
\`\`\`bash
yarn build
\`\`\`

if you want to generate docs :
\`\`\`bash
yarn build
\`\`\`

if you want to publish :
\`\`\`bash
yarn build
\`\`\`

---

This is auto generating **Node Package Manager** by [setup-npm](https://www.npmjs.com/package/setup-npm) developing by [zaadevofc](https://instagram.com/zaadevofc) 
  `

  return text
}

export const TSCONFIG = () => {
  const config = {
    "compilerOptions": {
      "target": "ES2016",
      "module": "commonjs",
      "esModuleInterop": true,
      "forceConsistentCasingInFileNames": true,
      "strict": true,
      "skipLibCheck": true,
      "noUncheckedIndexedAccess": true,
      "noEmit": true
    }
  }

  return config
}

export const TYPEDOC = () => {
  const config = {
    "entryPoints": ["src/index.ts"],
    "hideGenerator": true,
    "excludePrivate": true,
    "excludeProtected": true,
    "excludeExternals": true,
    "includeVersion": false,
    "entryPointStrategy": "expand",
    "out": "docs",
    "gaID": "G-T0LG3JX1FJ",
    "extends": [],
    "navigationLinks": {},
    "sidebarLinks": {},
    "pretty": true
  }

  return config
}