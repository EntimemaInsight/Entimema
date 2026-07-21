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

        <div className="process-summary">
          <div className="process-summary__item process-summary__item--primary">
            <p>
              Целта е проста:
              <br />
              <strong>
                да превърнем <em>сложността в яснота,</em>
                <br /> а анализа — в <em>действие.</em>
              </strong>
            </p>
          </div>
          <span className="process-summary__divider" aria-hidden="true" />
          <div className="process-summary__item">
            <p>
              Така изграждаме
              <br />
              <strong>устойчиви системи за растеж.</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
