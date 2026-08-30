# Data contract

StaySignal does not commit a third-party hotel dataset or present synthetic outputs as real hotel performance.

Run `python scripts/generate_demo_data.py` to create a deterministic, transparent synthetic booking table for demonstration and automated tests. The generator documents the distributions and target-generation logic directly in code.

To use another dataset, map it to one row per booking with the required fields validated in `src/staysignal/data.py`. The familiar public `hotel_bookings.csv` schema can be adapted by adding a stable `booking_id`, deriving `booking_date = arrival_date - lead_time`, and mapping total stay nights to `nights`.

The committed `summary.json` contains aggregated synthetic demonstration outputs used by the GitHub Pages dashboard. It contains no customer or personal data.

