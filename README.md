# trecli

`trecli` is a real terminal kanban board inspired by [ranger](https://github.com/ranger/ranger) that uses vim keybindings.

The project is still in a very early stage but is able to read trello information via the API and display it in a column terminal interface. Several actions are implemented to optimize my daily workflow.

## Features

- Navigations with `h/j/k/l`
- Fullscreen mode
- Integration with `tmux` sessions
- Archive Card
- Unarchive Card
- Switch Board
- New Card
- Change title (in vim)
- Change description (in vim)
- Change due date
- Move card to tomorrow

## Optimizations

The code base is still in a super early prototype-like state. Nothing to show off with or that is in a good quality state.
## Roadmap

### Basics

- Refactor app structure in a SOLID way
- Remove TODO comments
- App hardening
- Proper logging

### Features

- UI Optimizations
  - Display labels
  - Better organising of information
  - Prettyfy
- Lazy loading for even faster creation of cards
- Better in memory caching
- Tmux session instead of window
- Move cards up and down
- search for card then in vim? or edit in single column
- Optional: Export concatenated card to `nvim`/clipboard for further processing in other programs
- Accumulated view of all tasks on all boards

### More ideas

- Frontend sorting of lists
- A: Append
- I: prepend

