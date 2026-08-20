"""Export the authoritative Pydantic contracts consumed across the HTTP boundary."""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from api.schemas import LiveMessageRequest, LiveMessageResponse
from domain.problem_state import ProblemState
from live.commands import ApplyInterpretedTurn

ROOT = Path(__file__).resolve().parents[2]
schemas = {
    model.__name__: model.model_json_schema()
    for model in (ProblemState, ApplyInterpretedTurn, LiveMessageRequest, LiveMessageResponse)
}
(ROOT / "contracts").mkdir(exist_ok=True)
(ROOT / "contracts" / "concierge-runtime.schema.json").write_text(
    json.dumps(schemas, indent=2, sort_keys=True) + "\n", encoding="utf-8"
)
