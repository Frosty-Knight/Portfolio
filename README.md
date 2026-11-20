# Adhvaith Bonaili: portfolio site

A plain HTML/CSS/JS site. No build step, no frameworks. Works on GitHub Pages as-is.

```
index.html                  home: hero, featured projects, gallery, reel, about, contact
projects/arena-shooter.html project page (Environment / Map & Enemy Influence / Gameplay / Technical overview)
projects/souls-like.html    project page (Character / Environment / Gameplay / Technical overview)
css/style.css               all colors and layout (palette is at the top of the file)
js/main.js                  behavior (you should not need to edit this)
assets/img/arena/           Arena Shooter screenshots (already filled in)
assets/img/souls/           put Souls-like screenshots here
assets/video/               put your mp4 clips here (names below)
tools/place_videos.ps1/.sh  copies + renames your clips into assets/video
tools/compress_videos.sh    shrinks recordings so they load fast and fit GitHub's limits
assets/docs/                put design-doc PDFs here
assets/Adhvaith_Bonaili_Resume.pdf   put your resume PDF here
```

## FIRST: put your 11 videos in place

The videos are not inside this zip (they are too large to send). The pages already point at them, so until you add them the video slots are empty.

**Windows (PowerShell, from this folder):**
```
.\tools\place_videos.ps1 -Source "C:\path\to\your\compressed-videos"
```
**Mac/Linux:**
```
./tools/place_videos.sh /path/to/your/compressed-videos
```
Either script finds each clip by the keyword in its filename (`elevatorweaponpickup`, `spawnscore`, `navmeshinviswalls`, `shootdeath`,
`rangedenemy`, `player`, `chainattackhiteffects`, `attacksense`, `soundenemyattacks`, `enemypathsightdeath`, `blockforget`), copies it into
`assets/video/` under the name the site expects, and prints any it could not find. Or copy and rename them by hand using the tables below.
You do not need to compress them again: the largest is about 21 MB, under GitHub's 25 MB web-upload limit.

## Adding pictures and videos

Every picture, clip, and video is a "slot" that looks like this:

```html
<div class="media" data-src="assets/img/souls/souls-cliff-arena.jpg"
     data-label="Arena hero shot" data-caption="The cliff arena"></div>
```

To fill a slot:

1. Drop your file into the matching `assets/` folder.
2. Make sure the filename matches `data-src` (or change `data-src` to your filename).
3. Refresh. Until the file exists, the slot shows a dashed placeholder that tells you the path it expects.

Slot options:

| attribute | what it does |
|---|---|
| `data-src` | path to a `.jpg/.png/.webp/.gif` image, an `.mp4/.webm` video, or a YouTube link |
| `data-caption` | text shown on the image and in the enlarged view |
| `data-label` | the title shown on an empty placeholder |
| `data-ratio="16:9"` | shape of the slot (`4:3`, `1:1`, `9:16`, ...) |

A YouTube link works directly: `data-src="https://youtu.be/XXXXXXXXXXX"` (unlisted videos are fine).

### Cards on the home page: hover-play previews
The two project cards can play a short clip when hovered. Add an mp4 at
`assets/video/arena-shooter-preview.mp4` and `assets/video/souls-like-preview.mp4`
(5-10 seconds, no sound needed). If the file is missing, the card just shows the image.

### Gallery tiles
In `index.html`, find `<div class="gallery">`. Each tile is one `<div class="tile">` block. Copy one,
change `data-cat` (`environment`, `character`, or `gameplay`), the `data-src`, and the label.
Add `wide` or `big` to the class to make a tile larger. Use a small thumbnail for `data-src` and the
full-size picture for `data-full` so the page loads fast.

## Your videos: where each one is already placed

All 11 clips are in `assets/video/` and wired into the pages. Each plays inline with its own controls.

**Arena Shooter** (`projects/arena-shooter.html`)

| tab | file | shows |
|---|---|---|
| Map & Enemy Influence | `arena-elevator-weapon-pickup.mp4` | elevator mechanics and weapon pickup |
| Map & Enemy Influence | `arena-spawn-score.mp4` | enemy spawning and score |
| Map & Enemy Influence | `arena-navmesh-invisible-walls.mp4` | navmesh and invisible walls |
| Gameplay | `arena-shoot-death.mp4` | shooting and enemy death |

**Souls-like** (`projects/souls-like.html`)

| tab | file | shows |
|---|---|---|
| Character | `souls-ranged-enemy.mp4` | ranged enemy |
| Character | `souls-player.mp4` | player movement and animation |
| Gameplay | `souls-chain-attack-hit-effects.mp4` | chain attacks and hit effects |
| Gameplay | `souls-attack-sense.mp4` | enemy attack and sense |
| Gameplay | `souls-sound-enemy-attacks.mp4` | enemy hears a sound, then attacks |
| Gameplay | `souls-enemy-path-sight-death.mp4` | enemy pathing, sight, and death |
| Gameplay | `souls-block-forget.mp4` | blocking and enemy forget behavior |

Each video also has a thumbnail in `assets/img/posters/` (same name, `.jpg`) that shows before it plays. To change which frame is used, replace that jpg.

`arena-shooter-preview.mp4` and `souls-like-preview.mp4` are 8-second silent clips cut from the videos above.
They play when you hover a project card on the home page. Replace them with any short clip you like.

To move a clip to another tab, find its `<div class="media" data-src="assets/video/...">` line in the page's HTML and cut/paste it
into another tab's `<div class="grid2">`. To change the text shown over a video (it fades when you hover), edit `data-caption`.
Empty dashed slots are for screenshots or diagrams you still want to add (for example the cover and sightline diagram and the animation
blueprint screenshot): set `data-src` to your file.

Need more slots? Copy any `<div class="media" ...></div>` line and change its `data-src`. Need fewer? Delete the line.

### Keeping videos small (important for GitHub)
GitHub's web upload accepts files up to **25 MB each** (100 MB if you use git on the command line), and
big files make the site slow. The largest clip here is about 21 MB, under the web-upload limit. To compress your recordings, install [ffmpeg](https://ffmpeg.org) and run:

```
./tools/compress_videos.sh  path/to/your/raw-clips  assets/video
```

That converts each clip to 1080p H.264 (roughly 5-15 MB per minute for gameplay) and then you rename the
results to the filenames above. Alternatively, upload a long video to YouTube as *unlisted* and paste the link into
`data-src`. It plays right in the page.

## Editing text

Search the HTML for `<!-- EDIT` to find the spots meant for your own writing. Gray italic text with a
dashed bar on the left (the `hint` style) is a prompt: replace it with your own words.

On each project page, the **Technical overview** tab has:
- an overview paragraph,
- a list of systems,
- three **Design decision** cards (Decision / Why / Tradeoffs) to fill in,
- a **built vs. adapted** section,
- a **Design document** button. Put your PDF at `assets/docs/arena-shooter-design-doc.pdf` and
  `assets/docs/souls-like-design-doc.pdf`. The button grays out until the file exists.

To rename a tab, change its label text in the `<div class="tabs">` block.

## Taking good screenshots in Unreal
Press **G** (Game View) and **F11** in the viewport, then use the viewport menu, **High Resolution Screenshot**.
Files land in your project under `Saved/Screenshots/`. Export as JPG at about 1920px wide to keep the site fast.
The home gallery uses a 720px-wide thumbnail (`-thumb.jpg`) and a 1920px full image. A single 1920px image
also works fine for both.

## Publishing on GitHub Pages
0. Make sure the 11 videos are in `assets/video/` (see the top of this file).
1. Create a new public repo on GitHub (e.g. `portfolio`, or `frostyknight.github.io` for a root URL).
2. Upload everything in this folder so `index.html` is at the top level of the repo.
3. Repo **Settings > Pages > Build and deployment**: Source = "Deploy from a branch", Branch = `main`, folder `/ (root)`.
4. After a minute your site is live at `https://<username>.github.io/<repo>/`.

Paths in this site are all relative, so it works under any repo name.

## To check before you share the link
- [ ] Resume PDF is at `assets/Adhvaith_Bonaili_Resume.pdf`
- [ ] Souls-like images/clips are in `assets/img/souls/` (or the placeholders are removed)
- [ ] Demo reel link is set in the Demo reel section (or delete that section)
- [ ] Any "hint" prompts you did not fill in are rewritten or deleted
- [ ] Add your email in the Contact section (the commented-out `mailto:` line) if you want it public
