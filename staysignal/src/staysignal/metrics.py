from __future__ import annotations

import pandas as pd


def enrich_revenue(frame: pd.DataFrame) -> pd.DataFrame:
    result = frame.copy()
    result["booked_revenue"] = result["adr"] * result["nights"]
    result["realized_revenue"] = result["booked_revenue"] * (1 - result["is_canceled"])
    result["revenue_at_risk"] = result["booked_revenue"] * result["is_canceled"]
    return result


def calculate_kpis(frame: pd.DataFrame) -> dict[str, float | int]:
    data = enrich_revenue(frame)
    total_bookings = len(data)
    canceled = int(data["is_canceled"].sum())
    booked_revenue = float(data["booked_revenue"].sum())
    realized_revenue = float(data["realized_revenue"].sum())
    return {
        "bookings": total_bookings,
        "canceled_bookings": canceled,
        "cancellation_rate": canceled / total_bookings if total_bookings else 0.0,
        "booked_revenue": booked_revenue,
        "realized_revenue": realized_revenue,
        "revenue_at_risk": booked_revenue - realized_revenue,
        "adr": float(data["adr"].mean()) if total_bookings else 0.0,
        "average_lead_time": float(data["lead_time"].mean()) if total_bookings else 0.0,
    }


def monthly_performance(frame: pd.DataFrame) -> pd.DataFrame:
    data = enrich_revenue(frame)
    data["month"] = data["arrival_date"].dt.to_period("M").astype(str)
    grouped = data.groupby("month", as_index=False).agg(
        bookings=("booking_id", "count"),
        cancellations=("is_canceled", "sum"),
        booked_revenue=("booked_revenue", "sum"),
        realized_revenue=("realized_revenue", "sum"),
    )
    grouped["cancellation_rate"] = grouped["cancellations"] / grouped["bookings"]
    grouped["revenue_at_risk"] = grouped["booked_revenue"] - grouped["realized_revenue"]
    return grouped


def segment_performance(frame: pd.DataFrame, dimension: str) -> pd.DataFrame:
    if dimension not in frame.columns:
        raise ValueError(f"Unknown segment: {dimension}")
    data = enrich_revenue(frame)
    grouped = data.groupby(dimension, as_index=False).agg(
        bookings=("booking_id", "count"),
        cancellations=("is_canceled", "sum"),
        booked_revenue=("booked_revenue", "sum"),
        realized_revenue=("realized_revenue", "sum"),
        adr=("adr", "mean"),
    )
    grouped["cancellation_rate"] = grouped["cancellations"] / grouped["bookings"]
    grouped["revenue_at_risk"] = grouped["booked_revenue"] - grouped["realized_revenue"]
    return grouped.sort_values("revenue_at_risk", ascending=False)

