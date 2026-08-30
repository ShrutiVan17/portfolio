from __future__ import annotations

import argparse
from pathlib import Path
import sys

import numpy as np
import pandas as pd


def sigmoid(values: np.ndarray) -> np.ndarray:
    return 1 / (1 + np.exp(-values))


def generate_bookings(rows: int = 6000, seed: int = 42) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    booking_dates = pd.to_datetime("2025-01-01") + pd.to_timedelta(
        rng.integers(0, 455, rows), unit="D"
    )
    lead_time = np.clip(rng.gamma(2.2, 34, rows).round().astype(int), 0, 365)
    arrival_dates = booking_dates + pd.to_timedelta(lead_time, unit="D")
    hotel_type = rng.choice(["City Hotel", "Resort Hotel"], rows, p=[0.64, 0.36])
    market_segment = rng.choice(
        ["Online TA", "Offline TA", "Direct", "Corporate", "Groups"],
        rows,
        p=[0.43, 0.18, 0.22, 0.10, 0.07],
    )
    channel = np.where(
        market_segment == "Online TA",
        "OTA",
        np.where(market_segment == "Direct", "Direct", "Partner"),
    )
    customer_type = rng.choice(
        ["Transient", "Transient-Party", "Contract", "Group"],
        rows,
        p=[0.69, 0.21, 0.06, 0.04],
    )
    deposit_type = rng.choice(["No Deposit", "Refundable", "Non Refund"], rows, p=[0.84, 0.06, 0.10])
    room_type = rng.choice(["Standard", "Deluxe", "Suite", "Family"], rows, p=[0.57, 0.25, 0.08, 0.10])
    country_group = rng.choice(["Domestic", "Europe", "Americas", "Asia-Pacific", "Other"], rows, p=[0.38, 0.27, 0.18, 0.12, 0.05])
    nights = np.clip(rng.poisson(np.where(hotel_type == "Resort Hotel", 4.0, 2.4)) + 1, 1, 14)
    adults = rng.choice([1, 2, 3, 4], rows, p=[0.18, 0.66, 0.12, 0.04])
    children = rng.choice([0, 1, 2, 3], rows, p=[0.72, 0.16, 0.10, 0.02])
    repeated = rng.binomial(1, 0.09, rows)
    previous_cancellations = np.where(repeated == 1, rng.poisson(0.25, rows), 0)
    previous_completed = np.where(repeated == 1, rng.poisson(2.3, rows), 0)
    special_requests = np.clip(rng.poisson(0.8, rows), 0, 5)
    booking_changes = np.clip(rng.poisson(0.25, rows), 0, 4)
    parking = rng.binomial(1, np.where(hotel_type == "Resort Hotel", 0.18, 0.07))
    month = pd.Series(arrival_dates).dt.month.to_numpy()
    peak = np.isin(month, [6, 7, 8, 12]).astype(int)
    adr = (
        105
        + (hotel_type == "Resort Hotel") * 32
        + (room_type == "Deluxe") * 38
        + (room_type == "Suite") * 92
        + (room_type == "Family") * 54
        + peak * 24
        + rng.normal(0, 18, rows)
    )
    adr = np.clip(adr, 55, 420).round(2)

    logit = (
        -1.75
        + 0.0080 * lead_time
        + 0.75 * (market_segment == "Online TA")
        + 0.55 * (market_segment == "Groups")
        + 0.85 * (deposit_type == "No Deposit")
        - 1.25 * (deposit_type == "Non Refund")
        + 0.72 * (previous_cancellations > 0)
        - 0.38 * special_requests
        - 0.90 * repeated
        + 0.28 * peak
        + 0.20 * (adr > 190)
        + rng.normal(0, 0.55, rows)
    )
    cancellation_probability = sigmoid(logit)
    is_canceled = rng.binomial(1, cancellation_probability)

    return pd.DataFrame(
        {
            "booking_id": [f"BK-{i:06d}" for i in range(1, rows + 1)],
            "booking_date": booking_dates,
            "arrival_date": arrival_dates,
            "hotel_type": hotel_type,
            "lead_time": lead_time,
            "nights": nights,
            "adults": adults,
            "children": children,
            "market_segment": market_segment,
            "distribution_channel": channel,
            "customer_type": customer_type,
            "deposit_type": deposit_type,
            "room_type": room_type,
            "country_group": country_group,
            "previous_cancellations": previous_cancellations,
            "previous_bookings_not_canceled": previous_completed,
            "booking_changes": booking_changes,
            "adr": adr,
            "required_car_parking_spaces": parking,
            "special_requests": special_requests,
            "is_repeated_guest": repeated,
            "is_canceled": is_canceled,
        }
    ).sort_values("arrival_date")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--rows", type=int, default=6000)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--output", default="data/sample_hotel_bookings.csv")
    args = parser.parse_args()
    destination = Path(args.output)
    destination.parent.mkdir(parents=True, exist_ok=True)
    generate_bookings(args.rows, args.seed).to_csv(destination, index=False)
    print(f"Generated {args.rows:,} transparent synthetic bookings at {destination}")


if __name__ == "__main__":
    main()

