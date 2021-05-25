import { Html, softShadows } from "@react-three/drei"
import { Canvas, invalidate } from "@react-three/fiber"
import { Suspense, useEffect, useState } from "react"
import { useSpring } from "react-spring/three"
import useStore from "../../states/modelState"
import useRecorderStore from "../../states/recorderState"
import CanvasBackground from "./canvasBackground/CanvasBackground"
import DecalHelper from "./DecalHelper"
import Model from "./Model"
import Overlay from "../overlay/Overlay"
import RenderController from "./RenderController"
import Scenes from "./Scenes"
import Credit from "../credit/Credit"

softShadows({
    near: 0.03,
    samples: 20,
})

const Viewer = () => {
    const [modelFlipped, setModelFlipped] = useState(false)
    const [modelRayData, setModelRayData] = useState(null)
    const modelUrl = "/tshirt.glb"
    const {
        animation,
        decalPath,
        decalSize,
        decrementDecalSize,
        incrementDecalSize,
        setGl,
        set,
        backgroundImage,
    } = useStore()
    const { active, mode } = useRecorderStore()

    useEffect(() => console.log(decalPath), [decalPath])
    // KEYDOWN
    useEffect(() => {
        function handlekeydownEvent(e) {
            const { key } = e
            if (!animation && !active) {
                key === "r" && setModelFlipped((prev) => (prev ? false : true))
            }
            if (!active && decalPath) {
                e.preventDefault() // prevent arrow scrolling
                key === "ArrowUp" && incrementDecalSize(0.01)
                key === "ArrowDown" && decrementDecalSize(0.01)
            }
        }
        document.addEventListener("keydown", handlekeydownEvent)
        return () => {
            document.removeEventListener("keydown", handlekeydownEvent)
        }
    }, [active, decalPath, animation])

    // FLIP ANIMATION
    const flipModelAnimation = useSpring({
        config: { tension: 300, mass: 1.3 },
        rotation: modelFlipped ? [0, Math.PI / 1, 0] : [0, 0, 0],
        onChange: () => invalidate(),
    })

    useEffect(() => {
        console.log(backgroundImage.author)
    }, [backgroundImage])

    return (
        <CanvasBackground>
            <Overlay />
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
            {backgroundImage.author?.name && set === "bg_image" && (
                <Credit
                    name={backgroundImage.author.name}
                    link={backgroundImage.author.link}
                />
            )}
        </CanvasBackground>
    )
}

export default Viewer
