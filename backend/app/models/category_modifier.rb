# frozen_string_literal: true

class CategoryModifier < ApplicationRecord
  belongs_to :category
  belongs_to :modifier
end
