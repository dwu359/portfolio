import React, { Suspense, useRef, useState } from "react";
import { Canvas, context, useThree } from "@react-three/fiber";
import {
  CameraHelper,
  DirectionalLight,
  DirectionalLightHelper,
  PerspectiveCamera,
  Vector3,
} from "three/src/Three";
import {
  OrbitControls,
  Stars,
  useContextBridge,
  useHelper,
} from "@react-three/drei";
import MyName from "../components/wiretext3d";
import Overlay from "../components/overlay";
import WaveformAnalyzer from "../components/home/waveform-analyzer";
import useStartStore, { StartState } from "../state/start";
import Navbar from "../components/navbar";
import { useControls } from "leva";
import useAudioStore from "../state/audio";
import { useSpring } from "react-spring";
import useSpiralStore from "../state/spiral";
import Navigation from "../components/navigation";
// markup
//
export const Head = () => {
  return (
    <>
      <title>Portfolio</title>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />
    </>
  );
};
const IndexPage = () => {
  //const startval = useAppSelector((state) => state.startReducer.startval);
  const startStore = useStartStore();
  return (
    <>
      {startStore.startval !== StartState.Faded ? <Overlay></Overlay> : null}
      <Navbar />
      <div id="canvas-container">
        <Canvas camera={{ position: [0, 0, -2010], far: 1500 }}>
          <CameraControls />
          {<color attach="background" args={["black"]} />}
          <group scale={new Vector3(1, 1, 1)}>
            <Navigation />
            <Stars
              radius={100}
              depth={100}
              count={1000}
              factor={20}
              fade
              speed={1}
            />
          </group>
          {/*<ambientLight intensity={0.5} />*/}
          {/*<TestPoint position={new Vector3(0, 0, 0)} />*/}
        </Canvas>
      </div>
    </>
  );
};

export default IndexPage;

const CameraControls = () => {
  const { camera } = useThree();
  const startStore = useStartStore();
  const spiralStore = useSpiralStore();
  const audioStore = useAudioStore();
  /*
  const bool = useControls({
    bool: false,
  });*/
  useSpring({
    t: startStore.startval !== StartState.Initialized ? 0 : 1,
    onChange: (result, spring, item) => {
      let t = spring.get().t;
      camera.position.set(
        -740 * t * Math.cos(2 * Math.PI * t),
        0,
        740 * t * Math.sin(2 * Math.PI * t) - 10
      );
      //let [x, y, z] = [camera.position.x, camera.position.y, camera.position.z];
      //camera.rotation.set(0, Math.PI, 0);
      //camera.lookAt(0, 0, 0);
    },
    onRest: () => {
      if (!spiralStore.done) {
        audioStore.play();
        spiralStore.notifyDone();
      }
    },
    config: {
      //tension: 100,
      friction: 33,
      precision: 0.00001,
    },
  });
  return <OrbitControls enabled={true} maxDistance={750} />;
};
function Light() {
  const light = useRef<DirectionalLight>(null!);
  useHelper(light, DirectionalLightHelper);
  return <directionalLight ref={light} position={[0, 0, -5]} />;
}

function TestCamera() {
  const camera = useRef<PerspectiveCamera>(null!);
  useHelper(camera, CameraHelper);
  return (
    <perspectiveCamera
      near={2}
      far={10}
      ref={camera}
      position={new Vector3(0, 0, 5)}
    ></perspectiveCamera>
  );
}

interface TestPointProps {
  position: Vector3 | undefined;
}
function TestPoint({ position }: TestPointProps) {
  //const startval = useAppSelector((state) => state.startReducer.startval);
  return (
    <mesh position={position}>
      <sphereGeometry></sphereGeometry>
      <meshBasicMaterial></meshBasicMaterial>
    </mesh>
  );
}
