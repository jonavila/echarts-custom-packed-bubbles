/* global controller */
import './bubbles.css';
import { hierarchy, pack } from 'd3-hierarchy';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/custom';

// create chart container
const chartContainer = document.createElement('div');
chartContainer.style.width = '100%';
chartContainer.style.height = '100%';
chartContainer.classList.add('chart-container');
controller.element.appendChild(chartContainer);

// create data accessors
const groupAccessor = controller.dataAccessors['Group By'];
const metricAccessor = controller.dataAccessors['Bubble Size'];
const colorAccessor = controller.dataAccessors['Bubble Color'];

// default echarts config
const option = {
  textStyle: { fontFamily: 'Source Sans Pro' },
  series: {
    type: 'custom',
    coordinateSystem: 'none',
    label: { show: true, color: 'black', fontSize: 24, formatter: '{b}' },
  },
};

// init echarts
const chart = echarts.init(chartContainer);

// called when new data is received from server
controller.update = data => {
  const root = hierarchy(
    {
      values: data.map(d => ({
        key: groupAccessor.formatted(d, 0),
        values: [d],
      })),
    },
    d => d.values,
  )
    .sum(d => metricAccessor.raw(d))
    .each(node => {
      if (node.depth === 1) {
        node.model = node.children[0].data;
        delete node.children;
      }
    });

  option.series.renderItem = renderItem;
  option.series.data = root
    .descendants()
    .filter(node => node.data.key)
    .map(node => {
      if (node.data.key) {
        node.name = node.data.key;
      } else {
        node.name = 'root';
      }
      return {
        name: node.name,
        value: node.value,
        model: node.model,
        itemStyle: {
          opacity: 0.8,
          color: colorAccessor.color(node.model),
        },
        emphasis: { opacity: 1 },
      };
    });
  chart.setOption(option);

  function renderItem(params, api) {
    const context = params.context;
    if (!context.layout) {
      params.dataIndex === 0
        ? pack()
            .size([api.getWidth() - 2, api.getHeight() - 2])
            .padding(1.5)(root)
        : null;
      context.layout = {};
      root.descendants().forEach(node => {
        context.layout[node.name] = {
          x: node.x,
          y: node.y,
          r: node.r,
        };
      });
    }

    const nodePath = option.series.data[params.dataIndex].name;
    const itemLayout = context.layout[nodePath];

    let nodeName = nodePath;

    const chartModel = chart.getModel();
    const seriesComponent = chartModel.getComponent('series');
    const labelRect = seriesComponent.getModel('label').getTextRect(nodeName);
    const textScale = Math.min(
      2 * itemLayout.r,
      (2 * itemLayout.r - 8) / labelRect.width * 24,
    );
    const calculatedFontSize = Math.floor(textScale);

    return {
      type: 'circle',
      shape: {
        cx: itemLayout.x,
        cy: itemLayout.y,
        r: itemLayout.r,
      },
      style: api.style({
        text: nodeName,
        fontSize: calculatedFontSize > 24 ? 24 : calculatedFontSize,
      }),
      styleEmphasis: api.styleEmphasis(),
    };
  }
};

// add radial menu
chart.on('click', params => {
  controller.menu.show({
    event: params.event.event,
    data: () => params.data.model,
  });
});

// add tooltips
chart.on('mousemove', params => {
  controller.tooltip.show({
    event: params.event.event,
    data: () => params.data.model,
  });
});

// remove tooltips
chart.on('mouseout', controller.tooltip.hide);

// called when the chart widget is resized
controller.resize = (newWidth, newHeight) => {
  chart.resize();
};

// create group and metric pickers
controller.createAxisLabel({
  picks: 'Group By',
  orientation: 'horizontal',
  position: 'bottom',
  popoverTitle: 'Group',
});

controller.createAxisLabel({
  picks: 'Bubble Size',
  orientation: 'horizontal',
  position: 'bottom',
});

controller.createAxisLabel({
  picks: 'Bubble Color',
  orientation: 'horizontal',
  position: 'bottom',
});
