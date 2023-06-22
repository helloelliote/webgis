import { default as projection } from '../projection';

export default class FileExport {

  constructor(options = {}) {
    this._map = options['map'];
    this._view = options['view'];

    this._host = `${window.webgis.geoserverHost}/geoserver/${window.webgis.workspace}/ows`;
    this._params = {
      exceptions: 'application/json',
      format_options: 'CHARSET:x-windows-949',
      request: 'GetFeature',
      service: 'WFS',
      srsName: projection.getCode(),
      version: '2.0.0',
    };
  }

  get bbox() {
    const extent = this._view.calculateExtent(this._map.getSize());
    return `${extent.join(',')},${projection.getCode()}`;
  }

  async _runExport(params) {
    try {
      const response = await fetch(this._host, {
        method: 'POST',
        body: new URLSearchParams(params),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${moment().format('YYMMDD')}_SHP.zip`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        const error = await response.json();
        console.error(error['exceptions'][0]['text']);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async exportShapefile(typeName) {
    const params = {
      ...this._params,
      bbox: this.bbox,
      outputFormat: 'SHAPE-ZIP', // 반드시 전체 대문자로 지정
      // propertyName: [
      //   'geom',
      //   '레이어',
      //   '관리번호',
      // ],
      typeName,
    };
    await this._runExport(params);
  }

  async exportDxf(typeName) {
    const params = {
      ...this._params,
      bbox: this.bbox,
      outputFormat: 'DXF-ZIP', // 반드시 전체 대문자로 지정
      typeName,
    };
    await this._runExport(params);
  }
}
