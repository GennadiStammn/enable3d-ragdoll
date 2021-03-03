import { PhysicsLoader } from '@enable3d/ammo-physics';
import {Project, Scene3D} from 'enable3d'
import * as THREE from 'three'

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

    let head = this.physics.add.sphere({radius: 0.5, z: 0.2});
    let torso = this.physics.add.box({z:1.8, depth: 2, height: 0.5})

    let leftUpperArm = this.physics.add.box({z: 1, x: -1.2 , depth: 0.3, width: 1, height: 0.5})
    let leftUnderArm = this.physics.add.box({z: 1, x: -2.4 , depth: 0.3, width: 1, height: 0.5})

    let rightUpperArm = this.physics.add.box({z: 1, x: 1.2 , depth: 0.3, width: 1, height: 0.5})
    let rightUnderArm = this.physics.add.box({z: 1, x: 2.4 , depth: 0.3, width: 1, height: 0.5})

    let leftUpperLeg = this.physics.add.box({z: 3.5, x: -0.35, depth: 1, width: 0.3, height: 0.5})
    let leftUnderLeg = this.physics.add.box({z: 4.7, x: -0.35, depth: 1, width: 0.3, height: 0.5})

    let rightUpperLeg = this.physics.add.box({z: 3.5, x: 0.35, depth: 1, width: 0.3, height: 0.5})
    let rightUnderLeg = this.physics.add.box({z: 4.7, x: 0.35, depth: 1, width: 0.3, height: 0.5})

    this.physics.add.constraints.pointToPoint(head.body, torso.body, {
      pivotA: { z: 0.7 },
      pivotB: { z: -1 }
    })
    
    this.physics.add.constraints.pointToPoint(torso.body, leftUpperArm.body, {
      pivotA: { z: -0.9, x: -0.5},
      pivotB: { x: 0.6 }
    })
    this.physics.add.constraints.pointToPoint(leftUpperArm.body, leftUnderArm.body, {
      pivotA: { x: -0.6},
      pivotB: { x: 0.6 }
    })
    this.physics.add.constraints.pointToPoint(torso.body, rightUpperArm.body, {
      pivotA: { z: -0.9, x: 0.5},
      pivotB: { x: -0.6 }
    })
    this.physics.add.constraints.pointToPoint(rightUpperArm.body, rightUnderArm.body, {
      pivotA: { x: 0.6},
      pivotB: { x: -0.6 }
    })

    this.physics.add.constraints.pointToPoint(torso.body, leftUpperLeg.body, {
      pivotA: { z: 2.2, x: -0.4},
      pivotB: { z: 0.5 }
    })
    this.physics.add.constraints.pointToPoint(leftUpperLeg.body, leftUnderLeg.body, {
      pivotA: { z: 0.55},
      pivotB: { z: -0.55 }
    })
    this.physics.add.constraints.pointToPoint(torso.body, rightUpperLeg.body, {
      pivotA: { z: 2.2, x: 0.4},
      pivotB: { z: 0.5 }
    })
    this.physics.add.constraints.pointToPoint(rightUpperLeg.body, rightUnderLeg.body, {
      pivotA: { z: 0.55},
      pivotB: { z: -0.55 }
    })

    // head.body.applyForceY(20)

    this.initCanon(this.physics, this.camera)
  }

  update() {

  }

  initCanon = (physics, camera) => {
    const raycaster = new THREE.Raycaster()
    const force = 30

    window.addEventListener('pointerdown', event => {
      // calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = -(event.clientY / window.innerHeight) * 2 + 1
      raycaster.setFromCamera({ x, y }, camera)

      const pos = new THREE.Vector3()

      pos.copy(raycaster.ray.direction)
      pos.add(raycaster.ray.origin)

      const sphere = physics.add.sphere(
        {
          radius: 0.15,
          x: pos.x,
          y: pos.y,
          z: pos.z,
          mass: 20,
          bufferGeometry: true
        },
        { phong: { color: 0x202020 } }
      )
      sphere.body.setBounciness(0.2)

      pos.copy(raycaster.ray.direction)
      pos.multiplyScalar(24)

      sphere.body.applyForce(pos.x * force, pos.y * force, pos.z * force)
    })
  }
}

// set your project configs
const config = { scenes: [RagDoll], antialias: true, gravity: { x: 0, y: -9.81, z: 0 } }
PhysicsLoader('/ammo', () => new Project(config))