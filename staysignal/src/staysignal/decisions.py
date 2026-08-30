from __future__ import annotations

import numpy as np
import pandas as pd


def build_intervention_queue(
    scored: pd.DataFrame,
    success_rate: float = 0.22,
    intervention_cost: float = 18.0,
) -> pd.DataFrame:
    if not 0 <= success_rate <= 1 or intervention_cost < 0:
        raise ValueError("Invalid intervention assumptions")
    queue = scored.copy()
    queue["expected_revenue_saved"] = (
        queue["cancellation_probability"] * queue["booked_revenue"] * success_rate
    )
    queue["expected_net_value"] = queue["expected_revenue_saved"] - intervention_cost
    queue["recommended_action"] = np.select(
        [
            (queue["expected_net_value"] >= 80) & (queue["cancellation_probability"] >= 0.65),
            queue["expected_net_value"] > 0,
        ],
        ["Priority outreach", "Automated reminder"],
        default="No intervention",
    )
    return queue.sort_values("expected_net_value", ascending=False)


def simulate_overbooking(
    scored: pd.DataFrame,
    inventory_by_hotel: dict[str, int] | None = None,
    walk_cost: float = 420.0,
) -> pd.DataFrame:
    # Demo inventory is scaled to the synthetic portfolio's daily booking volume.
    # Real deployments should pass the property's sellable-room inventory.
    inventory = inventory_by_hotel or {"City Hotel": 8, "Resort Hotel": 6}
    data = scored.copy()
    data["arrival_day"] = pd.to_datetime(data["arrival_date"]).dt.date
    rows: list[dict[str, float | int | str]] = []
    for buffer_rooms in range(0, 9):
        empty_room_cost = 0.0
        guest_walk_cost = 0.0
        for (hotel, _), day in data.groupby(["hotel_type", "arrival_day"]):
            capacity = inventory.get(str(hotel), 120)
            accepted_bookings = day.sort_values("booking_date").head(capacity + buffer_rooms)
            expected_arrivals = float((1 - accepted_bookings["cancellation_probability"]).sum())
            empty_rooms = max(capacity - expected_arrivals, 0)
            walked_guests = max(expected_arrivals - capacity, 0)
            empty_room_cost += empty_rooms * float(accepted_bookings["adr"].mean())
            guest_walk_cost += walked_guests * walk_cost
        rows.append(
            {
                "buffer_rooms": buffer_rooms,
                "empty_room_cost": round(empty_room_cost, 2),
                "walk_cost": round(guest_walk_cost, 2),
                "total_cost": round(empty_room_cost + guest_walk_cost, 2),
            }
        )
    result = pd.DataFrame(rows)
    result["is_recommended"] = False
    result.loc[result["total_cost"].idxmin(), "is_recommended"] = True
    return result
