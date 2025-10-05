'use client';
import * as THREE from 'three';
import { OrbitalData } from './types';

const DEG2RAD = Math.PI / 180;

/**
 * Solves Kepler's equation M = E - e * sin(E) for E using an iterative method.
 */
function solveKeplerEquation(e: number, M: number, tol: number = 1e-12): number {
    const Mnorm = M % (2 * Math.PI);
    let E = Mnorm + (-0.5 * e * e * e + e + (e * e + 1.5 * Math.cos(Mnorm) * e * e * e) * Math.cos(Mnorm)) * Math.sin(Mnorm);
    let dE = tol + 1;
    let count = 0;
    while (dE > tol) {
        const cosE = Math.cos(E);
        const sinE = Math.sin(E);
        const t1 = cosE;
        const t2 = -1 + e * t1;
        const t3 = sinE;
        const t4 = e * t3;
        const t5 = -E + t4 + Mnorm;
        const t6 = t5 / (0.5 * t5 * t4 / t2 + t2);
        const E_new = E - t5 / ((0.5 * t3 - (1/6) * t1 * t6) * e * t6 + t2);
        dE = Math.abs(E - E_new);
        E = E_new;
        count++;
        if (count > 100) {
            console.error("KeplerSolve failed to converge!");
            return E;
        }
    }
    return E;
}

/**
 * Generates the 3D points for an elliptical orbit based on Keplerian parameters.
 */
export function generateOrbitPath(orbitalData: OrbitalData, numPoints: number = 200): THREE.Vector3[] {
    const a = parseFloat(orbitalData.semi_major_axis);
    const e = parseFloat(orbitalData.eccentricity);
    const i = parseFloat(orbitalData.inclination) * DEG2RAD;
    const o = parseFloat(orbitalData.ascending_node_longitude) * DEG2RAD;
    const w = parseFloat(orbitalData.perihelion_argument) * DEG2RAD;
    const points: THREE.Vector3[] = [];
    const rotI = new THREE.Matrix4().makeRotationX(i);
    const rotO = new THREE.Matrix4().makeRotationZ(o);
    const rotW = new THREE.Matrix4().makeRotationZ(w);
    const rotationMatrix = new THREE.Matrix4().multiply(rotO).multiply(rotI).multiply(rotW);
    for (let j = 0; j <= numPoints; j++) {
        const M = (j / numPoints) * 2 * Math.PI;
        const E = solveKeplerEquation(e, M);
        const x = a * (Math.cos(E) - e);
        const y = a * Math.sqrt(1 - e * e) * Math.sin(E);
        const z = 0;
        const point = new THREE.Vector3(x, y, z);
        point.applyMatrix4(rotationMatrix);
        points.push(point);
    }
    return points;
}

/**
 * Calculates the position of the asteroid for a specific mean anomaly.
 */
export function getPositionAtMeanAnomaly(orbitalData: OrbitalData, meanAnomaly?: number): THREE.Vector3 {
    const M = meanAnomaly !== undefined ? meanAnomaly : parseFloat(orbitalData.mean_anomaly) * DEG2RAD;
    const a = parseFloat(orbitalData.semi_major_axis);
    const e = parseFloat(orbitalData.eccentricity);
    const i = parseFloat(orbitalData.inclination) * DEG2RAD;
    const o = parseFloat(orbitalData.ascending_node_longitude) * DEG2RAD;
    const w = parseFloat(orbitalData.perihelion_argument) * DEG2RAD;
    const E = solveKeplerEquation(e, M);
    const x = a * (Math.cos(E) - e);
    const y = a * Math.sqrt(1 - e * e) * Math.sin(E);
    const z = 0;
    const position = new THREE.Vector3(x, y, z);
    const rotI = new THREE.Matrix4().makeRotationX(i);
    const rotO = new THREE.Matrix4().makeRotationZ(o);
    const rotW = new THREE.Matrix4().makeRotationZ(w);
    const rotationMatrix = new THREE.Matrix4().multiply(rotO).multiply(rotI).multiply(rotW);
    position.applyMatrix4(rotationMatrix);
    return position;
}

/**
 * Calculates the animated position of the asteroid at a given elapsed time.
 */
export function getAnimatedPosition(orbitalData: OrbitalData, elapsedTime: number, simulationSpeed: number): THREE.Vector3 {
    const T_days = parseFloat(orbitalData.orbital_period);
    const T_seconds = T_days * 24 * 60 * 60; // Orbital period in seconds

    if (T_seconds <= 0) {
        return getPositionAtMeanAnomaly(orbitalData); // Fallback to initial position
    }

    const n = (2 * Math.PI) / T_seconds; // Mean motion (rad/s)
    const M0 = parseFloat(orbitalData.mean_anomaly) * DEG2RAD; // Initial mean anomaly at epoch
    const M = (M0 + n * elapsedTime * simulationSpeed) % (2 * Math.PI); // Current mean anomaly
    
    return getPositionAtMeanAnomaly(orbitalData, M);
}
