from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field

from domain.agents import AgentDomain


class MappingType(StrEnum):
    EQUIVALENT = "EQUIVALENT"
    PARTIAL_OVERLAP = "PARTIAL_OVERLAP"
    CAUSAL_LINK = "CAUSAL_LINK"
    INPUT_OUTPUT = "INPUT_OUTPUT"
    CONTEXTUAL_RELATION = "CONTEXTUAL_RELATION"
    NO_DIRECT_MAPPING = "NO_DIRECT_MAPPING"


class DefinitionRecord(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    term_id: str
    canonical_term: str
    domain: AgentDomain
    definition: str
    scope: str | None = None
    population: str | None = None
    horizon: str | None = None
    unit: str | None = None
    authority: str | None = None
    source: str
    effective_from: datetime | None = None


class TranslationRecord(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    translation_id: str
    source_term: str
    source_domain: AgentDomain
    source_definition_id: str
    target_term: str
    target_domain: AgentDomain
    target_definition_id: str | None = None
    mapping_type: MappingType
    preserved_scope: bool
    preserved_horizon: bool
    preserved_population: bool = True
    limitations: list[str] = Field(default_factory=list)
    admissible: bool


class DefinitionRegistry:
    def __init__(self, records: list[DefinitionRecord] | None = None) -> None:
        seeded = records or [
            DefinitionRecord(
                term_id="fin-cash-conversion",
                canonical_term="cash_conversion",
                domain=AgentDomain.FINANCE,
                definition="Operating conversion of working capital into cash",
                source="Entimema runtime",
            ),
            DefinitionRecord(
                term_id="cr-debt-service",
                canonical_term="debt_service_resilience",
                domain=AgentDomain.CREDIT_RISK,
                definition="Capacity to meet debt service over a specified horizon",
                source="Entimema runtime",
            ),
            DefinitionRecord(
                term_id="cr-default-model",
                canonical_term="default",
                domain=AgentDomain.CREDIT_RISK,
                definition="Model-scoped default target",
                authority="model",
                source="Entimema runtime",
            ),
            DefinitionRecord(
                term_id="fin-default-accounting",
                canonical_term="default",
                domain=AgentDomain.FINANCE,
                definition="Accounting-context credit deterioration concept",
                authority="accounting",
                source="Entimema runtime",
            ),
        ]
        self._records = {item.term_id: item for item in seeded}

    def get(self, term_id: str) -> DefinitionRecord | None:
        return self._records.get(term_id)

    def translate(
        self,
        source_id: str,
        target_id: str,
        mapping_type: MappingType,
    ) -> TranslationRecord:
        source = self._records[source_id]
        target = self._records[target_id]
        scope = bool(source.scope == target.scope) if source.scope or target.scope else True
        horizon = (
            bool(source.horizon == target.horizon) if source.horizon or target.horizon else True
        )
        population = (
            bool(source.population == target.population)
            if source.population or target.population
            else True
        )
        limitations = []
        if source.definition != target.definition and mapping_type is MappingType.EQUIVALENT:
            limitations.append("DEFINITION_MISMATCH")
        if not scope:
            limitations.append("SCOPE_LOSS")
        if not horizon:
            limitations.append("HORIZON_LOSS")
        if not population:
            limitations.append("POPULATION_LOSS")
        if source.unit and target.unit and source.unit != target.unit:
            limitations.append("UNIT_LOSS")
        if source.authority and target.authority and source.authority != target.authority:
            limitations.append("AUTHORITY_CONTEXT_LOSS")
        return TranslationRecord(
            translation_id=f"translation-{source_id}-{target_id}",
            source_term=source.canonical_term,
            source_domain=source.domain,
            source_definition_id=source.term_id,
            target_term=target.canonical_term,
            target_domain=target.domain,
            target_definition_id=target.term_id,
            mapping_type=mapping_type,
            preserved_scope=scope,
            preserved_horizon=horizon,
            preserved_population=population,
            limitations=limitations,
            admissible=not limitations,
        )
