from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ComparableObject(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    id: str
    definition: str | None = None
    unit: str | None = None
    period_start: datetime | None = None
    period_end: datetime | None = None
    scope: str | None = None
    basis: str | None = None


class CompatibilityAssessment(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    object_a_id: str
    object_b_id: str
    definition_match: bool
    unit_match: bool
    period_match: bool
    scope_match: bool
    basis_match: bool
    admissible: bool
    issues: list[str] = Field(default_factory=list)


def assess_compatibility(a: ComparableObject, b: ComparableObject) -> CompatibilityAssessment:
    dimensions = {
        "definition": bool(a.definition and b.definition and a.definition == b.definition),
        "unit": bool(a.unit and b.unit and a.unit == b.unit),
        "period": bool(
            a.period_start
            and a.period_end
            and b.period_start
            and b.period_end
            and a.period_start == b.period_start
            and a.period_end == b.period_end
        ),
        "scope": bool(a.scope and b.scope and a.scope == b.scope),
        "basis": bool(a.basis and b.basis and a.basis == b.basis),
    }
    issues = [f"{name.upper()}_MISMATCH_OR_UNRESOLVED" for name, ok in dimensions.items() if not ok]
    return CompatibilityAssessment(
        object_a_id=a.id,
        object_b_id=b.id,
        definition_match=dimensions["definition"],
        unit_match=dimensions["unit"],
        period_match=dimensions["period"],
        scope_match=dimensions["scope"],
        basis_match=dimensions["basis"],
        admissible=all(dimensions.values()),
        issues=issues,
    )


class ScopeApplicability(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    population_match: bool
    horizon_match: bool
    domain_match: bool
    method_match: bool

    @property
    def admissible(self) -> bool:
        return all(
            (self.population_match, self.horizon_match, self.domain_match, self.method_match)
        )
