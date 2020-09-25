import { default as StyleMap } from './Style';
import { Circle, Fill, Icon, Stroke, Style, Text } from 'ol/style';

const selectPointStyle = new Style({
  image: new Circle({
    stroke: new Stroke({
      color: '#ff1744',
      width: 4,
    }),
    radius: 25,
  }),
});

const pointStyleMap = new StyleMap({
  identifier: 'point',
  styleFunction: function (opt) {
    return new Style({
      image: new Icon({
        opacity: opt.image.opacity,
        // 현재 svg 사용하면 IE 사용 불가
        src: `/assets/media/symbols/${opt.image.src}.png`,
        scale: opt.image.scale,
        rotateWithView: false,
      }),
      text: new Text({
        overflow: true,
        font: opt.text.font,
        placement: 'point',
        fill: new Fill({
          color: opt.text.color,
        }),
        stroke: new Stroke({
          color: opt.text.stroke,
          width: opt.text.width,
        }),
        offsetY: opt.text.offsetY,
      }),
    });
  },
});

export { pointStyleMap, selectPointStyle };
