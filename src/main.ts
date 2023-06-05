import "./style.css";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import FeatureLayerView from "@arcgis/core/views/layers/FeatureLayerView";

async function main() {
  const map = new Map({
    basemap: "topo-vector",
  });

  const view = new MapView({
    map,
    container: "viewDiv",
    center: [-98.5795, 39.8283],
    zoom: 4,
  });

  const statesLayer = new FeatureLayer({
    id: "states",
    url:
      "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_States_Generalized_Boundaries/FeatureServer",
  });
  map.add(statesLayer);

  let stateLV: FeatureLayerView = await view.whenLayerView(statesLayer);

  // highlight the state that is clicked.  Only highlight one state at a time.
  let highlight: __esri.Handle;
  view.on("click", async (event) => {
    const hitResponse = await view.hitTest(event);
    const hitResults = hitResponse.results.filter(
      (hit) => hit.type === "graphic" && hit.graphic.layer === statesLayer,
    ) as __esri.GraphicHit[];

    if (hitResults.length) {
      const state = hitResults[0].graphic;

      if (highlight) highlight.remove();

      highlight = stateLV.highlight(state);
    }
  });
}

main();
