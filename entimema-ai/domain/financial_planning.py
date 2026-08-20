"""Canonical contracts for bounded, driver-based financial planning."""

from enum import StrEnum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, model_validator


class PlanningType(StrEnum):
    ANNUAL_BUDGET = "ANNUAL_BUDGET"
    ROLLING_FORECAST = "ROLLING_FORECAST"
    REFORECAST = "REFORECAST"
    SCENARIO_PLANNING = "SCENARIO_PLANNING"
    FINANCIAL_MODEL_BUILD = "FINANCIAL_MODEL_BUILD"


class ReportingFrequency(StrEnum):
    WEEKLY = "WEEKLY"
    MONTHLY = "MONTHLY"
    QUARTERLY = "QUARTERLY"
    ANNUAL = "ANNUAL"


class BusinessStructure(StrEnum):
    SERVICE = "SERVICE"
    TRADING = "TRADING"
    MANUFACTURING = "MANUFACTURING"
    OTHER = "OTHER"


class ModelModule(StrEnum):
    INPUTS = "INPUTS_ASSUMPTIONS"
    ACTUALS = "ACTUALS"
    REVENUE = "REVENUE"
    PERSONNEL = "PERSONNEL"
    OPEX = "OPEX"
    CAPEX = "CAPEX"
    WORKING_CAPITAL = "WORKING_CAPITAL"
    PL = "P_AND_L"
    CASH_FLOW = "CASH_FLOW"
    SCENARIOS = "SCENARIOS"
    KPIS = "KPIS"
    VALIDATION = "VALIDATION"


class PlanningHorizon(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    actual_start: str | None = None
    actual_through: str | None = None
    forecast_start: str
    forecast_end: str
    budget_periods: list[str] = Field(default_factory=list)
    rolling_periods: int | None = Field(default=None, gt=0)
    locked_actual_periods: list[str] = Field(default_factory=list)

    @model_validator(mode="after")
    def chronological(self):
        if self.forecast_start > self.forecast_end:
            raise ValueError("forecast_start must not follow forecast_end")
        if any(
            not self.forecast_start <= period <= self.forecast_end for period in self.budget_periods
        ):
            raise ValueError("budget period outside forecast horizon")
        return self


class ActualsBaseline(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    evidence_ids: list[str]
    historical_periods: list[str]
    latest_actual_period: str
    comparative_periods: list[str] = Field(default_factory=list)
    missing_periods: list[str] = Field(default_factory=list)
    seasonality_basis: str | None = None
    abnormal_items: list[str] = Field(default_factory=list)
    normalization_assumption_ids: list[str] = Field(default_factory=list)


class PlanningScope(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    horizon: PlanningHorizon
    currency: str = Field(min_length=3, max_length=3)
    frequency: ReportingFrequency
    organizational_scope: str
    legal_entities: list[str] = Field(default_factory=list)
    business_units: list[str] = Field(default_factory=list)
    products_segments: list[str] = Field(default_factory=list)
    cost_centres: list[str] = Field(default_factory=list)
    output_requirements: list[str]
    scenario_requirements: list[str] = Field(default_factory=list)
    actuals_baseline: ActualsBaseline | None = None


class DriverSpecification(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    driver_id: str
    name: str
    category: str
    formula: str
    input_driver_ids: list[str]
    output_metric: str
    unit: str
    evidence_ids: list[str] = Field(default_factory=list)
    assumption_ids: list[str] = Field(default_factory=list)
    dimensions: list[str] = Field(default_factory=list)


class PersonnelSpecification(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    enabled: bool = False
    opening_fte_driver: str | None = None
    hires_driver: str | None = None
    leavers_driver: str | None = None
    average_fte_formula: str | None = None
    salary_driver: str | None = None
    employer_charges_driver: str | None = None
    bonus_driver: str | None = None
    benefits_driver: str | None = None
    timing_basis: str | None = None


class CapexSpecification(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    enabled: bool = False
    category_driver: str | None = None
    acquisition_timing_driver: str | None = None
    purchase_value_driver: str | None = None
    useful_life_driver: str | None = None
    depreciation_method: str | None = None
    cash_payment_timing_driver: str | None = None


class WorkingCapitalSpecification(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    enabled: bool = False
    method: str | None = None
    dso_driver: str | None = None
    dpo_driver: str | None = None
    inventory_driver: str | None = None
    prepayments_driver: str | None = None
    accruals_driver: str | None = None
    tax_timing_driver: str | None = None
    opening_balance_evidence_ids: list[str] = Field(default_factory=list)


class CashFlowSpecification(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    enabled: bool = False
    opening_cash_evidence_id: str | None = None
    operating_cash_sources: list[str] = Field(default_factory=list)
    investing_cash_sources: list[str] = Field(default_factory=list)
    financing_cash_sources: list[str] = Field(default_factory=list)
    closing_cash_formula: str = "opening_cash + operating_cash + investing_cash + financing_cash"
    liquidity_diagnostics: bool = False


class ScenarioAssumption(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    assumption_id: str
    driver_id: str
    value: Any
    unit: str
    effective_period: str
    scenario: str
    source: str
    status: str


class ScenarioDefinition(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    scenario_id: str
    name: str
    assumption_ids: list[str]


class DependencyEdge(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    upstream: ModelModule
    downstream: ModelModule


class ModelValidationRequirement(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    validation_id: str
    category: str
    expression: str
    severity: str = "BLOCKING"


class PlanningUnknown(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    unknown_id: str
    variable: str
    why_needed: str
    blocking: bool
    proposed_source: str | None = None


class FinancialModelSpecification(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    model_id: str
    case_id: str
    case_version: int = Field(gt=0)
    planning_type: PlanningType
    scope: PlanningScope
    business_structure: BusinessStructure
    business_dimensions: list[str]
    modules: list[ModelModule]
    revenue_drivers: list[DriverSpecification]
    cost_drivers: list[DriverSpecification]
    personnel: PersonnelSpecification
    capex: CapexSpecification
    working_capital: WorkingCapitalSpecification
    cash_flow: CashFlowSpecification
    scenarios: list[ScenarioDefinition]
    assumptions: list[ScenarioAssumption]
    dependencies: list[DependencyEdge]
    validation_requirements: list[ModelValidationRequirement]
    source_evidence_ids: list[str]
    unresolved_issues: list[PlanningUnknown]


class PlanningExecutionRequest(BaseModel):
    """Structured canonical input; intentionally contains no conversation transcript."""

    model_config = ConfigDict(extra="forbid", frozen=True)
    case_id: str
    case_version: int = Field(gt=0)
    operational_problem: str
    planning_type: PlanningType
    planning_scope: PlanningScope
    business_structure: BusinessStructure
    requested_modules: list[ModelModule]
    revenue_drivers: list[DriverSpecification]
    cost_drivers: list[DriverSpecification]
    personnel: PersonnelSpecification = Field(default_factory=PersonnelSpecification)
    capex: CapexSpecification = Field(default_factory=CapexSpecification)
    working_capital: WorkingCapitalSpecification = Field(
        default_factory=WorkingCapitalSpecification
    )
    cash_flow: CashFlowSpecification = Field(default_factory=CashFlowSpecification)
    scenarios: list[ScenarioDefinition] = Field(default_factory=list)
    assumptions: list[ScenarioAssumption] = Field(default_factory=list)
    unresolved_unknowns: list[PlanningUnknown] = Field(default_factory=list)
    validated_evidence_ids: list[str]
    requested_outputs: list[str]
    business_dimensions: list[str] = Field(default_factory=list)


class PlanningStatus(StrEnum):
    MODEL_SPECIFICATION_READY = "MODEL_SPECIFICATION_READY"
    BLOCKED = "BLOCKED"


class PlanningAnalysisResult(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    status: PlanningStatus
    model_specification: FinancialModelSpecification | None
    findings: list[str]
    validation_results: list[str]
    additional_unknowns: list[PlanningUnknown]
    blockers: list[str]
    evidence_used: list[str]
    assumptions_used: list[str]
    case_version: int
    execution_provenance: dict[str, str]
