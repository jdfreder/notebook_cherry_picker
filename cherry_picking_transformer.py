from copy import deepcopy
from IPython.nbconvert.transformers import Transformer
from IPython.utils.traitlets import List

class CherryPickingTransformer(Transformer):

    match_tags = List(config=True, help="""
        Tags of the cells that you want to export.
        """)

    def call(self, nb, resources):

        # Loop through each cell, remove cells that dont match the query.
        for worksheet in nb.worksheets:
            remove_indicies = []
            for index, cell in enumerate(worksheet.cells):
                if not self.validate_cell_tag(cell):
                    remove_indicies.append(index)

            for index in remove_indicies[::-1]:
                del worksheet.cells[index]

        resources['notebook_copy'] = deepcopy(nb)
        return nb, resources


    def validate_cell_tag(self, cell):
        if 'cell_tag' in cell.metadata:
            cell_tag = cell.metadata.cell_tag
            for match_tag in self.match_tags:
                if match_tag.lower() == cell_tag.lower():
                    return True
        return False
