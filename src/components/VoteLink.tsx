"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { VOTE_URL, markVoteVisit } from "@/lib/vote";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target"> & {
  /** The return modal's own button leaves without arming another return message. */
  trackReturn?: boolean;
};

/**
 * Every buy, sell, vote, or "see voting info" action goes through here:
 * a plain same-tab link to Vote.gov that first records the visit in sessionStorage.
 */
export function VoteLink({ trackReturn = true, onClick, children, ...rest }: Props) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (!trackReturn || event.defaultPrevented) return;
    // A modified click opens a new tab, so this page never goes "back" to itself.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    markVoteVisit();
  }

  return (
    <a href={VOTE_URL} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
