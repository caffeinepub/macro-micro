# Specification

## Summary
**Goal:** Build a frontend-only, single-page “Macro → Micro” board-game style organizer UI for moving team pawns through fixed cosmic/physics levels, declaring a winner, and resetting.

**Planned changes:**
- Create a single-page UI titled “Macro → Micro” with a connected 7-node path in this exact order: Universe → Galaxy Cluster → Milky Way → Solar System → Earth → Atoms → Quarks; responsive horizontal (wide) and stacked/vertical (small screens).
- Add an initial Team Setup flow to choose team count (2–10) and enter team names; auto-assign a physics-themed emoji pawn per team; start all pawns at Universe.
- Render pawns on nodes so multiple teams can share a level while remaining distinguishable; highlight occupied/current levels and animate pawn movement transitions.
- Add per-team manual controls (“Move Forward” / “Move Backward”) to move exactly one level with boundary protection (Universe..Quarks).
- Show team positions near controls and in a sidebar listing all teams and their current level; update immediately on movement.
- Implement winner logic: when a team reaches Quarks, show “🏆 Winner: Team X” and disable all movement (and mini-game actions) until reset.
- Add a “Reset Game” button that clears winner state, returns all teams to Universe, re-enables controls, and preserves team names/count for the session.
- Add optional “Mini Game Result” control: select a team and choose Win (no change) or Lose (move back one level, respecting Universe boundary).
- Apply a clean, minimal dark space/cosmic theme with high-contrast, projector-friendly typography and large buttons; keep styling consistent across views.
- Keep all state in-browser with no login and no backend dependency; reference generated static theme images from the frontend.

**User-visible outcome:** An organizer can set up 2–10 teams, see their emoji pawns on a cosmic-themed Macro → Micro board, manually move teams forward/backward (or apply an optional mini-game win/lose result), see positions in a sidebar, get a winner banner at Quarks that locks the board, and reset to play again without re-entering team names.
