import { Circle, Fill, Icon, Stroke, Style, Text } from 'ol/style';
import { default as StyleMap } from './Style';
import { MultiPoint } from 'ol/geom';

//선택시 지정되는 라인 스타일
const selectLineStyle = [
  new Style({
    stroke: new Stroke({
      color: '#f00',
      width: 4,
    }),
  }),
  new Style({
    image: new Circle({
      radius: 5,
      fill: new Fill({
        color: '#808080',
      }),
      stroke: new Stroke({
        color: "#ff0",
        width: 1
      })
    }),
    geometry: function (feature) {
      return new MultiPoint(feature.getGeometry().getCoordinates());
    },
  }),
];

export const selectLineStyles = [
  new Style({
  stroke: new Stroke({
    color: '#f00',
    width: 4,
  }),
})
];

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
        scale: 0.5,
        src: '/assets/media/symbols/A01.png',
        rotateWithView: true,
      }),
    });
  },
});

const measureStyle = new Style({
  fill: new Fill({
    color: '#FFFFFF33',
  }),
  stroke: new Stroke({
    color: '#00000080',
    lineDash: [10, 10],
    width: 2,
  }),
  image: new Circle({
    radius: 5,
    stroke: new Stroke({
      color: '#000000B3',
    }),
    fill: new Fill({
      color: '#FFFFFF33',
    }),
  }),
});

const measureResultStyle = new Style({
  fill: new Fill({
    color: '#FFFFFF33',
  }),
  stroke: new Stroke({
    color: '#FFCC33',
    width: 2,
  }),
  image: new Circle({
    radius: 7,
    fill: new Fill({
      color: '#FFCC33',
    }),
  }),
});

const labelStyle = new Text({
  // overflow: true,
  font: 'bold 0.9rem Noto Sans KR',
  placement: 'line',
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

export { lineStyleMap, selectLineStyle, closedPipeStyle, arrowheadStyle, measureStyle, measureResultStyle };
