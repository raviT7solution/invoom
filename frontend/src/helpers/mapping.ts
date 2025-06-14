import { BookingType, PaymentModeEnum } from "../api/base";

export const UOM: { [key: string]: string } = {
  tonne: "Tonne",
  kilograms: "Kilograms",
  grams: "Grams",
  decagram: "Decagram",
  decigram: "Decigram",
  centigram: "Centigram",
  milligram: "Milligram",
  kilolitre: "Kilolitre",
  hectolitre: "Hectolitre",
  decalitre: "Decalitre",
  litre: "Litre",
  decilitre: "Decilitre",
  centilitre: "Centilitre",
  millilitre: "Millilitre",
  pound: "Pound",
  ounce: "Ounce",
  grain: "Grain",
  item: "Item",
};

export const UOM_ABBREVIATION: { [key: string]: string } = {
  tonne: "T",
  kilograms: "kg",
  grams: "g",
  decagram: "dag",
  decigram: "dg",
  centigram: "cg",
  milligram: "mg",
  kilolitre: "kL",
  hectolitre: "hL",
  decalitre: "daL",
  litre: "L",
  decilitre: "dL",
  centilitre: "cL",
  millilitre: "mL",
  pound: "lb",
  ounce: "oz",
  grain: "gr",
  item: "",
};

export const PAYMENT_MODES: Record<PaymentModeEnum, string> = {
  card: "Card",
  cash: "Cash",
  cheque: "Cheque",
  door_dash: "Door dash",
  gift_card: "Gift card",
  other: "Other",
  skip_the_dishes: "Skip the dishes",
  uber_eats: "Uber eats",
  void: "Void",
};

export const BOOKING_TYPES: Record<BookingType, string> = {
  delivery: "Delivery",
  dine_in: "Dine-in",
  takeout: "Takeout",
};
