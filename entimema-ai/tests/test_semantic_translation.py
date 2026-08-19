from domain.agents import AgentDomain
from orchestrator.translation import DefinitionRecord, DefinitionRegistry, MappingType


def test_or_014_finance_risk_mapping_is_not_equivalent() -> None:
    result = DefinitionRegistry().translate(
        "fin-cash-conversion", "cr-debt-service", MappingType.CAUSAL_LINK
    )
    assert result.mapping_type is MappingType.CAUSAL_LINK
    assert result.mapping_type is not MappingType.EQUIVALENT


def test_or_015_definition_mismatch_blocks_semantic_flattening() -> None:
    registry = DefinitionRegistry()
    result = registry.translate("fin-cash-conversion", "cr-debt-service", MappingType.EQUIVALENT)
    assert not result.admissible
    assert "DEFINITION_MISMATCH" in result.limitations


def test_default_definitions_remain_context_specific() -> None:
    registry = DefinitionRegistry()
    model = registry.get("cr-default-model")
    accounting = registry.get("fin-default-accounting")
    assert model and accounting
    assert model.canonical_term == accounting.canonical_term == "default"
    assert model.definition != accounting.definition
    assert model.domain is AgentDomain.CREDIT_RISK


def test_semantic_loss_guard_preserves_authority_context() -> None:
    registry = DefinitionRegistry(
        [
            DefinitionRecord(
                term_id="a",
                canonical_term="default",
                domain=AgentDomain.CREDIT_RISK,
                definition="D",
                authority="model",
                source="x",
            ),
            DefinitionRecord(
                term_id="b",
                canonical_term="default",
                domain=AgentDomain.CREDIT_RISK,
                definition="D",
                authority="regulatory",
                source="x",
            ),
        ]
    )
    result = registry.translate("a", "b", MappingType.EQUIVALENT)
    assert not result.admissible
    assert "AUTHORITY_CONTEXT_LOSS" in result.limitations
