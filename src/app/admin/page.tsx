import type { Metadata } from "next";
import Link from "next/link";
import { adminConfigured, isAdmin } from "@/lib/auth";
import { CATEGORIES, DEFAULT_END_DATE, DEFAULT_SUBHEAD } from "@/lib/markets";
import { getMarkets } from "@/lib/store";
import { deleteMarket, logout } from "./actions";
import { CreateForm, DeleteButton, LoginForm } from "./forms";

// Not linked from anywhere on the site, and kept out of search engines.
export const metadata: Metadata = { title: "Market admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!adminConfigured()) {
    return (
      <div className="container admin">
        <h1>Market admin</h1>
        <p className="admin-note">
          Set an <code>ADMIN_PASSWORD</code> environment variable in Vercel, then redeploy, to turn this page on.
        </p>
      </div>
    );
  }

  if (!(await isAdmin())) {
    return (
      <div className="container admin admin-narrow">
        <h1>Market admin</h1>
        <LoginForm />
      </div>
    );
  }

  const markets = await getMarkets();
  return (
    <div className="container admin">
      <div className="admin-head">
        <h1>Market admin</h1>
        <form action={logout}>
          <button type="submit" className="btn btn-ghost btn-sm">Log out</button>
        </form>
      </div>

      <section className="card admin-card" aria-labelledby="new-h">
        <h2 id="new-h">New market</h2>
        <CreateForm categories={[...CATEGORIES]} defaultSubhead={DEFAULT_SUBHEAD} defaultEndDate={DEFAULT_END_DATE} />
      </section>

      <section className="card admin-card" aria-labelledby="live-h">
        <h2 id="live-h">Live markets ({markets.length})</h2>
        {markets.length === 0 ? (
          <p className="admin-note">No markets yet. The ones you create show up here and on the homepage.</p>
        ) : (
          <ul className="admin-list">
            {markets.map((m) => (
              <li key={m.slug}>
                <div>
                  <Link href={`/${m.slug}`} className="admin-title">{m.title}</Link>
                  <div className="admin-meta">
                    /{m.slug} · {m.category} · {m.series[0].name} {m.series[0].end}% vs {m.series[1].name} {m.series[1].end}%
                  </div>
                </div>
                <form action={deleteMarket}>
                  <input type="hidden" name="slug" value={m.slug} />
                  <DeleteButton title={m.title} />
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
