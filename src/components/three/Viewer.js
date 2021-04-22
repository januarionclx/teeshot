import { softShadows } from "@react-three/drei"
import { Canvas, invalidate } from "@react-three/fiber"
import { Suspense, useEffect, useState } from "react"
import { useSpring } from "react-spring/three"
import useStore from "../../states/modelState"
import ControlPanel from "../ControlPanel"
import PhotoButton from "../PhotoButton"
import CanvasBackground from "./CanvasBackground"
import DecalHelper from "./DecalHelper"
import Model from "./Model"
import Scenes from "./Scenes"
import logo from "../../assets/images/logo.png"

softShadows({
    near: 0.04,
    samples: 20,
})

const Viewer = () => {
    const [modelFlipped, setModelFlipped] = useState(false)
    const [modelRayData, setModelRayData] = useState(null)
    const [gl, setGl] = useState(null)
    const {
        decalPath,
        decalSize,
        incrementDecalSize,
        decrementDecalSize,
    } = useStore()

    // KEYDOWN
    useEffect(() => {
        function handlekeydownEvent(event) {
            const { key } = event
            key === "r" && setModelFlipped((prev) => (prev ? false : true))
            key === "ArrowUp" && incrementDecalSize(0.01)
            key === "ArrowDown" && decrementDecalSize(0.01)
        }
        document.addEventListener("keydown", handlekeydownEvent)
        return () => {
            document.removeEventListener("keydown", handlekeydownEvent)
        }
    }, [])

    // ANIMATION
    const flipModelAnimation = useSpring({
        config: { tension: 300, mass: 1.3 },
        rotation: modelFlipped ? [0, Math.PI / 1, 0] : [0, 0, 0],
        onChange: () => invalidate(),
    })

    return (
        <>
            <CanvasBackground>
                <Canvas
                    style={decalPath && { cursor: "none" }}
                    gl={{ preserveDrawingBuffer: true /*, antialias: false*/ }}
                    camera={{ position: [0, 0, 2.2], fov: 50 }}
                    frameloop="demand"
                    shadows
                    onCreated={({ gl }) => setGl(gl)}
                >
                    <DecalHelper modelRayData={modelRayData} size={decalSize} />
                    <Suspense fallback={null}>
                        <Model
                            url="/tshirt.glb"
                            rotation={flipModelAnimation.rotation}
                            setModelRayData={setModelRayData}
                        />
                    </Suspense>
                    <Scenes />
                </Canvas>
            </CanvasBackground>
            <img src={logo} alt="Logo" style={styles.logo} />
            <PhotoButton gl={gl} style={styles.logo} />
            <ControlPanel />
        </>
    )
}
const styles = {
    logo: {
        position: "absolute",
        top: 0,
        width: "120px",
        margin: "30px",
    },
}

export default Viewer
