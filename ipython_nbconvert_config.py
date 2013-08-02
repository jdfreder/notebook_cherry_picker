c = get_config()

#Export all the notebooks in the current directory to the sphinx_howto format.
c.Exporter.transformers = ['cherry_picking_transformer.CherryPickingTransformer']
c.NbConvertApp.writer_class = 'notebook_copy_writer.NotebookCopyWriter'