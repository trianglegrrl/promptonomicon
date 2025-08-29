import { VERSION, info, templateFiles, directories } from '../index.js';

describe('Promptonomicon Main Module', () => {
  test('should export VERSION', () => {
    expect(VERSION).toBe('1.1.0');
    expect(typeof VERSION).toBe('string');
    expect(VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });

  test('should export info object', () => {
    expect(info).toBeDefined();
    expect(info.name).toBe('promptonomicon');
    expect(info.description).toContain('Transform how you build software');
    expect(info.repository).toBe('https://github.com/trianglegrrl/promptonomicon');
    expect(info.documentation).toBe('https://github.com/trianglegrrl/promptonomicon#readme');
  });

  test('should export templateFiles array', () => {
    expect(Array.isArray(templateFiles)).toBe(true);
    expect(templateFiles).toContain('PROMPTONOMICON.md');
    expect(templateFiles).toContain('1_BUILD_DESIGN.md');
    expect(templateFiles).toContain('3_BUILD_PLAN.md');
    expect(templateFiles).toContain('4_DEVELOPMENT_PROCESS.md');
    expect(templateFiles).toContain('5_BUILD_IMPLEMENTATION.md');
    expect(templateFiles).toContain('6_DOCUMENTATION_UPDATE.md');
    expect(templateFiles).toContain('README.md');
    expect(templateFiles.length).toBe(7);
  });

  test('should export directories array', () => {
    expect(Array.isArray(directories)).toBe(true);
    expect(directories).toContain('.promptonomicon');
    expect(directories).toContain('ai-docs');
    expect(directories).toContain('ai-docs/ai-design');
    expect(directories).toContain('ai-docs/ai-plans');
    expect(directories).toContain('ai-docs/ai-implementation');
    expect(directories).toContain('ai-docs/features');
    expect(directories).toContain('.scratch');
    expect(directories.length).toBe(7);
  });

  test('should export default object with all properties', async () => {
    const module = await import('../index.js');
    const def = module.default;

    expect(def.VERSION).toBe(VERSION);
    expect(def.info).toEqual(info);
    expect(def.templateFiles).toEqual(templateFiles);
    expect(def.directories).toEqual(directories);
  });
});
