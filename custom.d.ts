declare module "*.svg" {
    const content: any;
    export default content;
  }

  declare module "*.png" {
    const content: any;
    export default content;
  }

  declare module "d3" {
    export { scaleOrdinal } from "d3-scale";
    export { select } from "d3-selection";
    export { schemeCategory10 } from "d3-scale-chromatic";
    export { arc, pie } from "d3-shape";
  }
