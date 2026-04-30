#!/bin/bash
# Sweep every public route + every blog post for non-200 status. Prints
# a one-line summary per offender; nothing if all green.
set -u
BASE="${1:-https://njsk-org.manhattan.workers.dev}"

ROUTES=(
  "/"
  "/about"
  "/team"
  "/services"
  "/services/mens-dining-hall"
  "/services/womens-center"
  "/services/health-clinic"
  "/donate"
  "/volunteer"
  "/we-need"
  "/contact"
  "/mass-schedule"
  "/blog"
  "/faq"
)

# Pull every blog slug from the data file so we never miss one.
while IFS= read -r slug; do
  ROUTES+=("/blog/${slug}")
done < <(grep -oE 'slug: "[^"]+"' src/data/blog-posts.ts | sed 's/slug: "//; s/"$//')

bad=0
for r in "${ROUTES[@]}"; do
  code=$(curl -sk -o /dev/null -w "%{http_code}" "$BASE$r")
  if [ "$code" != "200" ]; then
    printf "BAD %s -> %s\n" "$code" "$r"
    bad=$((bad + 1))
  fi
done
printf "\nChecked %d routes. %d non-200.\n" "${#ROUTES[@]}" "$bad"
