WITH invoice_counts AS (
  SELECT
    i.booking_id,
    COUNT(i.id) AS count
  FROM invoices i
  GROUP BY i.booking_id
),
subtotals AS (
  SELECT
    i.id,
    SUM(iis.discounted_amount) AS subtotal,
    SUM(iis.discounted_amount * (ti.gst + ti.hst + ti.pst + ti.rst + ti.qst + ti.cst) / 100.0) AS total_tax
  FROM invoices i
  JOIN invoice_items ii ON ii.invoice_id = i.id
  JOIN invoice_item_summaries iis ON iis.invoice_item_id = ii.id
  JOIN ticket_items ti ON ti.id = ii.ticket_item_id
  GROUP BY i.id
),
total_service_charges AS (
  SELECT
    i.id,
    SUM(
      (
        CASE
          WHEN isc.charge_type = 0 THEN (s.subtotal * isc.value / 100.0)
          WHEN isc.charge_type = 1 THEN (isc.value / ic.count)
          ELSE 0.0
        END
      ) * (1 + (isc.gst + isc.hst + isc.pst + isc.rst + isc.qst + isc.cst) / 100.0)
    ) AS total_service_charge
  FROM invoices i
  JOIN invoice_service_charges isc ON isc.invoice_id = i.id
  JOIN subtotals s ON s.id = i.id
  JOIN invoice_counts ic ON ic.booking_id = i.booking_id
  GROUP BY i.id
)
SELECT
  i.id AS invoice_id,
  s.subtotal,
  s.total_tax,
  COALESCE(sc.total_service_charge, 0.0),
  (s.subtotal + s.total_tax + COALESCE(sc.total_service_charge, 0.0)) AS total
FROM invoices i
JOIN subtotals s ON s.id = i.id
LEFT JOIN total_service_charges sc ON sc.id = i.id
