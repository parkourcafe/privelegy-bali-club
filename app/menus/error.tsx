"use client";

export default function MenusError({ reset }: { reset: () => void }) {
  return (
    <div className="page-dark">
      <main className="site-shell venue-page-pad">
        <section className="menu-state" role="alert">
          <p className="menu-state-kicker">Temporary menu service issue</p>
          <h1>Menus could not be loaded</h1>
          <p>The restaurant data is still safe. Please try loading the menu library again.</p>
          <button type="button" className="button-secondary mt-4" onClick={reset}>
            Try again
          </button>
        </section>
      </main>
    </div>
  );
}
