/* global _ */

/*
 * Complex scripted dashboard
 * This script generates a dashboard object that Grafana can load. It also takes a number of user
 * supplied URL parameters (in the ARGS variable)
 *
 * Return a dashboard object, or a function
 *
 * For async scripts, return a function, this function must take a single callback function as argument,
 * call this callback function with the dashboard object (look at scripted_async.js for an example)
 */

'use strict';

// accessible variables in this scope
var window, document, ARGS, $, jQuery, moment, kbn;

// Setup some variables
var dashboard;

// All url parameters are available via the ARGS object
var ARGS;

/*// Initialize a skeleton with nothing but a rows array and service object
dashboard = {
  rows : [],
};

// Set a title
dashboard.title = 'Scripted dash';

// Set default time
// time can be overridden in the url using from/to parameters, but this is
// handled automatically in grafana core during dashboard initialization
dashboard.time = {
  from: "now-6h",
  to: "now"
};
*/
var rows = 1;
var seriesName = 'argName';

var showTemperature = "false";
var showPressure = "false";
var showGlucose = "false";
var showWeight = "false";
var showPulse = "false";
var showSpo2 = "false"
var showMovement = "false";

if(!_.isUndefined(ARGS.rows)) {
  rows = parseInt(ARGS.rows, 10);
}

if(!_.isUndefined(ARGS.name)) {
  seriesName = ARGS.name;
}

if(!_.isUndefined(ARGS.temperature)) {
  showTemperature = ARGS.temperature;
}

if(!_.isUndefined(ARGS.pressure)) {
  showPressure = ARGS.pressure;
}

if(!_.isUndefined(ARGS.glucose)) {
  showGlucose = ARGS.glucose;
}

if(!_.isUndefined(ARGS.weight)) {
  showWeight = ARGS.weight;
}

if(!_.isUndefined(ARGS.pulse)) {
  showPulse = ARGS.pulse;
}

if(!_.isUndefined(ARGS.spo2)) {
  showSpo2 = ARGS.spo2;
}

if(!_.isUndefined(ARGS.movement)) {
  showMovement = ARGS.movement;
}

var toPush = {
  "annotations": {
    "list": [
      {
        "builtIn": 1,
        "datasource": "-- Grafana --",
        "enable": true,
        "hide": true,
        "iconColor": "rgba(0, 211, 255, 1)",
        "name": "Annotations & Alerts",
        "type": "dashboard"
      }
    ]
  },
  "description": "Prova con Broccio per visualizzazione lato portale Sempre Vicini",
  "editable": true,
  "gnetId": null,
  "graphTooltip": 0,
  "id": 3,
  "iteration": 1554199113158,
  "links": [],
  "panels": [
  ],
  "refresh": "5s",
  "schemaVersion": 16,
  "style": "dark",
  "tags": [],
  "templating": {
    "list": [
      {
        "allValue": null,
        "current": {
          "text": "f22c7811-e55c-4412-9d2e-aa0700c555ce",
          "value": "f22c7811-e55c-4412-9d2e-aa0700c555ce"
        },
        "datasource": "giomi",
        "definition": "SHOW TAG VALUES WITH KEY=processInstanceId",
        "hide": 0,
        "includeAll": false,
        "label": "processInstanceId",
        "multi": false,
        "name": "processInstanceId",
        "options": [],
        "query": "SHOW TAG VALUES WITH KEY=processInstanceId",
        "refresh": 1,
        "regex": "",
        "skipUrlSync": false,
        "sort": 0,
        "tagValuesQuery": "",
        "tags": [],
        "tagsQuery": "",
        "type": "query",
        "useTags": false
      }
    ]
  },
  "time": {
    "from": "now-24h",
    "to": "now"
  },
  "timepicker": {
    "refresh_intervals": [
      "5s",
      "10s",
      "30s",
      "1m",
      "5m",
      "15m",
      "30m",
      "1h",
      "2h",
      "1d"
    ],
    "time_options": [
      "5m",
      "15m",
      "1h",
      "6h",
      "12h",
      "24h",
      "2d",
      "7d",
      "30d"
    ]
  },
  "timezone": "",
  "title": "Test Sempre Vicini",
  "uid": "XFWJlkuiz",
  "version": 99
};
var diastolicGauge = {
  "cacheTimeout": null,
  "colorBackground": false,
  "colorValue": false,
  "colors": [
    "#e0f9d7",
    "#9ac48a",
    "#7eb26d"
  ],
  "format": "none",
  "gauge": {
    "maxValue": 200,
    "minValue": 0,
    "show": true,
    "thresholdLabels": false,
    "thresholdMarkers": true
  },
  "gridPos": {
    "h": 6,
    "w": 4,
    "x": 0,
    "y": 24
  },
  "id": 22,
  "interval": null,
  "links": [],
  "mappingType": 1,
  "mappingTypes": [
    {
      "name": "value to text",
      "value": 1
    },
    {
      "name": "range to text",
      "value": 2
    }
  ],
  "maxDataPoints": 100,
  "nullPointMode": "connected",
  "nullText": null,
  "postfix": " mmHg",
  "postfixFontSize": "50%",
  "prefix": "",
  "prefixFontSize": "50%",
  "rangeMaps": [
    {
      "from": "null",
      "text": "N/A",
      "to": "null"
    }
  ],
  "sparkline": {
    "fillColor": "rgba(31, 118, 189, 0.18)",
    "full": false,
    "lineColor": "rgb(31, 120, 193)",
    "show": false
  },
  "tableColumn": "",
  "targets": [
    {
      "alias": "Pressione minima",
      "groupBy": [],
      "measurement": "diastolic",
      "orderByTime": "ASC",
      "policy": "default",
      "refId": "A",
      "resultFormat": "time_series",
      "select": [
        [
          {
            "params": [
              "diastolic"
            ],
            "type": "field"
          }
        ]
      ],
      "tags": [
        {
          "key": "processInstanceId",
          "operator": "=~",
          "value": "/^$processInstanceId$/"
        }
      ]
    }
  ],
  "thresholds": "70,140",
  "title": "Diastolica",
  "type": "singlestat",
  "valueFontSize": "50%",
  "valueMaps": [
    {
      "op": "=",
      "text": "N/A",
      "value": "null"
    }
  ],
  "valueName": "current"
};
var systolicGauge = {
  "cacheTimeout": null,
  "colorBackground": false,
  "colorValue": false,
  "colors": [
    "#9ac48a",
    "#629e51",
    "#3f6833"
  ],
  "format": "none",
  "gauge": {
    "maxValue": 200,
    "minValue": 0,
    "show": true,
    "thresholdLabels": false,
    "thresholdMarkers": true
  },
  "gridPos": {
    "h": 6,
    "w": 4,
    "x": 4,
    "y": 24
  },
  "id": 23,
  "interval": null,
  "links": [],
  "mappingType": 1,
  "mappingTypes": [
    {
      "name": "value to text",
      "value": 1
    },
    {
      "name": "range to text",
      "value": 2
    }
  ],
  "maxDataPoints": 100,
  "nullPointMode": "connected",
  "nullText": null,
  "postfix": " mmHg",
  "postfixFontSize": "50%",
  "prefix": "",
  "prefixFontSize": "50%",
  "rangeMaps": [
    {
      "from": "null",
      "text": "N/A",
      "to": "null"
    }
  ],
  "sparkline": {
    "fillColor": "rgba(31, 118, 189, 0.18)",
    "full": false,
    "lineColor": "rgb(31, 120, 193)",
    "show": false
  },
  "tableColumn": "",
  "targets": [
    {
      "alias": "Pressione Massima",
      "groupBy": [],
      "measurement": "systolic",
      "orderByTime": "ASC",
      "policy": "default",
      "refId": "A",
      "resultFormat": "time_series",
      "select": [
        [
          {
            "params": [
              "systolic"
            ],
            "type": "field"
          }
        ]
      ],
      "tags": [
        {
          "key": "processInstanceId",
          "operator": "=~",
          "value": "/^$processInstanceId$/"
        }
      ]
    }
  ],
  "thresholds": "60,140",
  "title": "Sistolica",
  "type": "singlestat",
  "valueFontSize": "50%",
  "valueMaps": [
    {
      "op": "=",
      "text": "N/A",
      "value": "null"
    }
  ],
  "valueName": "current"
};
var spo2Gauge = {
  "cacheTimeout": null,
  "colorBackground": false,
  "colorValue": false,
  "colors": [
    "#badff4",
    "#82b5d8",
    "#5195ce"
  ],
  "format": "none",
  "gauge": {
    "maxValue": 100,
    "minValue": 0,
    "show": true,
    "thresholdLabels": false,
    "thresholdMarkers": true
  },
  "gridPos": {
    "h": 6,
    "w": 8,
    "x": 0,
    "y": 6
  },
  "id": 24,
  "interval": null,
  "links": [],
  "mappingType": 1,
  "mappingTypes": [
    {
      "name": "value to text",
      "value": 1
    },
    {
      "name": "range to text",
      "value": 2
    }
  ],
  "maxDataPoints": 100,
  "nullPointMode": "connected",
  "nullText": null,
  "postfix": " %",
  "postfixFontSize": "50%",
  "prefix": "",
  "prefixFontSize": "50%",
  "rangeMaps": [
    {
      "from": "null",
      "text": "N/A",
      "to": "null"
    }
  ],
  "sparkline": {
    "fillColor": "rgba(31, 118, 189, 0.18)",
    "full": false,
    "lineColor": "rgb(31, 120, 193)",
    "show": false
  },
  "tableColumn": "",
  "targets": [
    {
      "alias": "Ossigenazione del sangue",
      "groupBy": [],
      "measurement": "spo2",
      "orderByTime": "ASC",
      "policy": "default",
      "refId": "A",
      "resultFormat": "time_series",
      "select": [
        [
          {
            "params": [
              "spo2"
            ],
            "type": "field"
          }
        ]
      ],
      "tags": [
        {
          "key": "processInstanceId",
          "operator": "=~",
          "value": "/^$processInstanceId$/"
        }
      ]
    }
  ],
  "thresholds": "80,90",
  "title": "Ossigenazione del sangue",
  "type": "singlestat",
  "valueFontSize": "80%",
  "valueMaps": [
    {
      "op": "=",
      "text": "N/A",
      "value": "null"
    }
  ],
  "valueName": "current"
};
var pulseGauge = {
  "cacheTimeout": null,
  "colorBackground": false,
  "colorValue": false,
  "colors": [
    "#82b5d8",
    "#9ac48a",
    "#ea6460"
  ],
  "format": "none",
  "gauge": {
    "maxValue": 200,
    "minValue": 0,
    "show": true,
    "thresholdLabels": false,
    "thresholdMarkers": true
  },
  "gridPos": {
    "h": 6,
    "w": 8,
    "x": 0,
    "y": 0
  },
  "id": 25,
  "interval": null,
  "links": [],
  "mappingType": 1,
  "mappingTypes": [
    {
      "name": "value to text",
      "value": 1
    },
    {
      "name": "range to text",
      "value": 2
    }
  ],
  "maxDataPoints": 100,
  "nullPointMode": "connected",
  "nullText": null,
  "postfix": " bpm",
  "postfixFontSize": "50%",
  "prefix": "",
  "prefixFontSize": "50%",
  "rangeMaps": [
    {
      "from": "null",
      "text": "N/A",
      "to": "null"
    }
  ],
  "sparkline": {
    "fillColor": "rgba(31, 118, 189, 0.18)",
    "full": false,
    "lineColor": "rgb(31, 120, 193)",
    "show": false
  },
  "tableColumn": "",
  "targets": [
    {
      "alias": "Battiti cardiaci",
      "groupBy": [],
      "measurement": "pulse",
      "orderByTime": "ASC",
      "policy": "default",
      "refId": "A",
      "resultFormat": "time_series",
      "select": [
        [
          {
            "params": [
              "pulse"
            ],
            "type": "field"
          }
        ]
      ],
      "tags": [
        {
          "key": "processInstanceId",
          "operator": "=~",
          "value": "/^$processInstanceId$/"
        }
      ]
    }
  ],
  "thresholds": "30,170",
  "title": "Battiti",
  "type": "singlestat",
  "valueFontSize": "70%",
  "valueMaps": [
    {
      "op": "=",
      "text": "N/A",
      "value": "null"
    }
  ],
  "valueName": "current"
};
var temperatureGauge =  {
  "cacheTimeout": null,
  "colorBackground": false,
  "colorValue": false,
  "colors": [
    "#1f78c1",
    "#7eb26d",
    "#ea6460"
  ],
  "decimals": 1,
  "format": "celsius",
  "gauge": {
    "maxValue": 72,
    "minValue": 0,
    "show": true,
    "thresholdLabels": false,
    "thresholdMarkers": true
  },
  "gridPos": {
    "h": 6,
    "w": 8,
    "x": 0,
    "y": 12
  },
  "id": 26,
  "interval": null,
  "links": [],
  "mappingType": 1,
  "mappingTypes": [
    {
      "name": "value to text",
      "value": 1
    },
    {
      "name": "range to text",
      "value": 2
    }
  ],
  "maxDataPoints": 100,
  "nullPointMode": "connected",
  "nullText": null,
  "postfix": "",
  "postfixFontSize": "50%",
  "prefix": "",
  "prefixFontSize": "50%",
  "rangeMaps": [
    {
      "from": "null",
      "text": "N/A",
      "to": "null"
    }
  ],
  "sparkline": {
    "fillColor": "rgba(31, 118, 189, 0.18)",
    "full": false,
    "lineColor": "rgb(31, 120, 193)",
    "show": false
  },
  "tableColumn": "",
  "targets": [
    {
      "alias": "Temperatura corporea",
      "groupBy": [],
      "measurement": "temperature",
      "orderByTime": "ASC",
      "policy": "default",
      "refId": "A",
      "resultFormat": "time_series",
      "select": [
        [
          {
            "params": [
              "temperature"
            ],
            "type": "field"
          }
        ]
      ],
      "tags": [
        {
          "key": "processInstanceId",
          "operator": "=~",
          "value": "/^$processInstanceId$/"
        }
      ]
    }
  ],
  "thresholds": "35,37",
  "title": "Temperatura corporea",
  "type": "singlestat",
  "valueFontSize": "70%",
  "valueMaps": [
    {
      "op": "=",
      "text": "N/A",
      "value": "null"
    }
  ],
  "valueName": "current"
};
var weightGauge = {
  "cacheTimeout": null,
  "colorBackground": false,
  "colorValue": false,
  "colors": [
    "#6ed0e0",
    "#6ed0e0",
    "#6ed0e0"
  ],
  "decimals": 1,
  "format": "masskg",
  "gauge": {
    "maxValue": 200,
    "minValue": 0,
    "show": true,
    "thresholdLabels": false,
    "thresholdMarkers": true
  },
  "gridPos": {
    "h": 6,
    "w": 8,
    "x": 0,
    "y": 30
  },
  "id": 20,
  "interval": null,
  "links": [],
  "mappingType": 1,
  "mappingTypes": [
    {
      "name": "value to text",
      "value": 1
    },
    {
      "name": "range to text",
      "value": 2
    }
  ],
  "maxDataPoints": 100,
  "nullPointMode": "connected",
  "nullText": null,
  "postfix": "",
  "postfixFontSize": "50%",
  "prefix": "",
  "prefixFontSize": "50%",
  "rangeMaps": [
    {
      "from": "null",
      "text": "N/A",
      "to": "null"
    }
  ],
  "sparkline": {
    "fillColor": "rgba(31, 118, 189, 0.18)",
    "full": false,
    "lineColor": "rgb(31, 120, 193)",
    "show": false
  },
  "tableColumn": "",
  "targets": [
    {
      "alias": "Peso Corporeo",
      "groupBy": [],
      "measurement": "weight",
      "orderByTime": "ASC",
      "policy": "default",
      "refId": "A",
      "resultFormat": "time_series",
      "select": [
        [
          {
            "params": [
              "weight"
            ],
            "type": "field"
          }
        ]
      ],
      "tags": [
        {
          "key": "processInstanceId",
          "operator": "=~",
          "value": "/^$processInstanceId$/"
        }
      ]
    }
  ],
  "thresholds": "0,0",
  "title": "Peso Corporeo",
  "type": "singlestat",
  "valueFontSize": "70%",
  "valueMaps": [
    {
      "op": "=",
      "text": "N/A",
      "value": "null"
    }
  ],
  "valueName": "current"
};
var glucoseGauge = {
  "cacheTimeout": null,
  "colorBackground": false,
  "colorValue": false,
  "colors": [
    "#fce2de",
    "#f29191",
    "#e24d42"
  ],
  "format": "none",
  "gauge": {
    "maxValue": 210,
    "minValue": 50,
    "show": true,
    "thresholdLabels": false,
    "thresholdMarkers": true
  },
  "gridPos": {
    "h": 6,
    "w": 8,
    "x": 0,
    "y": 18
  },
  "id": 21,
  "interval": null,
  "links": [],
  "mappingType": 1,
  "mappingTypes": [
    {
      "name": "value to text",
      "value": 1
    },
    {
      "name": "range to text",
      "value": 2
    }
  ],
  "maxDataPoints": 100,
  "nullPointMode": "connected",
  "nullText": null,
  "postfix": " mg/dl",
  "postfixFontSize": "50%",
  "prefix": "",
  "prefixFontSize": "50%",
  "rangeMaps": [
    {
      "from": "null",
      "text": "N/A",
      "to": "null"
    }
  ],
  "sparkline": {
    "fillColor": "rgba(31, 118, 189, 0.18)",
    "full": false,
    "lineColor": "rgb(31, 120, 193)",
    "show": false
  },
  "tableColumn": "",
  "targets": [
    {
      "alias": "Glucosio",
      "groupBy": [],
      "measurement": "glucose",
      "orderByTime": "ASC",
      "policy": "default",
      "refId": "A",
      "resultFormat": "time_series",
      "select": [
        [
          {
            "params": [
              "glucose"
            ],
            "type": "field"
          }
        ]
      ],
      "tags": [
        {
          "key": "processInstanceId",
          "operator": "=~",
          "value": "/^$processInstanceId$/"
        }
      ]
    }
  ],
  "thresholds": "60,140",
  "title": "Glucosio",
  "type": "singlestat",
  "valueFontSize": "50%",
  "valueMaps": [
    {
      "op": "=",
      "text": "N/A",
      "value": "null"
    }
  ],
  "valueName": "current"
};
var pulseGraph = {
  "aliasColors": {},
  "bars": false,
  "dashLength": 10,
  "dashes": false,
  "fill": 1,
  "gridPos": {
    "h": 6,
    "w": 16,
    "x": 8,
    "y": 0
  },
  "id": 2,
  "legend": {
    "alignAsTable": false,
    "avg": false,
    "current": true,
    "max": true,
    "min": true,
    "rightSide": false,
    "show": true,
    "sideWidth": null,
    "total": false,
    "values": true
  },
  "lines": true,
  "linewidth": 1,
  "links": [],
  "nullPointMode": "null",
  "percentage": false,
  "pointradius": 5,
  "points": true,
  "renderer": "flot",
  "seriesOverrides": [],
  "spaceLength": 10,
  "stack": false,
  "steppedLine": false,
  "targets": [
    {
      "alias": "Battiti (bpm)",
      "groupBy": [],
      "measurement": "pulse",
      "orderByTime": "ASC",
      "policy": "default",
      "refId": "A",
      "resultFormat": "time_series",
      "select": [
        [
          {
            "params": [
              "pulse"
            ],
            "type": "field"
          },
          {
            "params": [
              "Frequency"
            ],
            "type": "alias"
          }
        ]
      ],
      "tags": [
        {
          "key": "processInstanceId",
          "operator": "=~",
          "value": "/^$processInstanceId$/"
        }
      ]
    }
  ],
  "thresholds": [],
  "timeFrom": null,
  "timeRegions": [],
  "timeShift": null,
  "title": "Battiti",
  "tooltip": {
    "shared": true,
    "sort": 0,
    "value_type": "individual"
  },
  "transparent": false,
  "type": "graph",
  "xaxis": {
    "buckets": null,
    "mode": "time",
    "name": null,
    "show": true,
    "values": []
  },
  "yaxes": [
    {
      "format": "none",
      "label": "",
      "logBase": 1,
      "max": null,
      "min": null,
      "show": true
    },
    {
      "format": "short",
      "label": "",
      "logBase": 1,
      "max": null,
      "min": null,
      "show": true
    }
  ],
  "yaxis": {
    "align": false,
    "alignLevel": null
  }
};
var spo2Graph = {
  "aliasColors": {},
  "bars": false,
  "dashLength": 10,
  "dashes": false,
  "fill": 1,
  "gridPos": {
    "h": 6,
    "w": 16,
    "x": 8,
    "y": 6
  },
  "id": 29,
  "legend": {
    "alignAsTable": false,
    "avg": false,
    "current": true,
    "max": true,
    "min": true,
    "rightSide": false,
    "show": true,
    "sideWidth": null,
    "total": false,
    "values": true
  },
  "lines": true,
  "linewidth": 1,
  "links": [],
  "nullPointMode": "null",
  "percentage": false,
  "pointradius": 5,
  "points": true,
  "renderer": "flot",
  "seriesOverrides": [],
  "spaceLength": 10,
  "stack": false,
  "steppedLine": false,
  "targets": [
    {
      "alias": "Ossigenazione (%)",
      "groupBy": [],
      "measurement": "spo2",
      "orderByTime": "ASC",
      "policy": "default",
      "refId": "A",
      "resultFormat": "time_series",
      "select": [
        [
          {
            "params": [
              "spo2"
            ],
            "type": "field"
          },
          {
            "params": [
              "Frequency"
            ],
            "type": "alias"
          }
        ]
      ],
      "tags": [
        {
          "key": "processInstanceId",
          "operator": "=~",
          "value": "/^$processInstanceId$/"
        }
      ]
    }
  ],
  "thresholds": [],
  "timeFrom": null,
  "timeRegions": [],
  "timeShift": null,
  "title": "Ossigenazione del sangue",
  "tooltip": {
    "shared": true,
    "sort": 0,
    "value_type": "individual"
  },
  "transparent": false,
  "type": "graph",
  "xaxis": {
    "buckets": null,
    "mode": "time",
    "name": null,
    "show": true,
    "values": []
  },
  "yaxes": [
    {
      "format": "none",
      "label": "",
      "logBase": 1,
      "max": null,
      "min": null,
      "show": true
    },
    {
      "format": "short",
      "label": "",
      "logBase": 1,
      "max": null,
      "min": null,
      "show": true
    }
  ],
  "yaxis": {
    "align": false,
    "alignLevel": null
  }
};
var temperatureGraph =  {
  "aliasColors": {
    "Temperatura": "#eab839"
  },
  "bars": false,
  "dashLength": 10,
  "dashes": false,
  "decimals": null,
  "fill": 1,
  "gridPos": {
    "h": 6,
    "w": 16,
    "x": 8,
    "y": 12
  },
  "id": 13,
  "legend": {
    "alignAsTable": false,
    "avg": false,
    "current": true,
    "hideEmpty": false,
    "max": true,
    "min": true,
    "rightSide": false,
    "show": true,
    "sideWidth": null,
    "total": false,
    "values": true
  },
  "lines": true,
  "linewidth": 1,
  "links": [],
  "nullPointMode": "null",
  "percentage": false,
  "pointradius": 5,
  "points": true,
  "renderer": "flot",
  "seriesOverrides": [],
  "spaceLength": 10,
  "stack": false,
  "steppedLine": false,
  "targets": [
    {
      "alias": "Temperatura (°C)",
      "groupBy": [],
      "measurement": "temperature",
      "orderByTime": "ASC",
      "policy": "default",
      "query": "SELECT \"temperature\" FROM \"thermometer\" WHERE (\"processInstanceId\" =~ /^$processInstanceId$/) AND $timeFilter",
      "rawQuery": false,
      "refId": "A",
      "resultFormat": "time_series",
      "select": [
        [
          {
            "params": [
              "temperature"
            ],
            "type": "field"
          }
        ]
      ],
      "tags": [
        {
          "key": "processInstanceId",
          "operator": "=~",
          "value": "/^$processInstanceId$/"
        }
      ]
    }
  ],
  "thresholds": [],
  "timeFrom": null,
  "timeRegions": [],
  "timeShift": null,
  "title": "Temperatura corporea",
  "tooltip": {
    "shared": true,
    "sort": 0,
    "value_type": "individual"
  },
  "type": "graph",
  "xaxis": {
    "buckets": null,
    "mode": "time",
    "name": null,
    "show": true,
    "values": []
  },
  "yaxes": [
    {
      "decimals": 1,
      "format": "short",
      "label": null,
      "logBase": 1,
      "max": null,
      "min": null,
      "show": true
    },
    {
      "format": "short",
      "label": null,
      "logBase": 1,
      "max": null,
      "min": null,
      "show": true
    }
  ],
  "yaxis": {
    "align": false,
    "alignLevel": null
  }
};
var glucoseGraph = {
  "aliasColors": {
    "Glucosio": "#967302"
  },
  "bars": false,
  "dashLength": 10,
  "dashes": false,
  "fill": 1,
  "gridPos": {
    "h": 6,
    "w": 16,
    "x": 8,
    "y": 18
  },
  "id": 16,
  "legend": {
    "alignAsTable": false,
    "avg": false,
    "current": true,
    "max": true,
    "min": true,
    "rightSide": false,
    "show": true,
    "total": false,
    "values": true
  },
  "lines": true,
  "linewidth": 1,
  "links": [],
  "nullPointMode": "null",
  "percentage": false,
  "pointradius": 5,
  "points": true,
  "renderer": "flot",
  "seriesOverrides": [],
  "spaceLength": 10,
  "stack": false,
  "steppedLine": false,
  "targets": [
    {
      "alias": "Glucosio (mg/dl)",
      "groupBy": [],
      "measurement": "glucose",
      "orderByTime": "ASC",
      "policy": "default",
      "refId": "A",
      "resultFormat": "time_series",
      "select": [
        [
          {
            "params": [
              "glucose"
            ],
            "type": "field"
          }
        ]
      ],
      "tags": [
        {
          "key": "processInstanceId",
          "operator": "=~",
          "value": "/^$processInstanceId$/"
        }
      ]
    }
  ],
  "thresholds": [],
  "timeFrom": null,
  "timeRegions": [],
  "timeShift": null,
  "title": "Glucosio",
  "tooltip": {
    "shared": true,
    "sort": 0,
    "value_type": "individual"
  },
  "type": "graph",
  "xaxis": {
    "buckets": null,
    "mode": "time",
    "name": null,
    "show": true,
    "values": []
  },
  "yaxes": [
    {
      "format": "short",
      "label": null,
      "logBase": 1,
      "max": null,
      "min": null,
      "show": true
    },
    {
      "format": "short",
      "label": null,
      "logBase": 1,
      "max": null,
      "min": null,
      "show": true
    }
  ],
  "yaxis": {
    "align": false,
    "alignLevel": null
  }
};
var pressureGraph = {
  "aliasColors": {
    "Diastolica": "#70dbed",
    "Sistolica": "#f9934e"
  },
  "bars": false,
  "dashLength": 10,
  "dashes": false,
  "fill": 1,
  "gridPos": {
    "h": 6,
    "w": 16,
    "x": 8,
    "y": 24
  },
  "id": 12,
  "legend": {
    "alignAsTable": false,
    "avg": false,
    "current": true,
    "max": true,
    "min": true,
    "rightSide": false,
    "show": true,
    "total": false,
    "values": true
  },
  "lines": true,
  "linewidth": 1,
  "links": [],
  "nullPointMode": "null",
  "percentage": false,
  "pointradius": 5,
  "points": true,
  "renderer": "flot",
  "seriesOverrides": [],
  "spaceLength": 10,
  "stack": false,
  "steppedLine": false,
  "targets": [
    {
      "alias": "Sistolica (mmHg)",
      "groupBy": [],
      "measurement": "systolic",
      "orderByTime": "ASC",
      "policy": "default",
      "refId": "A",
      "resultFormat": "time_series",
      "select": [
        [
          {
            "params": [
              "systolic"
            ],
            "type": "field"
          }
        ]
      ],
      "tags": [
        {
          "key": "processInstanceId",
          "operator": "=~",
          "value": "/^$processInstanceId$/"
        }
      ]
    },
    {
      "alias": "Diastolica (mmHg)",
      "groupBy": [],
      "measurement": "diastolic",
      "orderByTime": "ASC",
      "policy": "default",
      "refId": "B",
      "resultFormat": "time_series",
      "select": [
        [
          {
            "params": [
              "diastolic"
            ],
            "type": "field"
          }
        ]
      ],
      "tags": [
        {
          "key": "processInstanceId",
          "operator": "=~",
          "value": "/^$processInstanceId$/"
        }
      ]
    }
  ],
  "thresholds": [],
  "timeFrom": null,
  "timeRegions": [],
  "timeShift": null,
  "title": "Pressione sanguigna",
  "tooltip": {
    "shared": true,
    "sort": 0,
    "value_type": "individual"
  },
  "type": "graph",
  "xaxis": {
    "buckets": null,
    "mode": "time",
    "name": null,
    "show": true,
    "values": []
  },
  "yaxes": [
    {
      "format": "short",
      "label": null,
      "logBase": 1,
      "max": null,
      "min": null,
      "show": true
    },
    {
      "format": "short",
      "label": null,
      "logBase": 1,
      "max": null,
      "min": null,
      "show": true
    }
  ],
  "yaxis": {
    "align": false,
    "alignLevel": null
  }
};
var weightGraph =  {
  "aliasColors": {
    "Peso": "#962d82"
  },
  "bars": false,
  "dashLength": 10,
  "dashes": false,
  "fill": 1,
  "gridPos": {
    "h": 6,
    "w": 16,
    "x": 8,
    "y": 30
  },
  "id": 14,
  "legend": {
    "alignAsTable": false,
    "avg": false,
    "current": true,
    "max": true,
    "min": true,
    "rightSide": false,
    "show": true,
    "total": false,
    "values": true
  },
  "lines": true,
  "linewidth": 1,
  "links": [],
  "nullPointMode": "null",
  "percentage": false,
  "pointradius": 5,
  "points": true,
  "renderer": "flot",
  "seriesOverrides": [],
  "spaceLength": 10,
  "stack": false,
  "steppedLine": false,
  "targets": [
    {
      "alias": "Peso (Kg)",
      "groupBy": [],
      "measurement": "weight",
      "orderByTime": "ASC",
      "policy": "default",
      "refId": "A",
      "resultFormat": "time_series",
      "select": [
        [
          {
            "params": [
              "weight"
            ],
            "type": "field"
          }
        ]
      ],
      "tags": [
        {
          "key": "processInstanceId",
          "operator": "=~",
          "value": "/^$processInstanceId$/"
        }
      ]
    }
  ],
  "thresholds": [],
  "timeFrom": null,
  "timeRegions": [],
  "timeShift": null,
  "title": "Peso Corporeo",
  "tooltip": {
    "shared": true,
    "sort": 0,
    "value_type": "individual"
  },
  "type": "graph",
  "xaxis": {
    "buckets": null,
    "mode": "time",
    "name": null,
    "show": true,
    "values": []
  },
  "yaxes": [
    {
      "decimals": 1,
      "format": "short",
      "label": null,
      "logBase": 1,
      "max": null,
      "min": null,
      "show": true
    },
    {
      "format": "short",
      "label": null,
      "logBase": 1,
      "max": null,
      "min": null,
      "show": true
    }
  ],
  "yaxis": {
    "align": false,
    "alignLevel": null
  }
};
var movementGraph =  {
  "aliasColors": {
    "Movimento": "#aea2e0",
    "movement.mean": "#1f78c1",
    "movement.motion": "#6ed0e0"
  },
  "bars": true,
  "dashLength": 10,
  "dashes": false,
  "fill": 1,
  "gridPos": {
    "h": 6,
    "w": 24,
    "x": 0,
    "y": 36
  },
  "id": 18,
  "legend": {
    "alignAsTable": false,
    "avg": false,
    "current": false,
    "hideEmpty": false,
    "hideZero": false,
    "max": false,
    "min": false,
    "rightSide": false,
    "show": true,
    "total": false,
    "values": false
  },
  "lines": false,
  "linewidth": 3,
  "links": [],
  "nullPointMode": "null",
  "percentage": false,
  "pointradius": 2,
  "points": true,
  "renderer": "flot",
  "seriesOverrides": [],
  "spaceLength": 10,
  "stack": false,
  "steppedLine": true,
  "targets": [
    {
      "alias": "Movimento",
      "groupBy": [],
      "measurement": "movement",
      "orderByTime": "ASC",
      "policy": "default",
      "refId": "A",
      "resultFormat": "time_series",
      "select": [
        [
          {
            "params": [
              "motion"
            ],
            "type": "field"
          }
        ]
      ],
      "tags": [
        {
          "key": "processInstanceId",
          "operator": "=~",
          "value": "/^$processInstanceId$/"
        }
      ]
    }
  ],
  "thresholds": [],
  "timeFrom": null,
  "timeRegions": [],
  "timeShift": null,
  "title": "Camera",
  "tooltip": {
    "shared": true,
    "sort": 0,
    "value_type": "individual"
  },
  "type": "graph",
  "xaxis": {
    "buckets": null,
    "mode": "time",
    "name": null,
    "show": true,
    "values": []
  },
  "yaxes": [
    {
      "format": "short",
      "label": null,
      "logBase": 1,
      "max": null,
      "min": null,
      "show": false
    },
    {
      "format": "short",
      "label": null,
      "logBase": 1,
      "max": null,
      "min": null,
      "show": false
    }
  ],
  "yaxis": {
    "align": false,
    "alignLevel": null
  }
};




if(showTemperature == "true"){
  toPush.panels.push(temperatureGauge);
  toPush.panels.push(temperatureGraph);
}

if(showPressure == "true"){
  toPush.panels.push(systolicGauge);
  toPush.panels.push(diastolicGauge);
  toPush.panels.push(pressureGraph);
}

if(showGlucose == "true"){
  toPush.panels.push(glucoseGauge);
  toPush.panels.push(glucoseGraph);
}

if(showWeight == "true"){
  toPush.panels.push(weightGauge);
  toPush.panels.push(weightGraph);
}

if(showPulse == "true"){
  toPush.panels.push(pulseGauge);
  toPush.panels.push(pulseGraph);
}

if(showSpo2 == "true"){
  toPush.panels.push(spo2Gauge);
  toPush.panels.push(spo2Graph);
}

if(showMovement == "true"){
  toPush.panels.push(movementGraph);
}

return toPush;
