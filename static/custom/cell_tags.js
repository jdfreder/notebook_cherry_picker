(function (IPython) {
    "use strict";

    // Variables //////////////////////////////////////////////////////////////

    var CellToolbar = IPython.CellToolbar;
    var CellTags = [["<None>", undefined]]

    // Keep track of all of the tag dropdowns so we can modify their contents later.
    var SelectControls = [];

    // Init ///////////////////////////////////////////////////////////////////

    var init = function(){
        init_modify_tags_modal();
        init_cell_tags();
        init_cell_toolbar();
        init_tag_button();
    };

    var init_modify_tags_modal = function(){
        $("body").append(" \
            <div class=\"modal fade\" id=\"tagsModifier\"> \
                <div class=\"modal-dialog\"> \
                  <div class=\"modal-content\"> \
                    <div class=\"modal-header\"> \
                      <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button> \
                      <h4 class=\"modal-title\">Modify registered notebook tags</h4> \
                    </div> \
                    <div class=\"modal-body\"> \
                        <div class=\"input-append\"> \
                            Add and remove the tags registered to this notebook by modifying the contents of the drop down seen below.<br> \
                            <select id=\"tagDeleteList\"></select> \
                            <a href=\"#\" onclick=\"$.on_delete_tag_clicked();\" class=\"btn\">Delete</a> \
                            <a href=\"#\" onclick=\"$.on_add_tag_clicked();\" class=\"btn\">Add</a> \
                        </div> \
                    </div> \
                    <div class=\"modal-footer\"> \
                      <a href=\"#\" class=\"btn btn-primary\" data-dismiss=\"modal\">Close</a> \
                    </div> \
                  </div><!-- /.modal-content --> \
                </div><!-- /.modal-dialog --> \
            </div><!-- /.modal -->");
        SelectControls.push($("#tagDeleteList"));
    };

    var init_cell_tags = function(){
        if (IPython.notebook.metadata.cell_tags!=undefined){
            CellTags = IPython.notebook.metadata.cell_tags;
        }
        apply_tags_list();
    };

    var init_cell_toolbar = function(){

        var cell_tag_init = select_ui_generator(
            // Setter
            function(cell, value){
                cell.metadata.cell_tag = value;
            },

            //Getter
            function(cell){ 
                return cell.metadata.cell_tag;
            },

            //Caption
            "Tag: ");

        CellToolbar.register_callback('cell_tag.init', cell_tag_init);

        var example_preset = []
        example_preset.push('cell_tag.init');

        CellToolbar.register_preset('Cell Tags',example_preset);
        console.log('Cell tag extension loaded.');
    };

    var init_tag_button = function(){
    IPython.toolbar.add_buttons_group([
         {
          'label'   : 'Modify Cell Tag List',
          'icon'    : 'icon-tag', 
          'callback': on_tag_button_clicked
         }
     ]);
    };

    // Events /////////////////////////////////////////////////////////////////

    $.on_add_tag_clicked = function(){
        var tag_name = prompt('Enter the name of the tag you want to add:');
        add_tag(tag_name);
        $('#tagDeleteList :selected').val(tag_name);
    };

    $.on_delete_tag_clicked = function(){
        if ($('#tagDeleteList :selected').val()==undefined){
            alert('Cannot delete built-in <None> flag.')            
        } else {
            if (confirm('Are you sure you want to delete this tag?')){
                remove_tag($('#tagDeleteList :selected').val());
            };    
        };
    };

    var on_tag_button_clicked = function(){
        $('#tagsModifier').modal('show');
    };

    // Functions //////////////////////////////////////////////////////////////

    var remove_tag = function(tag){
        if (CellTags.length>0) {
            var remove_indicies = [];
            for (var i = 0; i < CellTags.length; i++) {
                if (CellTags[i][0] == tag) {
                    remove_indicies.push(i);
                };
            };

            for (var i = 0; i < remove_indicies.length; i++) {
                CellTags.splice(remove_indicies[i] - i, 1);
            };
            apply_tags_list();    
        };
    };

    var add_tag = function(tag){
        CellTags.push([tag, tag]);
        apply_tags_list();
    };

    var apply_tags_list = function(){
        if (SelectControls.length>0) {
            for (var i = 0; i < SelectControls.length; i++) {

                // Remember selection then remove everything from the select
                var select_control = SelectControls[i];
                var selection = select_control.val();
                select_control.find('option').remove().end();

                // Add the new items
                var selection_exists = false;
                for(var itemn in CellTags){
                    var opt = $('<option/>');
                        opt.attr('value', CellTags[itemn][1]);
                        opt.text(CellTags[itemn][0]);
                    select_control.append(opt);
                    if (CellTags[itemn][1]==selection){
                        selection_exists = true;
                    }
                };

                // Try to reselect
                if (selection_exists) {                   
                    select_control.val(selection);
                };
            };
        };

        IPython.notebook.metadata.cell_tags = CellTags;
    };

    var select_ui_generator = function(setter, getter, label){
        label= label? label: "";
        return function(div, cell) {
            var button_container = $(div)
            var lbl = $("<label/>").append($('<span/>').text(label));

            var select = $('<select/>').addClass('ui-widget ui-widget-content');
            SelectControls.push(select);
            apply_tags_list()

            select.val(getter(cell));
            select.change(function(){
                        setter(cell, select.val());
                    });
            button_container.append($('<div/>').append(lbl).append(select));
        };
    };

    init();

}(IPython));