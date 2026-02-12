# Specification

## Summary
**Goal:** Allow users to configure between 2 and 20 teams during game setup with correct labeling, validation, and rendering.

**Planned changes:**
- Update the setup screen label to read “Number of Teams (2-20)”.
- Adjust the team count input to enforce min=2 and max=20 via control attributes.
- Clamp typed team count values to the 2..20 range in onChange logic.
- Ensure changing team count renders exactly that many Team Name inputs (2–20) while preserving existing names for remaining indexes.
- Ensure starting a game with up to 20 teams creates and renders all teams without runtime errors.

**User-visible outcome:** On the setup screen, users can choose 2–20 teams; the input prevents out-of-range values, the correct number of team name fields appears, and the game starts correctly with the selected number of teams.
