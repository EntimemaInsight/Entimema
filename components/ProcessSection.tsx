import DynamicArchitectureCanvas from "./DynamicArchitectureCanvas";

export default function ProcessSection() {
  return (
    <section className="process-section process-section--static" id="approach" aria-labelledby="process-title">
      <div className="site-container process-section__inner">
        <div className="process-heading">
          <h2 id="process-title">
            Всяко решение
            <br />
            <em>започва с разбиране.</em>
          </h2>
        </div>

        <div className="process-quote">
          <p>Променя се контекстът, а не логиката.</p>
        </div>

        <DynamicArchitectureCanvas />
      </div>
    </section>
  );
}
