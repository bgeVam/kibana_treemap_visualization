import optionsTemplate from './options_template.html';
import TreemapVisualizationController from './treemap_vis_controller';
import {
  RequestHandlerProvider
} from './RequestHandlerProvider';
import {
  handleResponse
} from './ResponseHandler';
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
  const requestHandler = Private(RequestHandlerProvider);

  return VisFactory.createBaseVisualization({
    name: 'treemap_visualization',
    title: 'Treemap Visualization',
    icon: 'fa fa-gear',
    description: 'Treemap Visualization',
    category: CATEGORY.OTHER,
    visualization: TreemapVisualizationController,
    responseHandler: handleResponse,
    requestHandler: requestHandler.handle,
    editorConfig: {
      optionsTemplate: optionsTemplate,
      schemas: new Schemas([{
        group: 'buckets',
        name: 'field',
        title: 'Field',
        max: 2,
        min: 1,
        aggFilter: ['terms']
      }])
    }
  });
}

VisTypesRegistryProvider.register(TreemapVisualizationProvider);