# frozen_string_literal: true

class ItemAddon < ApplicationRecord
  belongs_to :addon
  belongs_to :item
end
