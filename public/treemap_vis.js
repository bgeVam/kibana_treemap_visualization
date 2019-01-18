import optionsTemplate from './options_template.html';
import TreemapVisualizationController from './treemap_vis_controller';
import {
  Schemas
} from 'ui/vis/editors/default/schemas';
import {
  CATEGORY
} from 'ui/vis/vis_category';
import {
  VisFactoryProvider
} from 'ui/vis/vis_factory';
import {
  VisTypesRegistryProvider
} from 'ui/registry/vis_types';

function TreemapVisualizationProvider(Private) {
  const VisFactory = Private(VisFactoryProvider);

  return VisFactory.createBaseVisualization({
    name: 'treemap_visualization',
    title: 'Treemap Visualization',
    icon: 'fa fa-gear',
    description: 'Treemap Visualization',
    category: CATEGORY.OTHER,
    visualization: TreemapVisualizationController,
    editorConfig: {
      optionsTemplate: optionsTemplate,
      schemas: new Schemas([{
        group: 'metrics',
        name: 'metric',
        title: 'Metric',
        min: 1,
        aggFilter: ['!derivative', '!geo_centroid'],
        defaults: [{
          type: 'count',
          schema: 'metric'
        }]
      }, {
        group: 'buckets',
        name: 'segment',
        title: 'Bucket Split',
        min: 0,
        aggFilter: ['!geohash_grid', '!filter']
      }]),
    }
  });
}

VisTypesRegistryProvider.register(TreemapVisualizationProvider);