<!--
Sync Impact Report - Constitution Update
=========================================
Version: (none) → 1.0.0
Type: MINOR - Initial constitution creation

Principles Created:
- I. Static-First: Content as files, local builds, no external dependencies
- II. Markdown Content Standard: All content must be Markdown
- III. JSON Data Standard: All structured data must be JSON
- IV. Minimal Dependencies: Use existing tools, avoid external services
- V. Build Simplicity: Everything builds locally with standard tools

Sections Added:
- Core Principles (5 principles)
- Technology Constraints
- Build and Development Workflow
- Governance

Templates Status:
⚠️ .specify/templates/plan-template.md - Review needed for Constitution Check section
⚠️ .specify/templates/spec-template.md - Review needed for requirements alignment
⚠️ .specify/templates/tasks-template.md - Review needed for task categorization

Follow-up TODOs:
- None (all placeholders filled)

Rationale:
- Initial version 1.0.0 as this is the first constitution
- Ratification date set to today (2025-10-11)
- Last amended date matches ratification (first version)
-->

# HawaiiDiff Constitution

## Core Principles

### I. Static-First

All features MUST be implementable as static websites:

- No server-side processing or external API dependencies
- All content and data MUST exist as files in the repository
- Build process MUST execute entirely on local machine with existing tools
- No runtime dependencies on external services (CDNs, databases, authentication providers)

**Rationale**: Ensures portability, simplicity, and independence from external infrastructure. Every feature can be built, tested, and deployed without relying on services that might change or disappear.

### II. Markdown Content Standard (NON-NEGOTIABLE)

All human-readable content MUST be authored in Markdown:

- Content files MUST use `.md` extension
- Markdown syntax MUST follow CommonMark specification
- No proprietary or framework-specific content formats permitted
- Rich text editors or WYSIWYG tools are prohibited for content authoring

**Rationale**: Markdown is universally readable, version-control friendly, and future-proof. It ensures content longevity and prevents lock-in to specific tools or platforms.

### III. JSON Data Standard (NON-NEGOTIABLE)

All structured data MUST be stored in JSON format:

- Data files MUST use `.json` extension
- JSON MUST be valid according to RFC 8259 specification
- No database systems, YAML, XML, or other data formats permitted
- Configuration and metadata MUST also be JSON

**Rationale**: JSON is human-readable, machine-parseable, and universally supported. It maintains data portability and simplicity without requiring specialized tools or parsers.

### IV. Minimal Dependencies

Use existing, standard tools over adding new dependencies:

- Prefer built-in browser APIs over external libraries
- Prefer standard HTML/CSS/JavaScript over frameworks
- New dependencies MUST be justified in writing
- Complexity debt MUST be tracked for any non-standard tooling

**Rationale**: Minimizes maintenance burden, reduces attack surface, and ensures long-term viability. Every dependency is a liability that must be actively maintained.

### V. Build Simplicity

Build process MUST remain transparent and accessible:

- All build steps MUST be documented in repository
- Build tools MUST be standard, widely-available software
- Local build MUST be possible without internet connectivity
- Build artifacts MUST be deterministic and reproducible

**Rationale**: Ensures anyone can build the site without specialized knowledge or tools. Prevents mysterious "magic" build processes that become unmaintainable over time.

## Technology Constraints

### Permitted Technologies

- HTML5, CSS3, vanilla JavaScript (ES6+)
- Static site generators using only Markdown → HTML transformation
- Standard browser APIs for client-side functionality
- CommonMark-compliant Markdown parsers

### Prohibited Technologies

- Server-side frameworks requiring runtime (Node.js servers, PHP, Python web frameworks)
- External content management systems
- Database systems (SQL, NoSQL, key-value stores)
- Authentication/authorization services
- Third-party hosting-dependent features (serverless functions, edge workers)
- YAML, TOML, XML, or other data formats beyond JSON

## Build and Development Workflow

### Build Requirements

- Build process MUST complete in under 5 minutes on standard hardware
- Build MUST NOT require external network access
- Build output MUST be a directory of static files ready for web serving
- Build MUST be idempotent (same inputs → same outputs)

### Quality Gates

Before merging any feature:

1. Verify all content is Markdown
2. Verify all data is valid JSON
3. Verify build completes successfully offline
4. Verify no external service dependencies introduced
5. Document any new build tools or dependencies

## Governance

This constitution supersedes all other practices and conventions. Any feature, tool, or approach that conflicts with these principles MUST NOT be implemented without first amending this constitution.

### Amendment Process

1. Propose amendment in writing with rationale
2. Document alternatives considered and rejected
3. Update constitution version following semantic versioning
4. Update all dependent templates and documentation
5. Record amendment date and reason

### Versioning Policy

- **MAJOR**: Breaking changes to principles (removing constraints, fundamental redefinition)
- **MINOR**: Adding new principles or expanding existing ones
- **PATCH**: Clarifications, wording improvements, typo corrections

### Compliance

- All specifications MUST include a "Constitution Check" section validating alignment
- All implementation plans MUST verify no principle violations
- Complexity that contradicts principles MUST be explicitly justified or rejected

**Version**: 1.0.0 | **Ratified**: 2025-10-11 | **Last Amended**: 2025-10-11