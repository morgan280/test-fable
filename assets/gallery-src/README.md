# Drop your real gallery photos here

Upload your original photos (JPG/PNG/WebP, any size) into this folder and
the site rebuilds the gallery from them automatically — optimized WebP
full-size + thumbnails, deployed live in ~2 minutes.

**Easiest way:** open this link, drag your files in, click "Commit changes":

https://github.com/morgan280/test-fable/upload/claude/fortune-500-site-redesign-i3d0e7/assets/gallery-src

**JPG, PNG, and WebP all work as-is — no converting.** Just rename with a
number prefix and keep the original extension.

Files are used in **alphabetical order** → gallery slots 1–6, so name them:

```
1-eliminator-plate.webp   (or .png / .jpg — extension doesn't matter)
2-vise-bay.png
3-coolant.png
4-five-axis.png
5-racing-part.png
6-your-sixth.png   (when ready)
```

Only upload the photos you want on the site — the first six (by name) are
used and anything else in this folder is ignored.

Slot 6 is fully automatic: the site shows a "Reserved" tile until a `6-*`
file exists here, then promotes it to a live gallery card on its own —
no code change needed.
