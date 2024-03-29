#!/bin/bash
#
# Generate a Markdown-formatted changelog from merge commits.
#

set -o errexit

#
# Regex to match the standard pull request commit message.  Creates capture
# groups for pull request number, GitHub username, and commit message body.
#
MERGE_RE=Merge\ pull\ request\ #\([0-9]+\)\ from\ \([^/]+\)\/[^\ ]+\ \(.*\)

#
# Regex to match the squash commit message. Creates capture groups for git
# author, commit subject and pull request number.
#
SQUASH_RE='([^\|]+)\|([^\(]+) \(#([0-9]+)\)'

GITHUB_URL=https://github.com
PULLS_URL=${GITHUB_URL}/helloelliote/webgis/pull

display_usage() {
  cat <<-EOF

  Usage: ${1} <revision range>

  Creates a Markdown-formatted changelog given a revision range.

  E.g.
      ${1} v3.0.0.. > changelog/v3.1.0.md

  See git-log(1) for details on the revision range syntax.

EOF
}

#
# Scan the git log for merge commit messages and output Markdown.  This only
# follows the first parent of merge commits to avoid merges within a topic
# branch (instead only showing merges to main).
#

main() {
  git log --first-parent --format='%aN|%s %b' ${1} |
  {
    while read l; do
      output="`[[ ${l} =~ "helloelliote/dependabot" ]] && echo dependabot || echo main`_output"
      if [[ ${l} =~ ${MERGE_RE} ]] ; then
        number="${BASH_REMATCH[1]}"
        author="${BASH_REMATCH[2]}"
        summary="${BASH_REMATCH[3]}"
        declare $output+=" * [#${number}](${PULLS_URL}/${number}) - ${summary} ([@${author}](${GITHUB_URL}/${author}))\n"
      elif [[ ${l} =~ ${SQUASH_RE} ]] ; then
        number="${BASH_REMATCH[3]}"
        author="${BASH_REMATCH[1]}"
        summary="${BASH_REMATCH[2]}"
        declare $output+=" * [#${number}](${PULLS_URL}/${number}) - ${summary} ([${author}](${GITHUB_URL}/search?q=${author}&type=Users))\n"
      fi
    done

    echo "# ${1}"
    echo
    echo
    echo
    echo "## List of all changes"
    echo
    echo -e "$main_output"

    if [ -n "$dependabot_output" ]; then
      echo
      echo "<details>"
      echo "  <summary>Dependency Updates</summary>"
      echo
      echo -e "$dependabot_output"
      echo
      echo "</details>"
    fi
  }
}

if test ${#} -ne 1; then
  display_usage ${0}
  exit 1
else
  main ${1}
fi
