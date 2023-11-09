# frozen_string_literal: true

module WaitForPendingRequests
  def wait_for_pending_requests
    page.server.wait_for_pending_requests
    page.driver.browser.network.wait_for_idle
  end
end
