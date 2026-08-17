# Codebase Intelligence Platform

An AI-powered developer tool that helps developers understand, explore, and analyze software repositories.

Users connect their GitHub account and select a repository. The platform ingests and analyzes the codebase, indexes its source code and structural information, and makes it searchable through natural-language questions.

Users can ask questions such as:

* Where is authentication implemented?
* How does user registration work?
* Which files are responsible for creating an order?
* What happens when an order is cancelled?
* Where is this database table modified?
* Which modules depend on the billing module?
* Explain this function.
* What could break if I change this database field?

The system retrieves relevant parts of the repository and uses them as context for an AI model to generate answers grounded in the actual codebase. Answers include references to relevant files and code locations.

The platform also supports GitHub pull request analysis. Users can connect a pull request and have the system analyze its changes, affected modules, potential risks, missing tests, and possible breaking changes.

Repository ingestion and analysis are performed asynchronously. The system processes source files, extracts useful structural information such as files, functions, classes, symbols, imports, and relationships, creates searchable representations and embeddings, and keeps repositories synchronized as new changes are pushed.

The application is designed as a production-oriented developer platform rather than a simple AI chatbot. It includes GitHub OAuth, repository synchronization, background processing, queues, PostgreSQL, vector search, code analysis, RAG, LLM integration, authentication and authorization, testing, Docker-based deployment, CI/CD, logging, error handling, and observability.

The overall goal is to create a tool that can help a developer understand an unfamiliar codebase quickly, investigate how features work, trace dependencies, analyze changes, and reason about potential modifications using the repository itself as the source of truth.
