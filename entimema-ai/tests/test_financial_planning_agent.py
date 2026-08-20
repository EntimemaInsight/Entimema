from agents.finance import FinancialPlanningAgent
from domain.financial_planning import (
    ActualsBaseline,
    BusinessStructure,
    CapexSpecification,
    CashFlowSpecification,
    DriverSpecification,
    ModelModule,
    PersonnelSpecification,
    PlanningExecutionRequest,
    PlanningHorizon,
    PlanningScope,
    PlanningStatus,
    PlanningType,
    ReportingFrequency,
    ScenarioAssumption,
    ScenarioDefinition,
    WorkingCapitalSpecification,
)
from orchestrator.controller import CentralOrchestrator
from orchestrator.routing import OrchestrationRequest
from tests.agent_helpers import state, validation


def driver(identifier, name, formula, inputs, output, *, category="OPERATING"):
    return DriverSpecification(
        driver_id=identifier,
        name=name,
        category=category,
        formula=formula,
        input_driver_ids=inputs,
        output_metric=output,
        unit="EUR",
        evidence_ids=["ev-actuals"],
    )


def request(**updates):
    horizon = PlanningHorizon(
        actual_start="2025-01",
        actual_through="2026-12",
        forecast_start="2027-01",
        forecast_end="2027-12",
        budget_periods=[f"2027-{month:02d}" for month in range(1, 13)],
    )
    scope = PlanningScope(
        horizon=horizon,
        currency="EUR",
        frequency=ReportingFrequency.MONTHLY,
        organizational_scope="Group",
        legal_entities=["ServiceCo"],
        business_units=["Consulting"],
        output_requirements=["P&L", "Cash Flow"],
        scenario_requirements=["Base", "Upside", "Downside"],
        actuals_baseline=ActualsBaseline(
            evidence_ids=["ev-actuals"],
            historical_periods=["2025", "2026"],
            latest_actual_period="2026-12",
            comparative_periods=["2025"],
            seasonality_basis="validated contract timing",
            abnormal_items=["one-off relocation"],
            normalization_assumption_ids=["a-normalize"],
        ),
    )
    revenue = driver(
        "contracts",
        "Contract revenue",
        "active_contracts * contract_value",
        ["active_contracts", "contract_value"],
        "revenue",
    )
    cost = driver(
        "delivery-cost",
        "Delivery cost",
        "delivery_volume * unit_cost",
        ["delivery_volume", "unit_cost"],
        "variable_cost",
    )
    assumptions = [
        ScenarioAssumption(
            assumption_id=f"a-{name.lower()}",
            driver_id="contracts",
            value=value,
            unit="contracts",
            effective_period="2027-01",
            scenario=name,
            source="client-admitted assumption",
            status="ADMITTED",
        )
        for name, value in (("Base", 100), ("Upside", 110), ("Downside", 90))
    ]
    values = dict(
        case_id="case-7a",
        case_version=7,
        operational_problem="Build the approved 2027 plan",
        planning_type=PlanningType.ANNUAL_BUDGET,
        planning_scope=scope,
        business_structure=BusinessStructure.SERVICE,
        requested_modules=[
            ModelModule.INPUTS,
            ModelModule.ACTUALS,
            ModelModule.REVENUE,
            ModelModule.PERSONNEL,
            ModelModule.OPEX,
            ModelModule.PL,
            ModelModule.SCENARIOS,
            ModelModule.VALIDATION,
        ],
        revenue_drivers=[revenue],
        cost_drivers=[cost],
        personnel=PersonnelSpecification(
            enabled=True,
            opening_fte_driver="opening_fte",
            hires_driver="hires",
            leavers_driver="leavers",
            average_fte_formula="opening_fte + time_weighted_hires - time_weighted_leavers",
            salary_driver="average_salary",
            employer_charges_driver="employer_charges",
            bonus_driver="bonus",
            benefits_driver="benefits",
            timing_basis="hire and leave dates",
        ),
        scenarios=[
            ScenarioDefinition(
                scenario_id=name.lower(), name=name, assumption_ids=[f"a-{name.lower()}"]
            )
            for name in ("Base", "Upside", "Downside")
        ],
        assumptions=assumptions,
        validated_evidence_ids=["ev-actuals"],
        requested_outputs=["management budget"],
        business_dimensions=["contract", "business_unit"],
    )
    values.update(updates)
    return PlanningExecutionRequest(**values)


def test_basic_service_budget_is_driver_based_and_scenario_controlled():
    result = FinancialPlanningAgent().analyse(request(), trace_id="trace-basic")
    assert result.status is PlanningStatus.MODEL_SPECIFICATION_READY
    spec = result.model_specification
    assert spec is not None
    assert spec.planning_type is PlanningType.ANNUAL_BUDGET
    assert spec.scope.horizon.budget_periods[-1] == "2027-12"
    assert spec.scope.actuals_baseline.abnormal_items == ["one-off relocation"]
    assert spec.revenue_drivers[0].formula == "active_contracts * contract_value"
    assert spec.personnel.average_fte_formula.startswith("opening_fte")
    assert {item.name for item in spec.scenarios} == {"Base", "Upside", "Downside"}
    assert all(item.source == "client-admitted assumption" for item in spec.assumptions)
    assert result.execution_provenance["case_version"] == "7"


def test_manufacturing_architecture_preserves_capex_working_capital_and_cash_dependencies():
    manufacturing = request(
        business_structure=BusinessStructure.MANUFACTURING,
        revenue_drivers=[
            driver(
                "sales",
                "Sales",
                "production_volume * selling_price",
                ["production_volume", "selling_price"],
                "revenue",
            )
        ],
        cost_drivers=[
            driver(
                "materials",
                "Materials",
                "production_volume * bom_consumption * input_price",
                ["production_volume", "bom_consumption", "input_price"],
                "material_cost",
            )
        ],
        requested_modules=[
            ModelModule.INPUTS,
            ModelModule.ACTUALS,
            ModelModule.REVENUE,
            ModelModule.OPEX,
            ModelModule.CAPEX,
            ModelModule.WORKING_CAPITAL,
            ModelModule.PL,
            ModelModule.CASH_FLOW,
            ModelModule.KPIS,
            ModelModule.VALIDATION,
        ],
        capex=CapexSpecification(
            enabled=True,
            category_driver="capex_category",
            acquisition_timing_driver="acquisition_month",
            purchase_value_driver="purchase_value",
            useful_life_driver="useful_life",
            depreciation_method="straight-line",
            cash_payment_timing_driver="payment_month",
        ),
        working_capital=WorkingCapitalSpecification(
            enabled=True,
            method="inventory movement",
            dso_driver="dso",
            dpo_driver="dpo",
            inventory_driver="inventory_units",
            opening_balance_evidence_ids=["ev-actuals"],
        ),
        cash_flow=CashFlowSpecification(
            enabled=True,
            opening_cash_evidence_id="ev-actuals",
            operating_cash_sources=["P_AND_L", "WORKING_CAPITAL"],
            investing_cash_sources=["CAPEX"],
            liquidity_diagnostics=True,
        ),
        scenarios=[],
        assumptions=[],
    )
    result = FinancialPlanningAgent().analyse(manufacturing, trace_id="trace-mfg")
    spec = result.model_specification
    assert spec is not None and "bom_consumption" in spec.cost_drivers[0].formula
    edges = {(edge.upstream, edge.downstream) for edge in spec.dependencies}
    assert (ModelModule.CAPEX, ModelModule.CASH_FLOW) in edges
    assert (ModelModule.WORKING_CAPITAL, ModelModule.CASH_FLOW) in edges
    assert spec.cash_flow.closing_cash_formula.startswith("opening_cash")


def test_rolling_forecast_has_locked_actuals_and_explicit_rolling_horizon():
    base = request()
    rolling_horizon = base.planning_scope.horizon.model_copy(
        update={
            "actual_through": "2026-08",
            "forecast_start": "2026-09",
            "forecast_end": "2027-08",
            "budget_periods": [],
            "rolling_periods": 12,
            "locked_actual_periods": [f"2026-{month:02d}" for month in range(1, 9)],
        }
    )
    rolling_scope = base.planning_scope.model_copy(update={"horizon": rolling_horizon})
    result = FinancialPlanningAgent().analyse(
        request(planning_type=PlanningType.ROLLING_FORECAST, planning_scope=rolling_scope),
        trace_id="trace-rolling",
    )
    assert result.model_specification.scope.horizon.rolling_periods == 12
    assert result.model_specification.scope.horizon.locked_actual_periods[-1] == "2026-08"


def test_missing_revenue_driver_and_opening_cash_are_blockers_not_zero_or_growth_defaults():
    result = FinancialPlanningAgent().analyse(
        request(
            revenue_drivers=[],
            scenarios=[],
            assumptions=[],
            cash_flow=CashFlowSpecification(enabled=True),
        ),
        trace_id="trace-blocked",
    )
    assert result.status is PlanningStatus.BLOCKED
    assert result.model_specification is None
    assert "CRITICAL_REVENUE_LOGIC_UNDEFINED" in result.blockers
    assert "OPENING_CASH_UNDEFINED" in result.blockers
    assert {item.variable for item in result.additional_unknowns} >= {
        "revenue driver architecture",
        "opening cash balance",
    }


def test_orchestrator_routes_canonical_capability_and_agent_does_not_mutate_state():
    problem = state(decision_required="Approve planning model")
    before = problem.model_dump(mode="json")
    plan = CentralOrchestrator().create_plan(
        OrchestrationRequest(
            validated_problem_state=problem,
            epistemic_validation_result=validation(),
            requested_capabilities=["financial_planning"],
        )
    )
    assert plan.agent_assignments[0].agent_id == "FIN_FINANCIAL_PLANNING_001"
    assert problem.model_dump(mode="json") == before


def test_all_taxonomy_values_and_validation_categories_are_explicit():
    assert set(PlanningType) == {
        PlanningType.ANNUAL_BUDGET,
        PlanningType.ROLLING_FORECAST,
        PlanningType.REFORECAST,
        PlanningType.SCENARIO_PLANNING,
        PlanningType.FINANCIAL_MODEL_BUILD,
    }
    result = FinancialPlanningAgent().analyse(request(), trace_id="trace-validation")
    categories = {item.category for item in result.model_specification.validation_requirements}
    assert categories == {"TIMELINE", "ACCOUNTING", "SCENARIO", "EVIDENCE", "ARCHITECTURE"}
