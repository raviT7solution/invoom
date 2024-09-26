WITH ticket_item_discounts AS (
  SELECT
    ii.id AS invoice_item_id,
    -- Apply TicketItem discount
    CASE
      WHEN ad.discount_type = 0 THEN (ii.price * (1 - ad.value / 100.0))
      WHEN ad.discount_type = 1 THEN (ii.price - (ad.value * (ii.price / ti.price)))
      ELSE ii.price
    END AS ticket_item_discounted_amount
  FROM invoice_items ii
  JOIN ticket_items ti ON ti.id = ii.ticket_item_id
  LEFT JOIN applied_discounts ad ON ad.discountable_type = 'TicketItem' AND ad.discountable_id = ti.id
),
booking_sub_totals AS (
  -- Calculate booking subtotal based on TicketItem discounted amount
  SELECT
    i.booking_id AS id,
    SUM(tid.ticket_item_discounted_amount) AS booking_sub_total
  FROM invoices i
  JOIN invoice_items ii ON ii.invoice_id = i.id
  JOIN ticket_item_discounts tid ON tid.invoice_item_id = ii.id
  GROUP BY i.booking_id
),
booking_discounts AS (
  SELECT
    ii.id,
    -- Apply Booking discount to the already discounted TicketItem amount
    CASE
      WHEN ad.discount_type = 0 THEN (tid.ticket_item_discounted_amount * (1 - ad.value / 100.0))
      WHEN ad.discount_type = 1 THEN (tid.ticket_item_discounted_amount - (ad.value * (tid.ticket_item_discounted_amount / bst.booking_sub_total)))
      ELSE tid.ticket_item_discounted_amount
    END AS discounted_amount
  FROM invoice_items ii
  JOIN ticket_item_discounts tid ON tid.invoice_item_id = ii.id
  JOIN invoices i ON i.id = ii.invoice_id
  JOIN booking_sub_totals bst ON bst.id = i.booking_id
  LEFT JOIN applied_discounts ad ON ad.discountable_type = 'Booking' AND ad.discountable_id = i.booking_id
)
SELECT
  ii.id AS invoice_item_id,
  bd.discounted_amount
FROM invoice_items ii
JOIN booking_discounts bd ON bd.id = ii.id;
