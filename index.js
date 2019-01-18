export default function (kibana) {
  return new kibana.Plugin({
    uiExports: {
      visTypes: [
        'plugins/preha_treemap_visualization/treemap_vis'
      ],
      styleSheetPaths: `${__dirname}/public/index.scss`,
    }
  });
}
