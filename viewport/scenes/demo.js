import { GridMaterial } from "@babylonjs/materials"
import {
    DeviceOrientationCamera,
    Vector3,
    HemisphericLight,
    Mesh,
} from '@babylonjs/core'

import engine from '../engine.js'

export default () => {
    const // environment
        scene = engine.createScene(),
        light = new HemisphericLight("global_light", new Vector3(0, 1, 0)),
        camera = new DeviceOrientationCamera("player_perspective", new Vector3(0, 5, -10), scene)
    camera.attachControl(engine.getRenderingCanvas(), true)

    const // object
        material = new GridMaterial("grid", scene),
        sphere = new Mesh.CreateSphere("sphere", 16, 2, scene),
        ground = Mesh.CreateGround("plane", 6, 6, 2, scene)

    light.intensity = .7
    camera.setTarget(new Vector3(0, 0, 10))

    sphere.position.y = 1
    sphere.material = material
    ground.material = material

    return scene
}
