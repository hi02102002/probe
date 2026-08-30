# @repo/auth

Reusable Better Auth setup backed by PostgreSQL and the Drizzle Relations v2 adapter.

This starter uses Better Auth 1.7 with Drizzle ORM v1 RC. The account schema includes the v1.7 `issuer` identity field and explicitly uses the `provider-id` identity strategy.

Enabled sign-in methods:

- magic link
- GitHub OAuth when configured
- Google OAuth when configured

The PostgreSQL adapter has transactions enabled.
