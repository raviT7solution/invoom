# frozen_string_literal: true

module AntdHelpers
  def fill_in_select(with:)
    find(".ant-select-selector").click
    page.document.find(".ant-select-item-option-content", text: with).click
  end
end
