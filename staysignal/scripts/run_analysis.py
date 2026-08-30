from __future__ import annotations

import argparse
import json
from pathlib import Path
import sys

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from staysignal.data import load_bookings
from staysignal.decisions import build_intervention_queue, simulate_overbooking
from staysignal.metrics import calculate_kpis, monthly_performance, segment_performance
from staysignal.model import train_cancellation_model


def records(frame: pd.DataFrame) -> list[dict]:
    return json.loads(frame.to_json(orient="records"))


def build_summary(data_path: Path) -> dict:
    frame = load_bookings(data_path)
    result = train_cancellation_model(frame)
    queue = build_intervention_queue(result.scored_holdout)
    simulation = simulate_overbooking(result.scored_holdout)
    recommended = simulation.loc[simulation["is_recommended"]].iloc[0]
    actionable = queue.loc[queue["expected_net_value"] > 0]
    return {
        "meta": {
            "project": "StaySignal",
            "data_type": "Synthetic demonstration data",
            "generated_rows": len(frame),
            "date_start": frame["arrival_date"].min().date().isoformat(),
            "date_end": frame["arrival_date"].max().date().isoformat(),
            "model_holdout_start": result.metrics["holdout_start"],
        },
        "kpis": calculate_kpis(frame),
        "model": result.metrics,
        "decisioning": {
            "actionable_bookings": len(actionable),
            "expected_net_value": float(actionable["expected_net_value"].sum()),
            "expected_revenue_saved": float(actionable["expected_revenue_saved"].sum()),
            "recommended_overbooking_buffer": int(recommended["buffer_rooms"]),
            "minimum_simulated_cost": float(recommended["total_cost"]),
        },
        "monthly": records(monthly_performance(frame)),
        "hotel_segments": records(segment_performance(frame, "hotel_type")),
        "market_segments": records(segment_performance(frame, "market_segment")),
        "lead_time_bands": records(
            segment_performance(
                frame.assign(
                    lead_time_band=pd.cut(
                        frame["lead_time"],
                        [-1, 14, 45, 90, 180, 366],
                        labels=["0–14", "15–45", "46–90", "91–180", "181+"],
                    ).astype(str)
                ),
                "lead_time_band",
            )
        ),
        "feature_importance": records(result.feature_importance.head(8)),
        "overbooking": records(simulation),
        "top_actions": records(
            queue.loc[queue["expected_net_value"] > 0, [
                "booking_id",
                "hotel_type",
                "market_segment",
                "arrival_date",
                "cancellation_probability",
                "booked_revenue",
                "expected_net_value",
                "recommended_action",
            ]].head(12)
        ),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default="data/sample_hotel_bookings.csv")
    parser.add_argument("--output", default="data/summary.json")
    args = parser.parse_args()
    summary = build_summary(Path(args.input))
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(f"Dashboard data written to {output}")
    print(json.dumps({"model": summary["model"], "decisioning": summary["decisioning"]}, indent=2))


if __name__ == "__main__":
    main()

