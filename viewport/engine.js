import { Engine, Scene, Color4 } from '@babylonjs/core'
import skybox from './skybox.js'

const
    canvas = document.getElementById('viewport'),
    engine = new Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
        antialias: true,
        alpha: true,
        limitDeviceRatio: window.devicePixelRatio,
    }, true)

const
    createScene = options => {
        const scene = new Scene(engine, options)
        scene.clearColor = new Color4(0, 0, 0, 0)
        return scene
    },
    mainScene = freeze => engine.scenes.forEach(scene =>
        scene.render(!freeze, freeze)
    ),
    frozenScene = () => mainScene(true)

let wakelock, video // TODO: replace with top-level await
const
    pause = async ({ unfullscreen } = {}) => {
        if (unfullscreen) document.exitFullscreen()
        if (wakelock) {
            engine.stopRenderLoop()
            wakelock = await wakelock.release()
            video?.pause()
        }
    },
    play = async ({ renderLoops = [] } = {}) => {
        if (!document.fullscreenEnabled)
            document.body.requestFullscreen({ navigationUI: 'hide' })

        video ??= await skybox()
        const resume = () => {
            video?.play()
            engine.runRenderLoop(mainScene)
            for (const renderer of renderLoops) engine.runRenderLoop(renderer)
        }

        if (!wakelock) {
            resume()
            wakelock = await navigator.wakeLock.request('screen')
        } else { // if press play after switch tab
            engine.stopRenderLoop(frozenScene)
            resume()
        }

        const constraints = navigator.mediaDevices.getSupportedConstraints()
    };

window.onresize = () => engine.resize()
document.onvisibilitychange = async function () {
    switch (this.visibilityState) {
        case 'visible':
            engine.runRenderLoop(frozenScene)
            wakelock ??= await navigator.wakeLock.request('screen')
            break
        case 'hidden':
            pause()
            break
    }
}

Object.assign(engine, { play, pause, createScene })
export { engine as default, play, pause }
