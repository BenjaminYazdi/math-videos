# Catalog review — November 1, 2026

## Scope

The original portfolio contains **343 unique YouTube video IDs**. All were preserved. A complete public-channel uploads listing, read across **four pages until no continuation remained**, contains **351 entries**: all 343 original videos, **seven additional recorded math videos**, and **one livestream listing**. All 350 recorded videos return public embed metadata identifying the author as **Math Videos** (`@mathvideos6394`). Every title and thumbnail was inspected. Recording styles are **81 whiteboard / 269 pencil and paper**, The old stream placeholder is excluded from the site; Benjamin confirmed there is no livestream.

The channel listing was available through YouTube's public metadata endpoint on its embed host even though the main channel webpage did not resolve. No filtering or security settings were changed. `channel-uploads.json` is the sanitized complete snapshot with titles, IDs, and durations; it contains no login/session data.

This is a title-and-thumbnail review, not an end-to-end viewing of 350 videos. Larger thumbnails and additional preview frames were used for ambiguous cases. A thumbnail confirms the visible recording style at that point, not every frame of the video. Successful embed metadata is not proof that playback works in every region or browser. The livestream has no reported duration and did not return normal embed metadata. Its embedded player was checked directly and reported **Live stream offline** on November 1, 2026. It is excluded from the website and from the 350-video count.

## Recovered uploads

| ID | Title | Category | Recording |
| --- | --- | --- | --- |
| `a9iMj7Uzfvc` | Minimum Counting | Probability & Counting | Pencil & paper |
| `hp9HdIpGFsY` | Inclusive Counting with a Twist | Probability & Counting | Pencil & paper |
| `ZS7BIkkTQtg` | Counting Slices | Probability & Counting | Pencil & paper |
| `ysfBIXEG9_k` | Exclusive Counting | Probability & Counting | Pencil & paper |
| `FnphnaHR5ac` | Finding Derivatives | Calculus | Pencil & paper |
| `lVoGGLSFsHE` | 2015 AMC 10B #1 | Competition Problems | Pencil & paper |
| `sxiqi71drK8` | 2000 AMC 12 #1 and 10 #1 | Competition Problems | Pencil & paper |
| `hrGzJkbr1Zw` | Math Videos Live Stream | Excluded | Old offline placeholder; not a video |

## Corrections

- **Deriving Sin(2a) When Given sin(a)**: Calculus → Trigonometry. It is a double-angle identity.
- **Using the Formula for the Sum of an Infinite Geometric Series**: Calculus → Algebra, with a calculus search tag retained.
- **A Medical Problem**: Math Explorations → Probability & Counting, based on the visible medical-testing word problem.
- **Adding Columns**: Math Explorations → Number Theory & Proofs, based on the visible digit/column-addition problem.
- **f(x) = x + cos(x)**: Trigonometry → Calculus, based on derivative notation and monotonicity work on the board.
- **Integral Solutions**: Calculus → Number Theory & Proofs. The visible book problem asks for positive integer solutions; “integral” means integer. The display title is now **Positive Integer Solutions**, with contest tags retained.
- **My Homework**: Algebra → Trigonometry. The visible equation contains trigonometric functions.
- Typos and some vague display titles were clarified where supported by the visible math. Original YouTube titles remain stored and searchable.

## Ambiguous subjects resolved through embedded playback

- `qNlzFN8dck0`, originally **Untitled video**: sampled embedded playback and visible captions show the base case n=1 and an induction argument using k. Display title: **Proof by Induction**; category: **Number Theory & Proofs → Induction & Reasoning**.
- `maK-V--mlL0`, **Stacking Blocks**: sampled playback shows offset rectangular blocks and an explanation of placing one block just over halfway across another. Category: **Geometry → Area & Geometry Problems**.

No recorded lesson remains in an unclassified category. The final website has eight mathematical subjects and no livestream section. Two originally untitled algebra videos retain broad algebra assignments, with descriptive display titles based on the visible prompts. More specific titles would benefit from watching the full videos.

Several different uploads share the same original title, including two labeled **2004 AMC 12A #9**. They have different IDs and are retained as separate recordings. No missing problem number is inferred from sequence alone.

Full per-video provenance, category decisions, and format evidence are in `catalog-audit.json`.
