# Brand fonts

The three faces named in `.agents/website-visual-design-guidelines.md`, kept here so
asset generation does not depend on what happens to be installed on a machine.

| File | Role | Rule |
|---|---|---|
| `InstrumentSerif-Regular.ttf` | Display | Never below 32px — it loses its character and reads as a cheap web font |
| `Inter-Variable.ttf` | Body / UI | Variable: supports 400, 500, 600 via the `wght` axis |
| `DMMono-Regular.ttf` · `DMMono-Medium.ttf` | Data | **Numbers only.** Never body copy |

All three are open-licensed (SIL OFL) and are the same files Google Fonts serves.
Source: `github.com/google/fonts/tree/main/ofl`.

Anyone who needs them locally can install from fonts.google.com rather than copying
from here — these exist for scripted rendering, not as a distribution point.
