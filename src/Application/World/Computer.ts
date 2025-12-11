import * as THREE from 'three';
import Application from '../Application';
import BakedModel from '../Utils/BakedModel';
import Resources from '../Utils/Resources';

export default class Computer {
    application: Application;
    scene: THREE.Scene;
    resources: Resources;
    bakedModel: BakedModel;
    labelMesh?: THREE.Mesh;

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;
        this.resources = this.application.resources;

        this.bakeModel();
        this.setModel();
        this.addFrontLabel();
    }

    bakeModel() {
        this.bakedModel = new BakedModel(
            this.resources.items.gltfModel.computerSetupModel,
            this.resources.items.texture.computerSetupTexture,
            900
        );
    }

    setModel() {
        this.scene.add(this.bakedModel.getModel());
    }

    addFrontLabel() {
        const text = 'BKDLabs Pvt Ltd';

        // Create a small canvas texture with the label text
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#111111';
        ctx.font = 'bold 52px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 24, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.encoding = THREE.sRGBEncoding;

        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
        });

        // Small plane placed on the front of the monitor bezel to cover old baked text
        const geometry = new THREE.PlaneGeometry(240, 48);
        const mesh = new THREE.Mesh(geometry, material);

        // Reuse the monitor screen placement from MonitorScreen to align orientation
        const screenPosition = new THREE.Vector3(0, 950, 255);
        const screenRotation = new THREE.Euler(
            -3 * THREE.MathUtils.DEG2RAD,
            0,
            0
        );

        // Offset to sit on the lower-left bezel area and float slightly above the baked label
        mesh.position.copy(
            screenPosition.clone().add(new THREE.Vector3(-190, -190, 28))
        );
        mesh.rotation.copy(screenRotation);

        mesh.renderOrder = 5; // keep on top of baked texture

        this.labelMesh = mesh;
        this.scene.add(mesh);
    }
}
