// we want strict javascript that fails
// on ambiguous syntax
"using strict";

// do not use notebook loaded  event as it is re-triggerd on
// revert to checkpoint but this allow extesnsion to be loaded
// late enough to work.
//

$([IPython.events]).on('app_initialized.NotebookApp', function(){
	require(['custom/cell_tags']);
}); 
