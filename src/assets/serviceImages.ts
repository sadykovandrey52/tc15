import hero from "./hero-service.jpg";
import suspension from "./cat-suspension.jpg";
import brakes from "./cat-brakes.jpg";
import engine from "./cat-engine.jpg";
import transmission from "./cat-transmission.jpg";
import diagnostics from "./cat-diagnostics.jpg";

import shocks from "./svc-shocks.jpg";
import silentBlocks from "./svc-silent-blocks.jpg";
import ballJoints from "./svc-ball-joints.jpg";
import supportBearing from "./svc-support-bearing.jpg";
import controlArms from "./svc-control-arms.jpg";
import steeringRack from "./svc-steering-rack.jpg";
import tieRods from "./svc-tie-rods.jpg";
import alignment from "./svc-alignment.jpg";
import cvJoint from "./svc-cv-joint.jpg";
import starter from "./svc-starter.jpg";
import alternator from "./svc-alternator.jpg";
import timingBelt from "./svc-timing-belt.jpg";
import oil from "./svc-oil.jpg";
import service from "./svc-service.jpg";

export const heroImage = hero;

const byCategory: Record<string, string> = {
  suspension,
  steering: steeringRack,
  driveshaft: cvJoint,
  engine,
  maintenance: diagnostics,
};

const byService: Record<string, string> = {
  // Подвеска
  "suspension.repair": suspension,
  "suspension.shock-absorbers": shocks,
  "suspension.silent-blocks": silentBlocks,
  "suspension.ball-joints": ballJoints,
  "suspension.support-bearing": supportBearing,
  "suspension.control-arms": controlArms,
  // Рулевое
  "steering.rack": steeringRack,
  "steering.tie-rods": tieRods,
  "steering.tie-rod-ends": tieRods,
  "steering.alignment": alignment,
  // Привод
  "driveshaft.cv-joint": cvJoint,
  // Двигатель
  "engine.starter": starter,
  "engine.alternator": alternator,
  "engine.timing-belt": timingBelt,
  // ТО
  "maintenance.diagnostics": diagnostics,
  "maintenance.oil-change": oil,
  "maintenance.service": service,
  "maintenance.brakes": brakes,
};

export function imageForService(serviceId?: string, categoryId?: string): string | undefined {
  if (serviceId && byService[serviceId]) return byService[serviceId];
  if (categoryId && byCategory[categoryId]) return byCategory[categoryId];
  return undefined;
}

// Дополнительные кадры для галереи (1–2 на услугу), не повторяя hero
const galleryByService: Record<string, string[]> = {
  "suspension.repair": [suspension, controlArms, ballJoints],
  "suspension.shock-absorbers": [shocks, supportBearing, suspension],
  "suspension.silent-blocks": [silentBlocks, controlArms, suspension],
  "suspension.ball-joints": [ballJoints, controlArms, suspension],
  "suspension.support-bearing": [supportBearing, shocks, suspension],
  "suspension.control-arms": [controlArms, silentBlocks, ballJoints],
  "steering.rack": [steeringRack, tieRods, alignment],
  "steering.tie-rods": [tieRods, steeringRack, alignment],
  "steering.tie-rod-ends": [tieRods, alignment, steeringRack],
  "steering.alignment": [alignment, tieRods, steeringRack],
  "driveshaft.cv-joint": [cvJoint, suspension, transmission],
  "engine.starter": [starter, engine, diagnostics],
  "engine.alternator": [alternator, engine, diagnostics],
  "engine.timing-belt": [timingBelt, engine, service],
  "maintenance.diagnostics": [diagnostics, engine, service],
  "maintenance.oil-change": [oil, service, engine],
  "maintenance.service": [service, oil, diagnostics],
  "maintenance.brakes": [brakes, suspension, service],
};

export function galleryForService(serviceId?: string, categoryId?: string): string[] {
  if (serviceId && galleryByService[serviceId]) return galleryByService[serviceId];
  const fallback = imageForService(undefined, categoryId);
  return fallback ? [fallback] : [];
}

export function altForService(serviceName: string): string {
  return `${serviceName} в Tech Center 15, Москва`;
}
