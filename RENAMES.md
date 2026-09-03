# IMAGE RENAMES PROPOSAL

This file lists proposed filename normalizations for posters in images/ and the corresponding changes that should be applied to anime.json.

Rule used: remove duplicated extensions and normalize to a single extension. For entries like "*.jpg.jpg" -> "*.jpg". For entries like "*.jpg.png" -> choose the most likely primary extension: "*.jpg" (you can change to .png if preferred).

DO NOT apply these renames automatically unless you confirm — this file is a patch proposal. I will not rename binary files until you confirm.

Mappings (current -> proposed)

- images/attackontitan.jpg.jpg -> images/attackontitan.jpg
- images/bleach.jpg.jpg -> images/bleach.jpg
- images/onepiece.jpg.jpg -> images/onepiece.jpg
- images/demonslayer.jpg.jpg -> images/demonslayer.jpg
- images/jujutsukaisen.jpg.jpg -> images/jujutsukaisen.jpg
- images/deathnote.jpg.jpg -> images/deathnote.jpg
- images/fairytail.jpg.jpg -> images/fairytail.jpg
- images/gintama.jpg.jpg -> images/gintama.jpg
- images/haikyu.jpg.jpg -> images/haikyu.jpg
- images/hxh.jpg.jpg -> images/hxh.jpg
- images/bluelock.jpg.jpg -> images/bluelock.jpg
- images/chainsawman.jpg.jpg -> images/chainsawman.jpg
- images/codegeass.jpg.jpg -> images/codegeass.jpg
- images/cyberpunk.jpg.jpg -> images/cyberpunk.jpg
- images/one-piece.jpg.jpg -> images/one-piece.jpg
- images/sololeveling.jpg.jpg -> images/sololeveling.jpg
- images/tokyorevengers.jpg.jpg -> images/tokyorevengers.jpg
- images/vinlandsaga.jpg.jpg -> images/vinlandsaga.jpg
- images/steintsgate.jpg.jpg -> images/steinstgate.jpg (note: original key looks misspelled; check spelling)
- images/sao.jpg.jpg -> images/sao.jpg
- images/tokyoghould.jpg.jpg -> images/tokyoghoul.jpg (typo variants: please validate)
- images/onepiece.jpg.jpg -> images/onepiece.jpg
- images/spyxfamily.jpg.png -> images/spyxfamily.jpg  # choose .jpg or .png depending on file content
- images/naruto.jpg.png -> images/naruto.jpg

There are more files listed in the repo; the above are the most common duplicates. Please review the list — if you confirm I will prepare a patch that updates anime.json references and provide commands to rename the files locally or in the repo.

---

PROPOSED anime.json replacements (example):
Replace occurrences in anime.json like:
  "poster": "images/bleach.jpg.jpg"
with
  "poster": "images/bleach.jpg"

I created the following patch file (anime_poster_renames.patch) with exact replacements for all poster paths found. Apply it with `git apply anime_poster_renames.patch` after renaming files, or examine/modify it before applying.
