export default function (kibana) {
  return new kibana.Plugin({
    uiExports: {
      visTypes: [
        'plugins/preha_treemap_visualization/TreemapVisualizationProvider'
      ]
    }
  });
}
