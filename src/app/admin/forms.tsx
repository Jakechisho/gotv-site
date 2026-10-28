"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { createMarket, login, type FormState } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});
  return (
    <form action={action} className="card admin-card admin-form">
      <label>
        Password
        <input type="password" name="password" autoComplete="current-password" required autoFocus />
      </label>
      {state.error && <p className="admin-error" role="alert">{state.error}</p>}
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Checking…" : "Log in"}
      </button>
    </form>
  );
}

export function DeleteButton({ title }: { title: string }) {
  return (
    <button
      type="submit"
      className="btn btn-ghost btn-sm admin-delete"
      onClick={(e) => {
        if (!confirm(`Delete “${title}”? Its page will stop working.`)) e.preventDefault();
      }}
    >
      Delete
    </button>
  );
}

type CreateProps = { categories: string[]; defaultSubhead: string; defaultEndDate: string };

export function CreateForm({ categories, defaultSubhead, defaultEndDate }: CreateProps) {
  const [state, action, pending] = useActionState<FormState, FormData>(createMarket, {});
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.created) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="admin-form">
      <label>
        Market name
        <input name="title" required maxLength={120} placeholder="Will the city build the new light rail line?" />
      </label>
      <label>
        Headline
        <input name="headline" required maxLength={160} placeholder="You can’t trade the train. You can vote on it." />
      </label>
      <div className="admin-row">
        <label>
          Option 1
          <input name="optionA" required maxLength={40} placeholder="Yes" />
        </label>
        <label>
          Option 2
          <input name="optionB" required maxLength={40} placeholder="No" />
        </label>
      </div>

      <details className="admin-more">
        <summary>More options</summary>
        <div className="admin-row">
          <label>
            Category
            <select name="category" defaultValue={categories[0]}>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label>
            Option 1 odds (%)
            <input name="chanceA" type="number" min={1} max={99} defaultValue={50} />
          </label>
        </div>
        <label>
          Subhead
          <input name="subhead" maxLength={240} placeholder={defaultSubhead} />
        </label>
        <div className="admin-row">
          <label>
            Resolves
            <input name="endDate" maxLength={40} placeholder={defaultEndDate} />
          </label>
          <label>
            Page address
            <input name="slug" maxLength={60} placeholder="Made from the name" />
          </label>
        </div>
      </details>

      {state.error && <p className="admin-error" role="alert">{state.error}</p>}
      {state.created && (
        <p className="admin-ok" role="status">
          Market is live at <Link href={`/${state.created}`}>/{state.created}</Link>.
        </p>
      )}
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Publishing…" : "Publish market"}
      </button>
    </form>
  );
}
