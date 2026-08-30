from __future__ import annotations

from pathlib import Path
import sys
import unittest

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(ROOT / "scripts"))

from generate_demo_data import generate_bookings
from staysignal.data import load_bookings
from staysignal.decisions import build_intervention_queue, simulate_overbooking
from staysignal.metrics import calculate_kpis
from staysignal.model import train_cancellation_model


class StaySignalTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.frame = generate_bookings(rows=1200, seed=7)

    def test_generated_data_contract(self) -> None:
        self.assertEqual(len(self.frame), 1200)
        self.assertFalse(self.frame["booking_id"].duplicated().any())
        self.assertTrue(self.frame["is_canceled"].isin([0, 1]).all())

    def test_kpi_reconciliation(self) -> None:
        kpis = calculate_kpis(self.frame)
        self.assertAlmostEqual(
            kpis["booked_revenue"],
            kpis["realized_revenue"] + kpis["revenue_at_risk"],
            places=6,
        )

    def test_temporal_model_and_decisions(self) -> None:
        result = train_cancellation_model(self.frame)
        self.assertGreater(result.metrics["roc_auc"], 0.65)
        self.assertEqual(len(result.scored_holdout), 240)
        queue = build_intervention_queue(result.scored_holdout)
        self.assertTrue(queue["expected_net_value"].is_monotonic_decreasing)
        simulation = simulate_overbooking(result.scored_holdout)
        self.assertEqual(len(simulation), 9)
        self.assertEqual(int(simulation["is_recommended"].sum()), 1)


if __name__ == "__main__":
    unittest.main()

