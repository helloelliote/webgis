import { default as StyleMap } from './Style';
import { Style, Fill, Stroke, Icon, Text } from 'ol/style';

const selectLineStyle = new Style({
  stroke: new Stroke({
    color: '#f00',
    width: 4.5,
  }),
});

const closedPipeStyle = new Style({
  stroke: new Stroke({
    color: '#ff0000',
    width: 1.5,
    lineDash: [10, 5],
  }),
});

const arrowheadStyle = new StyleMap({
  identifier: 'line',
  styleFunction: function (opt) {
    return new Style({
      image: new Icon({
        anchor: [1.5, 0.55],
        color: opt.stroke.color,
        scale: 0.6,
        src: '/assets/media/symbols/A01.png',
        rotateWithView: true,
      }),
    });
  },
});

const labelStyle = new Text({
  // overflow: true,
  font: 'bold 0.95rem 맑은 고딕',
  placement: 'line',
  fill: new Fill({
    color: '#00f',
  }),
  stroke: new Stroke({
    color: '#fff',
    width: 3,
  }),
});

const lineStyleMap = new StyleMap({
  identifier: 'line',
  styleFunction: function (opt) {
    return new Style({
      stroke: new Stroke({
        color: opt.stroke.color,
        width: opt.stroke.width,
        lineDash: opt.stroke.dash,
      }),
      text: labelStyle,
    });
  },
});

export { lineStyleMap, selectLineStyle, closedPipeStyle, arrowheadStyle };
