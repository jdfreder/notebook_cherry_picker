from copy import deepcopy
from IPython.nbconvert.transformers import Transformer
from IPython.utils.traitlets import List

class CherryPickingTransformer(Transformer):

    expression = List(config=True, help="Cell tag expression.")

    def call(self, nb, resources):

        # Loop through each cell, remove cells that dont match the query.
        for worksheet in nb.worksheets:
            remove_indicies = []
            for index, cell in enumerate(worksheet.cells):
                if not self.validate_cell_tags(cell):
                    remove_indicies.append(index)

            for index in remove_indicies[::-1]:
                del worksheet.cells[index]

        resources['notebook_copy'] = deepcopy(nb)
        return nb, resources


    def vsalidate_cell_tag(self, cell):
        if 'cell_tags' in cell.metadata:
            return eval_tag_expression(cell.metadata.cell_tags, self.expression)
        return False


    def eval_tag_expression(tags, expression):
        
        # Create the tags as True booleans.  This allows us to use python 
        # expressions.
        for tag in tags:
            exec tag + " = True"

        # Attempt to evaluate expression.  If a variable is undefined, define
        # the variable as false.
        while True:
            try:
                return eval(expression)
            except NameError as Error:
                exec str(Error).split("'")[1] + " = False"
