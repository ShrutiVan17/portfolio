-- StaySignal data-quality contract (PostgreSQL syntax)
-- Run before computing any KPI or training data extract.

SELECT
    COUNT(*) AS rows,
    COUNT(DISTINCT booking_id) AS unique_bookings,
    SUM(CASE WHEN arrival_date < booking_date THEN 1 ELSE 0 END) AS invalid_date_order,
    SUM(CASE WHEN adr <= 0 THEN 1 ELSE 0 END) AS nonpositive_adr,
    SUM(CASE WHEN nights <= 0 THEN 1 ELSE 0 END) AS nonpositive_nights,
    SUM(CASE WHEN is_canceled NOT IN (0, 1) OR is_canceled IS NULL THEN 1 ELSE 0 END) AS invalid_targets
FROM hotel_bookings;

SELECT booking_id, COUNT(*) AS duplicate_rows
FROM hotel_bookings
GROUP BY booking_id
HAVING COUNT(*) > 1;

SELECT
    MIN(arrival_date) AS first_arrival,
    MAX(arrival_date) AS last_arrival,
    COUNT(DISTINCT DATE_TRUNC('month', arrival_date)) AS covered_months
FROM hotel_bookings;

