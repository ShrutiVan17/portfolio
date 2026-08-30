-- Decision-ready hotel KPIs at monthly grain (PostgreSQL syntax)

WITH booking_value AS (
    SELECT
        booking_id,
        DATE_TRUNC('month', arrival_date) AS arrival_month,
        hotel_type,
        market_segment,
        is_canceled,
        adr,
        nights,
        adr * nights AS booked_revenue
    FROM hotel_bookings
),
monthly AS (
    SELECT
        arrival_month,
        COUNT(*) AS bookings,
        SUM(is_canceled) AS cancellations,
        SUM(booked_revenue) AS booked_revenue,
        SUM(CASE WHEN is_canceled = 0 THEN booked_revenue ELSE 0 END) AS realized_revenue,
        SUM(CASE WHEN is_canceled = 1 THEN booked_revenue ELSE 0 END) AS revenue_at_risk
    FROM booking_value
    GROUP BY arrival_month
)
SELECT
    arrival_month,
    bookings,
    cancellations,
    cancellations::DECIMAL / NULLIF(bookings, 0) AS cancellation_rate,
    booked_revenue,
    realized_revenue,
    revenue_at_risk
FROM monthly
ORDER BY arrival_month;

