export default function AnnouncementBar() {
  return (
    <section className="announcement" aria-label="Announcement">
      <div className="announcement__inner">
        <span>Financial systems are being redefined. AI, data and risk intelligence unlock smarter decisions.</span>
        <a className="announcement__link" href="#insights">Explore insights →</a>
      </div>
      <button className="announcement__close" aria-label="Close announcement">×</button>
    </section>
  );
}
