# frozen_string_literal: true

class Discount < ApplicationRecord
  CHANNELS = ["all", "dine_in", "takeout", "delivery"].freeze
  REPEAT = Date::ABBR_DAYNAMES

  belongs_to :restaurant

  has_many :category_discounts, dependent: :destroy
  has_many :item_discounts, dependent: :destroy

  has_many :categories, through: :category_discounts
  has_many :items, through: :item_discounts

  enum :discount_on, [:item_wise, :bill_wise]
  enum :discount_type, [:percentage, :flat, :bogo, :combo, :compoff, :coupons]

  validates :auto_apply, inclusion: [true, false]
  validates :black_out_dates, presence: true, if: proc { black_out_dates.nil? }
  validates :capping, presence: true
  validates :category_ids, absence: true, if: :bill_wise?
  validates :channels, presence: true
  validates :clubbed, inclusion: [true, false]
  validates :discount_on, presence: true
  validates :discount_type, presence: true
  validates :end_date_time, absence: true, unless: :auto_apply?
  validates :end_date_time, presence: true, if: :auto_apply?
  validates :item_ids, absence: true, if: :bill_wise?
  validates :name, presence: true
  validates :repeat, length: { is: 0 }, unless: :auto_apply?
  validates :repeat, length: { minimum: 1 }, if: :auto_apply?
  validates :start_date_time, absence: true, unless: :auto_apply?
  validates :start_date_time, presence: true, if: :auto_apply?
  validates :threshold, presence: true
  validates :value, presence: true
  validates :visible, inclusion: [true, false]
end
