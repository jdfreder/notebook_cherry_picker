

// Variables //////////////////////////////////////////////////////////////

var CellToolbar = IPython.CellToolbar;
var CellTags = ["exercise", "student", "instructor"]

// Keep track of all of the tag dropdowns so we can modify their contents later.
var SelectControls = [];

// Init ///////////////////////////////////////////////////////////////////

var init = function(){
    init_cell_tags();
    init_cell_toolbar();
};

var init_cell_tags = function(){
    if (IPython.notebook.metadata.cell_tags!=undefined){
        CellTags = IPython.notebook.metadata.cell_tags;
    }
};

var init_cell_toolbar = function(){

    // Create a checkbox for each known tag.
    var checkbox_inits = []
    for (var i = 0; i < CellTags.length; i++) {
        var tag_name = CellTags[i];
        add_checkbox(tag_name);
        checkbox_inits.push(tag_name + '.init');    
    }

    CellToolbar.register_preset('Software carpentry', checkbox_inits);
    console.log('Software carpentry extension loaded.');
};


var add_checkbox = function(tag_name){

    var cell_tag_init = CellToolbar.utils.checkbox_ui_generator(

        // Name
        tag_name,

        // Setter
        function(cell, value){
            if (value) {

                // If no tags property is set in the cell metadata, create the tag.
                // Else add the tag to the list of tags.
                if (cell.metadata.cell_tags == undefined) {
                    cell.metadata.cell_tags = [tag_name];
                } else {
                    cell.metadata.cell_tags.push(tag_name)
                };
            } else {

                // Get the indicies to remove.
                var remove_indicies = [];
                for (var i = 0; i < cell.metadata.cell_tags.length; i++) {
                    if (cell.metadata.cell_tags[i]==tag_name) {
                        remove_indicies.push(i);
                    };
                };

                // Remove the items
                for (var i = 0; i < remove_indicies.length; i++) {
                    var remove_index = remove_indicies[i] - i;
                    cell.metadata.cell_tags.splice(remove_index, 1);
                };
            };
            
        },

        // Getter
        function(cell){ 
            if (cell.metadata.cell_tags == undefined) {
                cell.metadata.cell_tags = [];
            };

            // Check if the value is registered in the tags list.
            var has_value = false;
            for (var i = 0; i < cell.metadata.cell_tags.length; i++) {
                if (cell.metadata.cell_tags[i]==tag_name) {
                    has_value = true;
                    break;
                };
            };

            return has_value;
        });

    CellToolbar.register_callback(tag_name + '.init', cell_tag_init);

};

init();