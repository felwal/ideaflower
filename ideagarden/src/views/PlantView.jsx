import blobshape from "blobshape";
import { randomInt } from "@/utils/mathUtils";

export default function PlantView(props) {
  function renderLeaves() {
    const {leafColor, leafColorDk} = getLeafColors(props.idea);
    const paintId = "gradient_leaf_" + props.idea.epoch;

    if (!props.idea.leafPath) {
      const {path} = blobshape({size: 100, growth: randomInt(5, 7), edges: randomInt(9, 15)});
      props.idea.leafPath = path;
    }

    return (
      <svg width="100%" height="auto" viewBox="0 0 100 100">
        <path d={props.idea.leafPath} fill={"url(#" + paintId + ")"} />
        <defs>
          <linearGradient id={paintId} x1="100" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
            <stop stop-color={leafColor} />
            <stop offset="1" stop-color={leafColorDk} />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  function renderSeed() {
    function renderWater() {
      // approximate the water level that would correspond to
      // the percentage of the volume (area) that would fit within the drop shape
      const dropRadius = 11;
      const yIntersect = dropRadius * (1 + Math.cos(Math.PI / 4));
      const intersectWidth = Math.sqrt(dropRadius ** 2 - (yIntersect - dropRadius) ** 2);
      const dropHeight = yIntersect + intersectWidth;
      const progressNormalised = Math.min(props.waterProgress, 1);
      const waterHeight = parseFloat((dropHeight / Math.PI * Math.acos(1 - 2 * progressNormalised)).toFixed(2));
      const yWaterLevel = parseFloat((dropHeight - waterHeight).toFixed(2));

      return (
        <>
          <path d="M42.7782 23.3345C47.0739 19.0388 47.0739 12.0739 42.7782 7.77817L35 0L27.2218 7.77817C22.9261 12.0739 22.9261 19.0388 27.2218 23.3345C31.5176 27.6303 38.4824 27.6303 42.7782 23.3345Z" fill="url(#gradient_water)" mask="url(#mask_water_level)" />
          <defs>
            <mask id="mask_water_level">
              <rect x="24" width="22" height={yWaterLevel} fill="white" fill-opacity="var(--alpha-water-empty)" />
              <rect x="24" y={yWaterLevel} width="22" height={waterHeight} fill="white" fill-opacity="1" />
            </mask>
            <linearGradient id="gradient_water" x1="46" y1="0" x2="29.6966" y2="30.0869" gradientUnits="userSpaceOnUse">
              <stop stop-color="var(--color-water-light)" />
              <stop offset="1" stop-color="var(--color-water-dark)" />
            </linearGradient>
          </defs>
        </>
      );
    }

    return (
      <svg width="100%" height="auto" viewBox="0 0 46 46" fill="none">
        <circle cx="23" cy="35" r="6" fill="var(--color-seed)" />
        {props.showWaterProgress !== false && renderWater()}
      </svg>
    );
  }

  function renderPot() {
    const sPotStart = 45;
    const sPotEnd = 85;
    const lPotStart = 78;
    const lPotEnd = 55;

    const sPot = sPotStart + (sPotEnd - sPotStart) * props.idea.potSaturation;
    const lPot = lPotStart + (lPotEnd - lPotStart) * props.idea.potSaturation;

    const potColor = "hsl(from var(--color-pot) h " + sPot + " " + lPot + ")";

    const potShapes = [
      <>
        <ellipse cx="23" cy="24" rx="13" ry="3" fill={potColor} />
        <path d="M0 0H46L36 24H10L0 0Z" fill={potColor} />
      </>,
      <>
        <ellipse cx="23" cy="24" rx="19" ry="3" fill={potColor} />
        <path d={"M0 0H46L42 24H4L0 0Z"} fill={potColor} />
      </>,
      <>
        <path d="M46 0H0C0 9.93334 3.96094 18.7002 10 23.9266H36C42.0391 18.7002 46 9.93334 46 0Z" fill={potColor} />
        <ellipse cx="23" cy="24" rx="13" ry="3" fill={potColor} />
      </>,
    ];

    const potShape = potShapes[Math.floor(props.idea.potShape * potShapes.length)];

    return (
      <div class="plant__pot">
        <svg class="plant__pot__back" width="100%" height="auto" viewBox="0 0 46 3" fill="none">
          <path d="M23 0C35.7025 0 46 1.34315 46 3H0C0 1.34315 10.2975 0 23 0Z" fill="var(--color-soil)" />
        </svg>
        <svg class="plant__pot__front" width="100%" height="auto" viewBox="0 0 46 27" fill="none">
          {potShape}
          <path d="M46 0C46 1.65685 35.7025 3 23 3C10.2975 3 0 1.65685 0 0H46Z" fill="var(--color-soil)" />
        </svg>
      </div>
    );
  }

  return (
    <div class="plant">
      {props.showLeaves !== false || !props.idea.result ?
        <div class="plant__leaves">
          {props.idea.result ? renderLeaves() : renderSeed()}
        </div>
        : null
      }
      {renderPot()}
    </div>
  );
}

export function getLeafColors(idea) {
  const hLeafStart = 53;
    const hLeafStartDk = 90;
    const hLeafEnd = 158;
    const hLeafEndDk = 195;

    const hLeaf = hLeafStart + (hLeafEnd - hLeafStart) * idea.leafHue;
    const hLeafDk = hLeafStartDk + (hLeafEndDk - hLeafStartDk) * idea.leafHue;

    const lLeafStart = 37;
    const lLeafStartDk = 20;
    const lLeafEnd = 47;
    const lLeafEndDk = 30;

    const lLeaf = lLeafStart + (lLeafEnd - lLeafStart) * idea.leafLightness;
    const lLeafDk = lLeafStartDk + (lLeafEndDk - lLeafStartDk) * idea.leafLightness;

    const leafColor = "hsl(from var(--color-primary-light) " + hLeaf + " s " + lLeaf + ")";
    const leafColorDk = "hsl(from var(--color-primary-dark) " + hLeafDk + " s " + lLeafDk + ")";

    return {leafColor, leafColorDk};
}
