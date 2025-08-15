import { BunPlatform_Args_Has } from '../src/lib/ericchase/BunPlatform_Args_Has.js';
import { Step_Dev_Format } from './core-dev/step/Step_Dev_Format.js';
import { Step_Dev_Project_Update_Config } from './core-dev/step/Step_Dev_Project_Update_Config.js';
import { Processor_HTML_Custom_Component_Processor } from './core-web/processor/Processor_HTML_Custom_Component_Processor.js';
import { Builder } from './core/Builder.js';
import { Processor_Set_Writable } from './core/processor/Processor_Set_Writable.js';
import { Processor_TypeScript_Generic_Bundler } from './core/processor/Processor_TypeScript_Generic_Bundler.js';
import { Step_Bun_Run } from './core/step/Step_Bun_Run.js';
import { Step_FS_Clean_Directory } from './core/step/Step_FS_Clean_Directory.js';
import { Step_Run_Self_Hosted_Server } from './lib-self-hosted-web-app/step/Step_Run_Self_Hosted_Server.js';
import { Step_Self_Hosted_Server_Websocket_Reload } from './lib-self-hosted-web-app/step/Step_Self_Hosted_Server_Websocket_Reload.js';

const SERVER_PORT = 54321;

// Use command line arguments to set dev mode.
if (BunPlatform_Args_Has('--dev')) {
  Builder.SetMode(Builder.MODE.DEV);
}
Builder.SetVerbosity(Builder.VERBOSITY._1_LOG);

// These steps are run during the startup phase only.
Builder.SetStartUpSteps(
  Step_Dev_Project_Update_Config({ project_path: '.' }),
  Step_Bun_Run({ cmd: ['bun', 'update', '--latest'], showlogs: false }),
  Step_Bun_Run({ cmd: ['bun', 'install'], showlogs: false }),
  Step_FS_Clean_Directory(Builder.Dir.Out),
  Step_Dev_Format({ showlogs: false }),
  //
);

// These steps are run before each processing phase.
Builder.SetBeforeProcessingSteps(
  Step_Self_Hosted_Server_Websocket_Reload({ server_port: SERVER_PORT }),
  //
);

// Basic setup for a TypeScript powered project. TypeScript files that match
// "*.module.ts" and "*.iife.ts" are bundled and written to the out folder.
// The other TypeScript files do not produce bundles. Module ("*.module.ts")
// files will not bundle other module files. Instead, they'll import whatever
// exports are needed from other module files. IIFE ("*.iife.ts") files, on
// the other hand, produce fully contained bundles. They do not import anything
// from anywhere. Use them accordingly.

// HTML custom components are a lightweight alternative to web components made
// possible by the processors below.

// The processors are run for every file that added them during every
// processing phase.
Builder.SetProcessorModules(
  // Process the custom html components.
  Processor_HTML_Custom_Component_Processor(),
  // Bundle the server.
  Processor_TypeScript_Generic_Bundler({ target: 'bun' }, { include_patterns: ['server.module.ts'], bundler_mode: 'module' }),
  // Bundle the iife scripts and modules.
  Processor_TypeScript_Generic_Bundler({ define: () => ({ 'process.env.DEVSERVERHOST': JSON.stringify(`127.0.0.1:${SERVER_PORT}`) }), target: 'browser' }, { bundler_mode: 'iife' }),
  Processor_TypeScript_Generic_Bundler({ define: () => ({ 'process.env.DEVSERVERHOST': JSON.stringify(`127.0.0.1:${SERVER_PORT}`) }), target: 'browser' }, { exclude_patterns: ['server.module.ts'], bundler_mode: 'module' }),
  // Write non-bundle files and non-library files.
  Processor_Set_Writable({ include_patterns: ['**/*'] }),
  //
);

// These steps are run after each processing phase.
Builder.SetAfterProcessingSteps(
  // During "dev" mode (when "--dev" is passed as an argument), the server
  // will start running with hot refreshing if enabled in your index file.
  // Step_Dev_Server(),
  //
  Step_Run_Self_Hosted_Server({ server_port: SERVER_PORT }),
);

// These steps are run during the shutdown phase only.
Builder.SetCleanUpSteps();

await Builder.Start();
