# Review: When May a Web Agent Create an Account?

## Recommendation

Place this policy inside a broader `/.well-known/agent-policy.json` manifest under an `account_creation` section. Account creation is only one of several related agent actions—public exploration, authentication, posting, purchasing, messaging, deletion, and data export—and separate files will eventually create conflicting versions and extra network requests.

A standalone `/.well-known/account-create.json` can remain as a temporary compatibility alias, but it should either redirect to the broader manifest or contain a pointer such as:

```json
{
  "policy": "https://example.com/.well-known/agent-policy.json#account_creation"
}
```

The manifest should be treated as site-declared guidance, not permission by itself. An agent still needs valid user delegation and must obey law, platform terms, and its own safety constraints.

## Missing or underspecified stop conditions

The current stop conditions are directionally good, but these cases should also force a stop or explicit human confirmation:

1. **The account creates a public identity or public side effect by default.** Examples include a searchable profile, public username reservation, automatic follow activity, invitations, announcements, or a public organization membership.
2. **A free trial automatically converts to paid service.** Capturing a payment method, authorizing future charges, selecting a paid plan, or accepting usage-based billing should always be treated as a payment action even when the initial charge is zero.
3. **The signup grants sensitive third-party scopes.** OAuth approval should stop when requested scopes include mail sending, file modification, financial data, contacts, admin access, or scopes unrelated to the user's stated objective.
4. **The recovery channel is not controlled by the delegating user.** The agent should not create an account when it cannot verify that the email address, phone number, passkey, or recovery destination belongs to the user or an explicitly authorized organization.
5. **An account may already exist.** Duplicate accounts can violate terms, split billing, create identity confusion, or trigger fraud controls. The agent should first use an account-discovery or password-recovery-safe check where available, without enumerating other users.
6. **The service is regulated or age-restricted.** Financial services, gambling, healthcare, employment eligibility, government identity, controlled goods, and age-gated services should require explicit human handling and any legally required verification.
7. **The flow assigns an organizational role.** Joining an enterprise tenant, accepting an administrator role, becoming a billing owner, or representing a company creates authority beyond ordinary signup.
8. **The signup requires factual certifications.** Statements such as tax residency, professional licensing, beneficial ownership, sanctions status, eligibility, or compliance declarations cannot be inferred by the agent.
9. **The service requires anti-automation circumvention.** CAPTCHA, device-attestation checks, explicit human-only wording, queue bypasses, or bot-detection challenges should be hard stops—not obstacles to route around.
10. **The action is difficult to reverse.** Permanent usernames, domain claims, immutable handles, irreversible data publication, or deletion restrictions should trigger confirmation before submission.
11. **The site policy changed during the flow.** A material policy change, terms-version change, or redirect to another origin after the agent began should invalidate the previous decision and cause re-evaluation.
12. **The agent would need to invent personal data.** Date of birth, address, legal name, job title, company size, or preferences must come from an authorized source, not model inference.

## Separate routine terms from binding authority

A site manifest should not label terms as “routine” and thereby authorize an agent to accept them. The authority must come from the user.

A useful distinction is:

- **Read-only acknowledgment:** The agent may record that terms or a privacy notice were presented.
- **Low-risk operational acknowledgment:** The user has explicitly authorized acceptance of a named service's standard account terms for this signup, with the exact terms URL and version captured.
- **Elevated legal or financial acceptance:** Arbitration clauses, indemnities, recurring billing, credit checks, regulated declarations, business-representation authority, IP assignments, public posting rights, or anything requiring a signature must stop for the user.

The manifest can describe what the site requires, but it cannot manufacture delegated legal authority.

## Proposed decision state machine

Use an explicit state machine rather than a single allow/deny flag:

1. **Discover** — Fetch the policy and identify the signup flow without submitting information.
2. **Assess** — Compare required fields, side effects, scopes, terms, and verification steps against the user's delegation.
3. **Prepare** — Fill only reversible fields. Generate credentials in an approved secret store, not in logs or chat.
4. **Confirm** — Request human approval only when a listed confirmation boundary is reached.
5. **Execute** — Submit once, using an idempotency key where supported.
6. **Verify** — Confirm the account exists, the intended plan is selected, visibility is correct, and no unexpected side effects occurred.
7. **Receipt** — Produce an audit record and provide rollback/deletion instructions.

Policy absence should mean: public exploration may continue where otherwise permitted, but account creation is not authorized merely because no manifest exists.

## Required admission-receipt fields

An `account_creation_admission_receipt` should contain at least:

```json
{
  "receipt_version": "1.0",
  "receipt_id": "acr_...",
  "created_at": "2026-07-31T00:00:00Z",
  "origin": "https://example.com",
  "signup_endpoint": "https://example.com/signup",
  "policy": {
    "url": "https://example.com/.well-known/agent-policy.json",
    "version": "2026-05-01",
    "content_sha256": "...",
    "fetched_at": "2026-07-31T00:00:00Z",
    "expires_at": "2026-08-01T00:00:00Z"
  },
  "delegation": {
    "principal_reference": "user_opaque_reference",
    "authorized_objective": "Create a free developer account",
    "authorization_reference": "consent_event_...",
    "authorized_at": "2026-07-31T00:00:00Z",
    "constraints": ["no payment", "no public posting", "no phone verification"]
  },
  "requested_fields": ["email", "display_name"],
  "generated_secrets": {
    "stored_in": "approved_secret_manager",
    "secret_values_recorded": false
  },
  "external_authorizations": [
    {
      "provider": "github",
      "scopes": ["read:user", "user:email"]
    }
  ],
  "terms": [
    {
      "url": "https://example.com/terms",
      "version_or_hash": "sha256:...",
      "acceptance_authority": "explicit_user_authorization"
    }
  ],
  "stop_checks": {
    "payment": false,
    "captcha": false,
    "phone_verification": false,
    "public_side_effect": false,
    "regulated_declaration": false,
    "elevated_oauth_scope": false
  },
  "result": {
    "status": "created",
    "account_reference": "acct_redacted",
    "plan": "free",
    "public_profile": false,
    "notifications_sent": []
  },
  "rollback": {
    "deletion_url": "https://example.com/settings/delete",
    "reversible_until": null
  },
  "agent": {
    "identity": "agent_opaque_reference",
    "software_version": "..."
  }
}
```

The receipt must never contain passwords, session cookies, recovery codes, full access tokens, seed phrases, or unnecessary personal data. References should be opaque and auditable within the user's own system.

## Additional protocol fields worth adding

The site's `account_creation` policy should include:

- `policy_version`, `issued_at`, `expires_at`, and `contact`;
- allowed modes such as `public_exploration`, `declared_automation`, and `user_delegated_signup`;
- `signup_endpoints` and supported machine-readable schema URLs;
- `requires_human_confirmation_for` as an explicit array;
- `prohibited_agent_actions`;
- `allowed_oauth_scopes` or maximum scope classes;
- whether accounts create public profiles or notifications;
- trial-to-paid behavior;
- idempotency support;
- verification methods and which are agent-compatible;
- account deletion/export endpoints;
- rate limits and duplicate-account behavior;
- a stable error code such as `agent_signup_not_permitted`.

## Security notes

1. A compromised site can publish a permissive manifest. Therefore the manifest can constrain an agent further, but it should not override the user's constraints or grant new authority.
2. The policy should be scoped to the exact origin. Redirects to another origin require fetching and evaluating that origin's policy.
3. Cache entries need short validity periods and content hashes to prevent time-of-check/time-of-use ambiguity.
4. Agents should use least-privilege OAuth scopes and refuse silent scope expansion.
5. Signup requests should support idempotency keys to prevent duplicate accounts after retries or network failures.
6. Sites should expose a machine-readable dry-run endpoint where an agent can learn required fields and side effects without creating an account.

## Practical example

A delegated agent may create a free project-management account when the user supplied the email address, authorized that named service, no payment method is requested, the profile is private, standard low-risk terms were explicitly authorized, and email verification can be completed through the user's inbox.

The same agent must stop if the flow unexpectedly asks for a card “for verification,” requests permission to send email or access all files, creates a public company profile, requires a phone number, or asks the user to certify business/legal facts.

## Bottom line

The proposal is useful, but the safest standard is not “the site says signup is allowed.” It is: **the site describes the flow, the user supplies authority, and the agent proves that every required action stayed inside both sets of constraints.** A broader `agent-policy.json` manifest plus a precise, redacted admission receipt gives implementers a more extensible and auditable foundation than a standalone signup-only permission file.
