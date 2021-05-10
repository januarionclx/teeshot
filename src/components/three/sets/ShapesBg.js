import { invalidate, useFrame } from "@react-three/fiber"
import { useRef, useMemo } from "react"

const ShapesBg = ({ backgroundColor }) => {
    const box = useRef()
    const sphere = useRef()
    const donut = useRef()
    const donutLarge = useRef()

    // ANIMATE
    // One degree in radians
    const oneDeg = useMemo(() => Math.PI / 180, [])
    // Shape rotation
    useFrame((state, delta) => {
        //const clockedRotation = oneDeg * 72 * state.clock.elapsedTime
        box.current.rotation.y += oneDeg * (360 / 300)
        donut.current.rotation.y += oneDeg * (360 / 300)
        donutLarge.current.rotation.y += oneDeg * (360 / 300)
        invalidate()
    })

    return (
        <group>
            <mesh position={[0, 0, -0.5]} receiveShadow>
                <planeBufferGeometry args={[10, 10]} />
                <meshStandardMaterial color={backgroundColor} />
            </mesh>
            <mesh
                ref={box}
                position={[0.5, 0, 0.5]}
                rotation={[4, 0, 0]}
                receiveShadow
            >
                <boxBufferGeometry args={[0.06, 0.06, 0.06]} />
                <meshStandardMaterial color={backgroundColor} />
            </mesh>
            <mesh ref={sphere} position={[-0.5, -0.2, 0.5]} receiveShadow>
                <sphereBufferGeometry args={[0.05, 20, 20]} />
                <meshStandardMaterial color={backgroundColor} />
            </mesh>
            <mesh
                ref={donutLarge}
                position={[-0.5, 0.6, 0]}
                rotation={[3, 5.5, 0]}
                receiveShadow
            >
                <torusBufferGeometry args={[0.07, 0.03, 10, 30]} />
                <meshStandardMaterial color={backgroundColor} />
            </mesh>
            <mesh
                ref={donut}
                position={[0.15, -0.45, 0.3]}
                rotation={[2.2, 3.5, 2]}
                receiveShadow
            >
                <torusBufferGeometry args={[0.05, 0.02, 10, 30]} />
                <meshStandardMaterial color={backgroundColor} />
            </mesh>
        </group>
    )
}

export default ShapesBg
