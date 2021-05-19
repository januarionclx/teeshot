import { softShadows } from "@react-three/drei"
import { Canvas, invalidate } from "@react-three/fiber"
import { Suspense, useEffect, useState } from "react"
import { useSpring } from "react-spring/three"
import useStore from "../../states/modelState"
import CanvasBackground from "./canvasBackground/CanvasBackground"
import DecalHelper from "./DecalHelper"
import Model from "./Model"
import Scenes from "./Scenes"
import RenderController from "./RenderController"
import useRecorderStore from "../../states/recorderState"

softShadows({
    near: 0.04,
    samples: 20,
})

const Viewer = () => {
    const [modelFlipped, setModelFlipped] = useState(false)
    const [modelRayData, setModelRayData] = useState(null)
    const modelUrl = "/tshirt.glb"
    const {
        decalPath,
        decalSize,
        decrementDecalSize,
        incrementDecalSize,
        setGl,
    } = useStore()
    const { active, mode } = useRecorderStore()

    // KEYDOWN
    useEffect(() => {
        function handlekeydownEvent(event) {
            if (!active) {
                const { key } = event
                key === "r" && setModelFlipped((prev) => (prev ? false : true))
                key === "ArrowUp" && incrementDecalSize(0.01)
                key === "ArrowDown" && decrementDecalSize(0.01)
            }
        }
        document.addEventListener("keydown", handlekeydownEvent)
        return () => {
            document.removeEventListener("keydown", handlekeydownEvent)
        }
    }, [active])

    // FLIP ANIMATION
    const flipModelAnimation = useSpring({
        config: { tension: 300, mass: 1.3 },
        rotation: modelFlipped ? [0, Math.PI / 1, 0] : [0, 0, 0],
        onChange: () => invalidate(),
    })

    return (
        <CanvasBackground >
            <Canvas
                camera={{ position: [0, 0, 2.2], fov: 50 }}
                dpr={[0.5, 2]}
                frameloop="demand"
                gl={{ preserveDrawingBuffer: true }}
                raycaster={{ far: 3.5 }}
                onCreated={(state) => setGl(state.gl)}
                shadows
                style={decalPath && { cursor: "none" }}
            >
                <DecalHelper modelRayData={modelRayData} size={decalSize} />
                <Suspense fallback={null}>
                    <Model
                        url={modelUrl}
                        rotation={flipModelAnimation.rotation}
                        setModelRayData={setModelRayData}
                    />
                </Suspense>
                <Scenes />
                {mode === "video" && <RenderController />}
            </Canvas>
        </CanvasBackground>
    )
}

export default Viewer
