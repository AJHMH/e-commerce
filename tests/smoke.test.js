import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const kitRequire = createRequire(require.resolve('@sveltejs/kit/package.json'));
const cookie = kitRequire('cookie');

test('SvelteKit cookie dependency preserves valid cookies and rejects header injection', () => {
	const serialized = cookie.serialize('session', 'value with spaces', {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax'
	});
	assert.equal(serialized, 'session=value%20with%20spaces; Path=/; HttpOnly; Secure; SameSite=Lax');
	assert.equal(cookie.parse(serialized).session, 'value with spaces');
	assert.throws(() => cookie.serialize('session; injected', 'value'), TypeError);
	assert.throws(() => cookie.serialize('session', 'value', { path: '/; Secure' }), TypeError);
	assert.throws(() => cookie.serialize('session', 'value', { domain: 'example.com; Secure' }), TypeError);
});

test('package.json declares the e-commerce app', () => {
	const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
	assert.equal(pkg.name, 'e-commerce');
	assert.equal(pkg.private, true);
	assert.ok(pkg.scripts.build);
	assert.ok(pkg.scripts.check);
});

test('runtime packages live in dependencies, not devDependencies', () => {
	const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
	const production = ['@sveltejs/kit', '@tailwindcss/forms', 'svelte', 'tailwindcss'];
	for (const name of production) {
		assert.ok(pkg.dependencies?.[name], `${name} should be in dependencies`);
		assert.equal(pkg.devDependencies?.[name], undefined, `${name} should not be a devDependency`);
	}
});

test('SvelteKit entrypoints exist', () => {
	assert.ok(readFileSync(join(root, 'src/app.html'), 'utf8').includes('%sveltekit.body%'));
	assert.ok(readFileSync(join(root, 'svelte.config.js'), 'utf8').length > 0);
	assert.ok(readFileSync(join(root, 'vite.config.ts'), 'utf8').length > 0);
});
