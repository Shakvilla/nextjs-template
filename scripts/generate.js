const fs = require("fs");
const path = require("path");

// Get command line arguments
const [featureName, ...flags] = process.argv.slice(2);
const options = {
  withTests: flags.includes("--with-tests"),
  withStorybook: flags.includes("--with-storybook"),
};

if (!featureName) {
  console.error("Please provide a feature name");
  console.log(`
Usage: npm run generate-feature <featureName> [options]
Options:
  --with-tests     Add test files
  --with-storybook Add Storybook files

Example: 
  npm run generate-feature auth --with-tests --with-storybook
`);
  process.exit(1);
}

// Validate feature name
const validateFeatureName = (name) => {
  if (!/^[a-z][a-zA-Z0-9]+$/.test(name)) {
    throw new Error(
      "Feature name must start with lowercase letter and contain only letters and numbers",
    );
  }
};

// Check for existing feature
const checkFeatureExists = (basePath) => {
  if (fs.existsSync(basePath)) {
    throw new Error(`Feature "${featureName}" already exists`);
  }
};

// Helper functions
const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);
const createFile = (filePath, content) => {
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }
  fs.writeFileSync(filePath, content);
};

// Template generator functions
const templates = {
  page: (name) => `import React, {FC, ReactElement} from 'react';

 const  ${capitalize(name)}Page: FC = () : ReactElement => {
    return (
        <div className="flex justify-center items-center ">
            <h1 className="font-extrabold text-2xl">${capitalize(name)}</h1>
        </div>
    );
}

export default ${capitalize(name)}Page;

`,

  component: (name) => `'use client';

import React from 'react';
import styles from './Sample.module.css';

export interface SampleProps {
    title?: string;
}

export const Sample = ({ title = 'Sample Component' }: SampleProps) => {
    return (
        <div className={styles.container}>
            <h2>{title}</h2>
        </div>
    );
};`,

  componentTest: (
    name,
  ) => `import { render, screen } from '@testing-library/react';
import { Sample } from './Sample';

describe('Sample Component', () => {
    it('renders with default title', () => {
        render(<Sample />);
        expect(screen.getByText('Sample Component')).toBeInTheDocument();
    });

    it('renders with custom title', () => {
        render(<Sample title="Custom Title" />);
        expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });
});`,

  componentStory: (
    name,
  ) => `import type { Meta, StoryObj } from '@storybook/react';
import { Sample } from './Sample';

const meta: Meta<typeof Sample> = {
    title: '${capitalize(name)}/Sample',
    component: Sample,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof Sample>;

export const Default: Story = {
    args: {
        title: 'Sample Component',
    },
};

export const CustomTitle: Story = {
    args: {
        title: 'Custom Title',
    },
};`,

  hook: (name) => `'use client';

import { z } from 'zod';
import { ${name}Schema } from '../schemes/${name}.schema';

export const use${capitalize(name)}Schema = () => {
    const validate = (data: unknown) => {
        return ${name}Schema.safeParse(data);
    };

    return {
        validate,
        schema: ${name}Schema,
    };
};`,

  hookTest: (name) => `import { renderHook } from '@testing-library/react';
import { use${capitalize(name)}Schema } from './use${capitalize(name)}Schema';

describe('use${capitalize(name)}Schema', () => {
    it('should validate correct data', () => {
        const { result } = renderHook(() => use${capitalize(name)}Schema());
        const testData = {}; // Add test data here
        
        const validation = result.current.validate(testData);
        expect(validation.success).toBe(true);
    });
});`,

  interface: (name) => `export interface I${capitalize(name)} {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface I${capitalize(name)}Response {
    data: I${capitalize(name)};
    message: string;
}`,

  reducer: (
    name,
  ) => `import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { I${capitalize(name)} } from '../interfaces/${name}.interface';

interface ${capitalize(name)}State {
    data: I${capitalize(name)} | null;
    loading: boolean;
    error: string | null;
}

const initialState: ${capitalize(name)}State = {
    data: null,
    loading: false,
    error: null,
};

export const ${name}Slice = createSlice({
    name: '${name}',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setData: (state, action: PayloadAction<I${capitalize(
          name,
        )} | null>) => {
            state.data = action.payload;
        },
    },
});

export const ${name}Reducer = ${name}Slice.reducer;
export const ${name}Actions = ${name}Slice.actions;`,

  reducerTest: (
    name,
  ) => `import { ${name}Reducer, ${name}Actions } from './${name}.reducer';

describe('${name} Reducer', () => {
    it('should handle initial state', () => {
        expect(${name}Reducer(undefined, { type: 'unknown' })).toEqual({
            data: null,
            loading: false,
            error: null,
        });
    });

    it('should handle setLoading', () => {
        const actual = ${name}Reducer(undefined, ${name}Actions.setLoading(true));
        expect(actual.loading).toEqual(true);
    });
});`,

  schema: (name) => `import { z } from 'zod';

export const ${name}Schema = z.object({
    id: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type T${capitalize(name)}Schema = z.infer<typeof ${name}Schema>;`,

  service: (name) => `import { I${capitalize(name)}, I${capitalize(
    name,
  )}Response } from '../interfaces/${name}.interface';

export class ${capitalize(name)}Service {
    private static instance: ${capitalize(name)}Service;
    private baseUrl: string;

    private constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    }

    public static getInstance(): ${capitalize(name)}Service {
        if (!${capitalize(name)}Service.instance) {
            ${capitalize(name)}Service.instance = new ${capitalize(
              name,
            )}Service();
        }
        return ${capitalize(name)}Service.instance;
    }

    async getData(): Promise<I${capitalize(name)}Response> {
        const response = await fetch(\`\${this.baseUrl}/${name}\`);
        return response.json();
    }
}

export const ${name}Service = ${capitalize(name)}Service.getInstance();`,

  serviceTest: (name) => `import { ${capitalize(
    name,
  )}Service } from './${name}.service';

describe('${capitalize(name)}Service', () => {
    it('should be a singleton', () => {
        const instance1 = ${capitalize(name)}Service;
        const instance2 = ${capitalize(name)}Service;
        expect(instance1).toBe(instance2);
    });

    it('should fetch data', async () => {
        global.fetch = jest.fn(() => 
            Promise.resolve({
                json: () => Promise.resolve({ data: {}, message: 'Success' })
            })
        ) as jest.Mock;

        const response = await ${name}Service.getData();
        expect(response).toBeDefined();
    });
});`,

  readme: (name) => `# ${capitalize(name)} Feature

## Overview
Brief description of the ${name} feature.

## Components
- \`Sample.tsx\`: Description of the Sample component

## Hooks
- \`use${capitalize(name)}Schema.ts\`: Schema validation hook

## Interfaces
- \`I${capitalize(name)}\`: Main interface
- \`I${capitalize(name)}Response\`: API response interface

## State Management
- Reducer: \`${name}.reducer.ts\`
- Actions: \`${name}Actions\`

## Services
- \`${name}Service\`: API integration and business logic

## Testing
${
  options.withTests
    ? "- Unit tests included for all components and services"
    : "- Tests can be added using --with-tests flag"
}

## Storybook
${
  options.withStorybook
    ? "- Stories included for visual testing and documentation"
    : "- Storybook can be added using --with-storybook flag"
}

## Usage
\`\`\`tsx
import { Sample } from './${name}/components/Sample';
import { use${capitalize(name)}Schema } from './${name}/hooks/use${capitalize(
    name,
  )}Schema';
import { ${name}Service } from './${name}/services/${name}.service';

// Add usage examples here
\`\`\`
`,
};

try {
  validateFeatureName(featureName);

  const basePath = path.join(process.cwd(), "app", "(features)", featureName);
  checkFeatureExists(basePath);

  // Define the feature structure
  const structure = {
    [`page.tsx`]: templates.page(featureName),
    [`components/Sample.tsx`]: templates.component(featureName),
    [`hooks/use${capitalize(featureName)}Schema.ts`]:
      templates.hook(featureName),
    [`interfaces/${featureName}.interface.ts`]:
      templates.interface(featureName),
    [`reducers/${featureName}.reducer.ts`]: templates.reducer(featureName),
    [`schemes/${featureName}.schema.ts`]: templates.schema(featureName),
    [`services/${featureName}.service.ts`]: templates.service(featureName),
    [`README.md`]: templates.readme(featureName),
  };

  // Add test files if --with-tests flag is present
  if (options.withTests) {
    structure[`components/Sample.test.tsx`] =
      templates.componentTest(featureName);
    structure[`hooks/use${capitalize(featureName)}Schema.test.ts`] =
      templates.hookTest(featureName);
    structure[`reducers/${featureName}.reducer.test.ts`] =
      templates.reducerTest(featureName);
    structure[`services/${featureName}.service.test.ts`] =
      templates.serviceTest(featureName);
  }

  // Add Storybook files if --with-storybook flag is present
  if (options.withStorybook) {
    structure[`components/Sample.stories.tsx`] =
      templates.componentStory(featureName);
  }

  // Create all files
  Object.entries(structure).forEach(([filePath, content]) => {
    createFile(path.join(basePath, filePath), content);
  });

  console.log(`✅ Feature ${featureName} created successfully!`);
  console.log(`
Added:
- Base feature structure
${options.withTests ? "- Test files" : ""}
${options.withStorybook ? "- Storybook stories" : ""}

Location: app/(features)/${featureName}/
    `);
} catch (error) {
  console.error("❌ Error:", error.message);
  process.exit(1);
}
