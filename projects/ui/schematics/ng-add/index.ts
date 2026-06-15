import { posix as path } from 'node:path';
import { workspaces } from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  chain,
} from '@angular-devkit/schematics';
import { addDependency, DependencyType } from '@schematics/angular/utility';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { ProjectType } from '@schematics/angular/utility/workspace-models';
import { Schema } from './schema';

/** Peer dependencies that ngwind needs in the consuming app. */
const PEER_DEPENDENCIES: Record<string, string> = {
  '@angular/cdk': '^22.0.0',
  '@angular/aria': '^22.0.0',
};

const OVERLAY_IMPORT = `@import '@angular/cdk/overlay-prebuilt.css';`;

/**
 * `ng add ngwind` entry point. Installs the required peer dependencies and wires
 * up the consumer's global stylesheet (Tailwind `@source` scan + CDK overlay CSS)
 * so components render styled out of the box.
 */
export function ngAdd(options: Schema): Rule {
  return chain([
    ...Object.entries(PEER_DEPENDENCIES).map(([name, version]) =>
      addDependency(name, version, { type: DependencyType.Default }),
    ),
    configureStyles(options),
  ]);
}

function configureStyles(options: Schema): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const workspace = await getWorkspace(tree);

    const projectName = options.project ?? defaultProjectName(workspace);
    if (!projectName) {
      throw new SchematicsException(
        'Could not determine which project to configure. Pass --project=<name>.',
      );
    }

    const project = workspace.projects.get(projectName);
    if (!project) {
      throw new SchematicsException(`Project "${projectName}" was not found in the workspace.`);
    }

    const stylesPath = findGlobalStylesheet(project);
    if (!stylesPath || !tree.exists(stylesPath)) {
      context.logger.warn(
        [
          'ngwind: could not find a global stylesheet to configure automatically.',
          'Add the following to your global styles manually:',
          '',
          OVERLAY_IMPORT,
          `@source '../node_modules/ngwind/**/*.mjs';`,
        ].join('\n'),
      );
      return;
    }

    const original = tree.read(stylesPath)!.toString('utf-8');
    const additions: string[] = [];

    // 1. CDK overlay structural CSS (required by Dialog + Tooltip).
    if (!original.includes('overlay-prebuilt.css')) {
      additions.push(OVERLAY_IMPORT);
    }

    // 2. Tailwind source scan — only when the app actually uses Tailwind.
    if (original.includes('tailwindcss')) {
      const sourceGlob = `${nodeModulesRelativeTo(stylesPath, 'ngwind')}/**/*.mjs`;
      const sourceLine = `@source '${sourceGlob}';`;
      if (!original.includes('node_modules/ngwind')) {
        additions.push(sourceLine);
      }
    } else {
      context.logger.warn(
        [
          'ngwind: Tailwind CSS was not detected in your global styles.',
          "Add `@import 'tailwindcss';` and then, so its utility classes are emitted:",
          `@source '../node_modules/ngwind/**/*.mjs';`,
        ].join('\n'),
      );
    }

    if (additions.length === 0) {
      context.logger.info('ngwind: global styles already configured — nothing to do.');
      return;
    }

    const prefix = original.endsWith('\n') || original.length === 0 ? '' : '\n';
    const block = `\n/* Added by 'ng add ngwind' */\n${additions.join('\n')}\n`;
    tree.overwrite(stylesPath, original + prefix + block);
    context.logger.info(`ngwind: updated ${stylesPath}.`);
  };
}

/** First application project in the workspace, used when --project is omitted. */
function defaultProjectName(workspace: workspaces.WorkspaceDefinition): string | undefined {
  for (const [name, project] of workspace.projects) {
    if (project.extensions['projectType'] === ProjectType.Application) {
      return name;
    }
  }
  return undefined;
}

/** Resolves the first global stylesheet from the project's build target. */
function findGlobalStylesheet(project: workspaces.ProjectDefinition): string | undefined {
  const styles = project.targets.get('build')?.options?.['styles'];
  if (!Array.isArray(styles)) {
    return undefined;
  }
  for (const entry of styles) {
    // Entries are either a path string or `{ input, bundleName, inject }`.
    const candidate = typeof entry === 'string' ? entry : (entry as { input?: string }).input;
    if (candidate && /\.(css|scss|sass|less)$/.test(candidate)) {
      return candidate;
    }
  }
  return undefined;
}

/** Path from the stylesheet's directory to `node_modules/<pkg>`, for use in `@source`. */
function nodeModulesRelativeTo(stylesPath: string, pkg: string): string {
  return path.relative(path.dirname(stylesPath), path.join('node_modules', pkg));
}
