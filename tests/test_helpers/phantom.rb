# frozen_string_literal: true

require "phantom/test"

Capybara.register_server :phantom do |app, port, host|
  Phantom::Test.start(
    :frontend,
    "pnpm dev --port #{port + 1}",
    dir: "./frontend",
    env: {
      "VITE_BACKEND_BASE_URL" => "http://#{host}:#{port}"
    },
    url: "http://localhost:#{port + 1}"
  )

  Capybara.run_default_server(app, port)
end

Capybara.configure do |config|
  config.server = :phantom
end
