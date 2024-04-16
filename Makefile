export VITE_BACKEND_BASE_URL=http://localhost:3000

.PHONY: backend frontend

backend:
	cd backend && bundle exec rails server;

codegen:
	cd backend && bundle exec rails runner 'require "graphql/rake_task"; GraphQL::RakeTask.new(schema_name: "BackendSchema", idl_outfile: "../schema.graphql"); Rake::Task["graphql:schema:idl"].invoke'
	cd frontend && pnpm codegen;

console:
	cd backend && rails console;

frontend:
	cd frontend && pnpm dev;

install-dependencies:
	cd backend && bundle install;
	cd frontend && pnpm install;

lint-fix:
	cd backend && bundle exec rubocop -A .;
	cd backend && bundle exec rubocop -A ../tests;
	cd frontend && pnpm lint --fix;

system-tests:
	RUBYOPT="-I tests" ./backend/bin/rails test ${file};

tsc:
	cd frontend && pnpm tsc;

unit-tests:
	cd backend && bundle exec rails test;
