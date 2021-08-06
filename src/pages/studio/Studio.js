import React from "react"
//import { Link } from "react-router-dom"
import Button from "../../components/button/Button"
import CapturePanel from "../../components/capturePanel/CapturePanel"
import ControlPanel from "../../components/controlPanel/ControlPanel"
import Navbar from "../../components/navbar/Navbar"
import Spacer from "../../components/spacer/Spacer"
import Viewer from "../../components/three/Viewer"
import styles from "./studio.module.css"
// import useAuth from "../../constants/useAuth"
// import { auth } from "../../constants/firebase"

export default function Studio() {
    //const user = useAuth()
    return (
        <>
            <Navbar>
                <Button
                    text="Donate"
                    type="filled"
                    style={{ width: "150px" }}
                />
            </Navbar>
            <div className={styles.wrapper}>
                <div className={styles.main}>
                    <Viewer />
                    <CapturePanel />
                </div>
                <Spacer size={25} orientation="vertical" />
                <div className={styles.controlPanelWrapper}>
                    <ControlPanel />
                </div>
            </div>
        </>
    )
}
