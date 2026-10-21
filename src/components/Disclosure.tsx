import { VoteLink } from "./VoteLink";

export function Disclosure() {
  return (
    <section id="about" className="disclosure" aria-labelledby="disclosure-heading">
      <h2 id="disclosure-heading">Markets predict outcomes. Voters create them.</h2>
      <p>
        GOTV is a nonpartisan get-out-the-vote campaign. It is not a prediction market, betting
        site, or trading platform. Nothing here can be bought, sold, or wagered, and no money
        changes hands. Odds, prices, and volumes are illustrative, and GOTV does not support or
        oppose any candidate or party.
      </p>
      <p>
        Every buy, sell, and vote button takes you to <VoteLink>Vote.gov</VoteLink>, the official
        U.S. government site for registering and finding your state’s voting information.
      </p>
    </section>
  );
}
