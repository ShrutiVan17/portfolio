from __future__ import annotations

from pathlib import Path

import pandas as pd


REQUIRED_COLUMNS = {
    "booking_id",
    "booking_date",
    "arrival_date",
    "hotel_type",
    "lead_time",
    "nights",
    "market_segment",
    "distribution_channel",
    "customer_type",
    "deposit_type",
    "adr",
    "special_requests",
    "previous_cancellations",
    "is_repeated_guest",
    "is_canceled",
}


def load_bookings(path: str | Path) -> pd.DataFrame:
    frame = pd.read_csv(path, parse_dates=["booking_date", "arrival_date"])
    missing = REQUIRED_COLUMNS.difference(frame.columns)
    if missing:
        raise ValueError(f"Missing required columns: {sorted(missing)}")
    if frame["booking_id"].duplicated().any():
        raise ValueError("booking_id must be unique")
    if (frame["arrival_date"] < frame["booking_date"]).any():
        raise ValueError("arrival_date cannot precede booking_date")
    if (frame["nights"] <= 0).any() or (frame["adr"] <= 0).any():
        raise ValueError("nights and adr must be positive")
    if not frame["is_canceled"].isin([0, 1]).all():
        raise ValueError("is_canceled must contain only 0 and 1")
    return frame.sort_values("arrival_date").reset_index(drop=True)

