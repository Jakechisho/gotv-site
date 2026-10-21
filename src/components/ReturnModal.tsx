"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { consumeVoteVisit } from "@/lib/vote";
import { VoteLink } from "./VoteLink";

/**
 * Shown once when a visitor comes back from Vote.gov with the Back button.
 * `pageshow` covers pages restored from the back-forward cache; the mount check
 * covers browsers that reload the page instead.
 */
export function ReturnModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const check = () => {
      if (consumeVoteVisit()) setOpen(true);
    };
    check();
    window.addEventListener("pageshow", check);
    return () => window.removeEventListener("pageshow", check);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content className="modal" aria-describedby="return-modal-body">
          <p className="modal-eyebrow">THE ODDS AREN’T THE OUTCOME</p>
          <Dialog.Title className="modal-title">
            This is only the landing page. Voting is the point.
          </Dialog.Title>
          <p id="return-modal-body" className="modal-body">
            This experience can show what people think might happen. Only participation helps
            determine what actually happens.
          </p>
          <div className="modal-panel">
            If you haven’t already, return to Vote.gov and make a plan to vote.
          </div>
          <div className="modal-actions">
            <Dialog.Close className="btn btn-secondary">Explore the landing page</Dialog.Close>
            <VoteLink trackReturn={false} className="btn btn-primary">
              Return to Vote.gov ↗
            </VoteLink>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
