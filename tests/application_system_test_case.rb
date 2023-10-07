# frozen_string_literal: true

require "test_helper"

Dir["#{__dir__}/test_helpers/**/*.rb"].each { |file| require file }

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :cuprite, options: { headless: ENV.fetch("CI", false) }

  include ActionDispatch::TestProcess::FixtureFile
  include SessionsHelper

  setup do
    Capybara.current_session
    Phantom.wait_for(:frontend)
  end

  def path_for(tag, path)
    case tag
    when :frontend
      "#{Phantom.processes[:frontend][:url]}#{path}"
    end
  end
end
