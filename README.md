# Notebook Cherry Picker Extension

## Description
Simple Notebook &amp; nbconvert extension demonstrating how to cherry pick cells from a notebook.

## Installation

1.  If you don't have a user profile already, go ahead and create one by running 
    `ipython profile create`.  You can then figure out where your profile is located by running
    `ipython profile list`.  It will be listed under the *users* section.  Mine is
    `~/.config/ipython/profile_default/`.  **Advanced users** may not want to override custom.js,
    that's fine as long as a reference to *cell_tags* is added to the existing *custom.js*  
        ie. `require(['custom/cell_tags']);`
2.  Put the files in `/static/custom/` into the same subdir in your profile directory.  You may
    need to create it if it doesn't already exist.  For example, on my computer, the files
    reside in `~/.config/ipython/profile_default/static/custom/`.
3.  Refresh any notebooks you have open, the cell toolbar should now be available in drop-down
    menu on the main toolbar.  Also, a new tag button should be available on the main toolbar.
    
## Usage

### Part 1 - Notebook

This plugin works by allowing the user to *tag* each cell in the notebook.  Tags are registered
in the notebook metadata and can be managed via the tag button on the main toolbar.  Tags are
specified on a cell to cell basis via the new tags cell toolbar.  The cell tag is then stored
in the cell's metadata.

### Part 2 - nbconvert

When all of the cells are tagged as desired, one must run nbconvert with a special **writer** 
and **transformer** (included) to cherry-pick the desired cells.

- Make sure that the `cherry_picking_transformer.py` and `notebook_copy_writer.py` are accessible 
  via your PYTHONPATH.  The easiest way to do this is to place them in the cwd (usally the same 
  directory as the notebooks that you want to cherry pick from).
- Make sure that the `ipython_nbconvert_config.py` file (included) is placed in the cwd.  This
  is a configuration file who's only purpose is to shorten the CLI.  If you want 


Call nbconvert, specify the names of the notebooks you want to convert (glob supported) and the
tags you want to pick out of the document.

    ipython nbconvert notebook* --CherryPickingTransformer.match_tags='["tag1", "tag2"]'
  
where 
- `notebook*` would be replaced by a space separeted list of notebook names
- `"tag1", "tag2"` would be replaced by a comma separeted list of tags (enclosed in quotes)

Example:

    ipython nbconvert Untitled0 --CherryPickingTransformer.match_tags='["doc1"]'
    
If you want to shorten the command, you can add the *match_tags* to the local config file.
You can also have multiple config files, each one with separate tags.  You can then load the 
config files with `--config myConfig.py` at the commandline.
