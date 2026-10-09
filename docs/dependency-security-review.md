# Dependency security review

GitHub confirmed 57 vulnerability alerts on the default branch when the fix branch was pushed: 21 high, 30 moderate, and 6 low. Direct access to the Dependabot alert API returned Forbidden in this environment, so individual alert IDs and closure status could not be verified. Both committed lockfiles were independently audited against npm's advisory database.

Before remediation, npm reported 10 affected packages covering 34 advisories; pnpm reported 25 advisories. These are different counts from GitHub alerts, which may track the same advisory in multiple manifests. After remediation, both full audits (including development dependencies) report zero vulnerabilities.

## Changes

- Raise SvelteKit to ^2.70.3, Svelte to ^5.57.2, and Vite to ^7.3.7, preserving their existing major versions.
- Refresh npm and pnpm lockfiles to patched direct and transitive dependencies.
- Override only SvelteKit's cookie dependency to ^0.7.2 in npm and pnpm configuration. SvelteKit 2 still requests vulnerable cookie 0.6.x; the patched 0.7 API retains parse/serialize compatibility and validates cookie names, paths, and domains. A regression test covers valid serialization and rejection of injected attributes. Reassess this override when upgrading SvelteKit.

## Advisory coverage from the original npm lockfile

| Package | Advisory | Severity | Patched version in lockfile |
| --- | --- | --- | --- |
| @sveltejs/kit | [GHSA-3f6h-2hrp-w5wx](https://github.com/advisories/GHSA-3f6h-2hrp-w5wx) — @sveltejs/kit: Unvalidated redirect in handle hook causes Denial-of-Service | moderate | 2.70.3 |
| @sveltejs/kit | [GHSA-2crg-3p73-43xp](https://github.com/advisories/GHSA-2crg-3p73-43xp) — @sveltejs/adapter-node has a BODY_SIZE_LIMIT bypass | high | 2.70.3 |
| @sveltejs/kit | [GHSA-hgv7-v322-mmgr](https://github.com/advisories/GHSA-hgv7-v322-mmgr) — @sveltejs/kit: `query.batch` cross-talk | moderate | 2.70.3 |
| @sveltejs/kit | [GHSA-866w-xmhq-wj7x](https://github.com/advisories/GHSA-866w-xmhq-wj7x) — SvelteKit: Prototype pollution in file input deletion path in remote-function forms | moderate | 2.70.3 |
| @sveltejs/kit | [GHSA-wqjv-9729-c5q2](https://github.com/advisories/GHSA-wqjv-9729-c5q2) — SvelteKit: Big remote form function payloads can cause Node process to crash | moderate | 2.70.3 |
| @sveltejs/kit | [GHSA-29g2-3rmr-qm68](https://github.com/advisories/GHSA-29g2-3rmr-qm68) — SvelteKit: ReDoS (O(n^2)) in content negotiation — unauthenticated DoS via the Accept header | moderate | 2.70.3 |
| cookie | [GHSA-pxg6-pf52-xh8x](https://github.com/advisories/GHSA-pxg6-pf52-xh8x) — cookie accepts cookie name, path, and domain with out of bounds characters | low | 0.7.2 |
| devalue | [GHSA-77vg-94rm-hx3p](https://github.com/advisories/GHSA-77vg-94rm-hx3p) — Svelte devalue: DoS via sparse array deserialization | high | 5.9.4 |
| devalue | [GHSA-9rgm-9g3h-6x36](https://github.com/advisories/GHSA-9rgm-9g3h-6x36) — Svelte devalue: DoS via malformed input | moderate | 5.9.4 |
| devalue | [GHSA-j22f-vq7h-c4qm](https://github.com/advisories/GHSA-j22f-vq7h-c4qm) — devalue: `stringify`/`uneval` serialize shared memory | high | 5.9.4 |
| devalue | [GHSA-hx4r-w6wj-j8fg](https://github.com/advisories/GHSA-hx4r-w6wj-j8fg) — devalue: Residual sparse-array CPU amplification in uneval | moderate | 5.9.4 |
| devalue | [GHSA-mcm9-63f2-9j32](https://github.com/advisories/GHSA-mcm9-63f2-9j32) — devalue: Repeated primitive strings cause quadratic expansion in uneval | high | 5.9.4 |
| devalue | [GHSA-wf3x-273g-mvxv](https://github.com/advisories/GHSA-wf3x-273g-mvxv) — devalue: Sparse arrays emitted by uneval cause eager allocation when evaluated | low | 5.9.4 |
| devalue | [GHSA-4q55-j62x-fr9h](https://github.com/advisories/GHSA-4q55-j62x-fr9h) — devalue: Malformed null-prototype object keys bypass __proto__ rejection via property-key coercion | moderate | 5.9.4 |
| esbuild | [GHSA-g7r4-m6w7-qqqr](https://github.com/advisories/GHSA-g7r4-m6w7-qqqr) — esbuild allows arbitrary file read when running the development server on Windows | low | 0.28.2 |
| nanoid | [GHSA-28wg-ghj8-5hjv](https://github.com/advisories/GHSA-28wg-ghj8-5hjv) — nanoid: non-secure generators can loop indefinitely with negative size | high | 3.3.20 |
| nanoid | [GHSA-2v37-7h3g-55p8](https://github.com/advisories/GHSA-2v37-7h3g-55p8) — nanoid: custom generators can loop indefinitely when size is zero | high | 3.3.20 |
| nanoid | [GHSA-xwg4-73v4-xw9w](https://github.com/advisories/GHSA-xwg4-73v4-xw9w) — nanoid: Integer Overflow or Wraparound | high | 3.3.20 |
| picomatch | [GHSA-3v7f-55p6-f55p](https://github.com/advisories/GHSA-3v7f-55p6-f55p) — Picomatch: Method Injection in POSIX Character Classes causes incorrect Glob Matching | moderate | 4.0.7 |
| picomatch | [GHSA-c2c7-rcm5-vvqj](https://github.com/advisories/GHSA-c2c7-rcm5-vvqj) — Picomatch has a ReDoS vulnerability via extglob quantifiers | high | 4.0.7 |
| postcss | [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93) — PostCSS has XSS via Unescaped </style> in its CSS Stringify Output | moderate | 8.5.29 |
| postcss | [GHSA-6g55-p6wh-862q](https://github.com/advisories/GHSA-6g55-p6wh-862q) — PostCSS: Arbitrary file read and information disclosure via attacker-controlled sourceMappingURL in CSS comments | high | 8.5.29 |
| postcss | [GHSA-fxqj-rqcc-2cmp](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp) — PostCSS: incomplete fix of GHSA-6g55-p6wh-862q — attacker-controlled sourceMappingURL reads arbitrary .map files when `from` is unset | moderate | 8.5.29 |
| postcss | [GHSA-r28c-9q8g-f849](https://github.com/advisories/GHSA-r28c-9q8g-f849) — PostCSS: Path Traversal in Previous Source Map Auto-Loading (sourceMappingURL) leads to Arbitrary .map File Disclosure | high | 8.5.29 |
| source-map-js | [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) — source-map-js allows event-loop denial of service through indexed source-map section offsets | high | 1.2.2 |
| svelte | [GHSA-f3cj-j4f6-wq85](https://github.com/advisories/GHSA-f3cj-j4f6-wq85) — Svelte: SSR XSS via Insecure Promise Serialization in hydratable | moderate | 5.57.2 |
| svelte | [GHSA-rcqx-6q8c-2c42](https://github.com/advisories/GHSA-rcqx-6q8c-2c42) — Svelte Vulnerable to XSS via DOM Clobbering of Internal Framework State | moderate | 5.57.2 |
| svelte | [GHSA-9rmh-mm8f-r9h6](https://github.com/advisories/GHSA-9rmh-mm8f-r9h6) — Svelte: ReDoS in `<svelte:element>` Tag Validation | moderate | 5.57.2 |
| svelte | [GHSA-pr6f-5x2q-rwfp](https://github.com/advisories/GHSA-pr6f-5x2q-rwfp) — Svelte SSR vulnerable to cross-site scripting via spread attributes | moderate | 5.57.2 |
| vite | [GHSA-4w7w-66w2-5vf9](https://github.com/advisories/GHSA-4w7w-66w2-5vf9) — Vite Vulnerable to Path Traversal in Optimized Deps `.map` Handling | moderate | 7.3.7 |
| vite | [GHSA-v2wj-q39q-566r](https://github.com/advisories/GHSA-v2wj-q39q-566r) — Vite: `server.fs.deny` bypassed with queries | high | 7.3.7 |
| vite | [GHSA-p9ff-h696-f583](https://github.com/advisories/GHSA-p9ff-h696-f583) — Vite Vulnerable to Arbitrary File Read via Vite Dev Server WebSocket | high | 7.3.7 |
| vite | [GHSA-v6wh-96g9-6wx3](https://github.com/advisories/GHSA-v6wh-96g9-6wx3) — launch-editor: NTLMv2 hash disclosure via UNC path handling on Windows | moderate | 7.3.7 |
| vite | [GHSA-fx2h-pf6j-xcff](https://github.com/advisories/GHSA-fx2h-pf6j-xcff) — vite: `server.fs.deny` bypass on Windows alternate paths | high | 7.3.7 |

## Validation

- npm ci
- npm audit --json: zero vulnerabilities
- pnpm audit --json: zero vulnerabilities
- npm run check: zero errors and warnings
- npm test: passed, including cookie regression coverage
- npm run build: passed

GitHub must rescan the default branch after merge to confirm the reported alerts are closed. No alerts were dismissed or suppressed.
