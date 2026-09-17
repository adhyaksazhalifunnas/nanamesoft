// eslint-config-next 16 ships native flat configs, so FlatCompat is neither
// needed nor safe here — routing it through the compat layer makes ESLint try
// to JSON.stringify a config object containing circular plugin references.
import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * The secrets that must never be read outside the places that legitimately
 * own them. §5.7 asks specifically for "an ESLint rule banning
 * process.env.GITHUB_TOKEN outside scripts/"; the mail and Turnstile secrets
 * are added because they have the same failure mode.
 */
const SECRET_ENV_VARS = [
  "GITHUB_TOKEN",
  "GH_SYNC_TOKEN",
  "GH_WEBHOOK_SECRET",
  "RESEND_API_KEY",
  "TURNSTILE_SECRET_KEY",
];

const secretEnvSelector = `MemberExpression[object.object.name="process"][object.property.name="env"][property.name=/^(${SECRET_ENV_VARS.join("|")})$/]`;

const config = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "node_modules/**",
      "next-env.d.ts",
      "playwright-report/**",
      "test-results/**",
    ],
  },

  ...coreWebVitals,
  ...nextTypescript,

  {
    // core-web-vitals already registers jsx-a11y and its recommended set, so
    // re-registering the plugin here would be a redefine error. These are the
    // additions on top of it.
    rules: {
      // §11.7: "a <div role='button'> is a bug". Semantics first; ARIA only
      // where semantics genuinely cannot express the pattern.
      "jsx-a11y/no-noninteractive-element-to-interactive-role": "error",
      "jsx-a11y/prefer-tag-over-role": "error",

      // Appendix C: no `any`, and no silent @ts-expect-error.
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        { "ts-expect-error": "allow-with-description", "ts-ignore": true },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
    },
  },

  {
    /**
     * §5.7, "GitHub token exposure": the token is read only by scripts/, never
     * from anything that could end up in a bundle.
     *
     * This bans the secret NAMES rather than `process.env` wholesale. A blanket
     * ban would also flag `src/app/api/contact/route.ts`, which is a Node
     * route handler that legitimately needs RESEND_API_KEY — and a rule that
     * fires on correct code is a rule people start disabling.
     */
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: secretEnvSelector,
          message:
            "Secrets must not be read outside scripts/ and the API route that owns them (PRD §5.7). A reference here risks the value reaching a client bundle.",
        },
      ],
    },
  },

  {
    // The contact route is the one place in src/ that owns a runtime secret.
    files: ["src/app/api/**/*.ts"],
    rules: { "no-restricted-syntax": "off" },
  },

  {
    // Scripts and tests are Node programs: they read env, write files, and log.
    files: ["scripts/**/*.ts", "tests/**/*.ts", "*.config.{ts,mjs}"],
    rules: {
      "no-restricted-syntax": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default config;
