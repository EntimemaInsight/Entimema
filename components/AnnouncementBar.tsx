export default function AnnouncementBar() {
  return (
    <aside className="announcement" aria-label="Актуално съобщение">
      <div className="site-container announcement__inner">
        <p>Финансовите системи се променят. AI, данните и анализът на риска създават ново поколение управленски решения.</p>
        <a href="#analyses">Разгледайте анализите <span aria-hidden="true">→</span></a>
      </div>
      <button className="announcement__close" type="button" aria-label="Затвори съобщението">×</button>
    </aside>
  );
}
