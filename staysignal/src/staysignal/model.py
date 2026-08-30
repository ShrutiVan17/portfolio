from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance
from sklearn.metrics import average_precision_score, brier_score_loss, roc_auc_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


NUMERIC_FEATURES = [
    "lead_time",
    "nights",
    "adults",
    "children",
    "adr",
    "special_requests",
    "previous_cancellations",
    "previous_bookings_not_canceled",
    "booking_changes",
    "required_car_parking_spaces",
    "is_repeated_guest",
]

CATEGORICAL_FEATURES = [
    "hotel_type",
    "market_segment",
    "distribution_channel",
    "customer_type",
    "deposit_type",
    "room_type",
    "country_group",
]


@dataclass
class ModelResult:
    pipeline: Pipeline
    scored_holdout: pd.DataFrame
    metrics: dict[str, float | int | str]
    feature_importance: pd.DataFrame


def train_cancellation_model(frame: pd.DataFrame, holdout_fraction: float = 0.2) -> ModelResult:
    if not 0.1 <= holdout_fraction <= 0.4:
        raise ValueError("holdout_fraction must be between 0.1 and 0.4")
    ordered = frame.sort_values("arrival_date").reset_index(drop=True)
    split_index = int(len(ordered) * (1 - holdout_fraction))
    train = ordered.iloc[:split_index].copy()
    holdout = ordered.iloc[split_index:].copy()
    if train["is_canceled"].nunique() < 2 or holdout["is_canceled"].nunique() < 2:
        raise ValueError("Both temporal partitions require canceled and retained bookings")

    transformer = ColumnTransformer(
        [
            ("numeric", StandardScaler(), NUMERIC_FEATURES),
            ("categorical", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL_FEATURES),
        ]
    )
    classifier = RandomForestClassifier(
        n_estimators=240,
        min_samples_leaf=8,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
    )
    pipeline = Pipeline([("features", transformer), ("model", classifier)])
    feature_columns = NUMERIC_FEATURES + CATEGORICAL_FEATURES
    pipeline.fit(train[feature_columns], train["is_canceled"])
    probabilities = pipeline.predict_proba(holdout[feature_columns])[:, 1]

    scored = holdout.copy()
    scored["cancellation_probability"] = probabilities
    scored["booked_revenue"] = scored["adr"] * scored["nights"]

    permutation = permutation_importance(
        pipeline,
        holdout[feature_columns],
        holdout["is_canceled"],
        scoring="roc_auc",
        n_repeats=5,
        random_state=42,
        n_jobs=-1,
    )
    importance = pd.DataFrame(
        {"feature": feature_columns, "importance": permutation.importances_mean}
    ).sort_values("importance", ascending=False)

    cutoff = holdout["arrival_date"].min().date().isoformat()
    metrics = {
        "roc_auc": float(roc_auc_score(holdout["is_canceled"], probabilities)),
        "average_precision": float(average_precision_score(holdout["is_canceled"], probabilities)),
        "brier_score": float(brier_score_loss(holdout["is_canceled"], probabilities)),
        "train_rows": len(train),
        "holdout_rows": len(holdout),
        "holdout_start": cutoff,
    }
    return ModelResult(pipeline, scored, metrics, importance)

