import { AmmoPhysics, ExtendedObject3D, PhysicsLoader } from '@enable3d/ammo-physics';
import { Project, Scene3D } from 'enable3d'
import * as THREE from 'three'
import { PerspectiveCamera } from 'three';

export class RagDoll extends Scene3D {
  async init() {
    this.renderer.setPixelRatio(1)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  async preload() {

  }

  async create() {
    // set up scene (light, ground, grid, sky, orbitControls)
    this.warpSpeed()

    // position camera
    this.camera.position.set(13, 10, 23)

    //this.haveSomeFun()
    this.physics.debug?.enable()

    // basic shapes
    this.physics.add.sphere({ name: 'ball', z: -4, x: -4, heightSegments: 32, widthSegments: 32}, {phong: {color: 'orange'}})
    this.physics.add.cylinder({ name: 'cylinder', z: -4, heightSegments: 32, radiusSegments: 32}, {phong: {color: 'yellow'}})
    this.physics.add.torus({ name: 'torus', z: -4, x: 4, tube: 0.3, tubularSegments: 32}, {phong: {color: 'green'}})

    // rag doll
    let head = this.physics.add.sphere({ name: 'head', radius: 0.5, z: 0.2 });
    let torso = this.physics.add.box({ name: 'torso', z: 1.8, depth: 2, height: 0.5 })

    let leftUpperArm = this.physics.add.box({ name: 'leftUpperArm', z: 1, x: -1.2, depth: 0.3, width: 1, height: 0.5 })
    let leftUnderArm = this.physics.add.box({ name: 'leftUnderArm', z: 1, x: -2.4, depth: 0.3, width: 1, height: 0.5 })

    let rightUpperArm = this.physics.add.box({ name: 'rightUpperArm', z: 1, x: 1.2, depth: 0.3, width: 1, height: 0.5 })
    let rightUnderArm = this.physics.add.box({ name: 'rightUnderArm', z: 1, x: 2.4, depth: 0.3, width: 1, height: 0.5 })

    let leftUpperLeg = this.physics.add.box({ name: 'leftUpperLeg', z: 3.5, x: -0.35, depth: 1, width: 0.3, height: 0.5 })
    let leftUnderLeg = this.physics.add.box({ name: 'leftUnderLeg', z: 4.7, x: -0.35, depth: 1, width: 0.3, height: 0.5 })

    let rightUpperLeg = this.physics.add.box({ name: 'rightUpperLeg', z: 3.5, x: 0.35, depth: 1, width: 0.3, height: 0.5 })
    let rightUnderLeg = this.physics.add.box({ name: 'rightUnderLeg', z: 4.7, x: 0.35, depth: 1, width: 0.3, height: 0.5 })

    this.physics.add.constraints.pointToPoint(head.body, torso.body, {
      pivotA: { z: 0.7 },
      pivotB: { z: -1 }
    })

    this.physics.add.constraints.pointToPoint(torso.body, leftUpperArm.body, {
      pivotA: { z: -0.9, x: -0.5 },
      pivotB: { x: 0.6 }
    })
    this.physics.add.constraints.pointToPoint(leftUpperArm.body, leftUnderArm.body, {
      pivotA: { x: -0.6 },
      pivotB: { x: 0.6 }
    })
    this.physics.add.constraints.pointToPoint(torso.body, rightUpperArm.body, {
      pivotA: { z: -0.9, x: 0.5 },
      pivotB: { x: -0.6 }
    })
    this.physics.add.constraints.pointToPoint(rightUpperArm.body, rightUnderArm.body, {
      pivotA: { x: 0.6 },
      pivotB: { x: -0.6 }
    })

    this.physics.add.constraints.pointToPoint(torso.body, leftUpperLeg.body, {
      pivotA: { z: 1.2, x: -0.4 },
      pivotB: { z: -0.5 }
    })
    this.physics.add.constraints.pointToPoint(leftUpperLeg.body, leftUnderLeg.body, {
      pivotA: { z: 0.55 },
      pivotB: { z: -0.55 }
    })
    this.physics.add.constraints.pointToPoint(torso.body, rightUpperLeg.body, {
      pivotA: { z: 1.2, x: 0.4 },
      pivotB: { z: -0.5 }
    })
    this.physics.add.constraints.pointToPoint(rightUpperLeg.body, rightUnderLeg.body, {
      pivotA: { z: 0.55 },
      pivotB: { z: -0.55 }
    })

    // head.body.applyForceY(20)

    window.addEventListener('click', event => {
      // THREE RAYCASTER
      var raycaster = new THREE.Raycaster(); // create once
      var mouse = new THREE.Vector2(); // create once
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
      // update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, this.camera as any);

      // START - END
      var start = new THREE.Vector3()
      var end = new THREE.Vector3()
      raycaster.ray.at(0.1, start)
      raycaster.ray.at(500, end)

      // CLOSEST
      var closest = this.physics.add.raycaster('closest') // 'closest' is the default
      closest.setRayFromWorld(start.x, start.y, start.z)
      closest.setRayToWorld(end.x, end.y, end.z)
      closest.rayTest()
      if (closest.hasHit()) {
        const { x, y, z } = closest.getHitPointWorld()
        const { name, body } = closest.getCollisionObject()
        console.log('closest:', `${name}:`, `x:${x.toFixed(2)}`, `y:${x.toFixed(2)}`, `z:${x.toFixed(2)}`)

        body.applyForceY(5)
      }

      closest.destroy()
    })
  }

  update() {

  }
}

// set your project configs
const config = { scenes: [RagDoll], antialias: true, gravity: { x: 0, y: -9.81, z: 0 } }
PhysicsLoader('/ammo', () => new Project(config))