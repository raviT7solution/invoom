# frozen_string_literal: true

module AntdHelpers
  def fill_in_ant_picker(with:)
    node = fill_in with: with
    node.trigger(:focusout)
  end

  def fill_in_select(with:)
    find(".ant-select-selector").click
    page.document.find(".ant-select-item-option-content", exact_text: with).click
  end
end
